/**
 * Dua Organics — Authentication Context
 *
 * Real authentication backed by Supabase Auth + the `profiles` table
 * (see supabase/schema.sql). Roles ('customer' | 'admin') live in that
 * table and are enforced server-side via Row Level Security, so this
 * context is just a thin, typed wrapper around the Supabase client.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/* User interface representing a registered customer or admin */
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  joinedDate: string;
}

/* Saved address interface */
export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  isDefault: boolean;
}

/* Order history item — NOTE: there's no real order/checkout system yet.
 * Orders are still taken over WhatsApp, so this stays demo data until
 * a proper orders table + checkout flow is built. */
export interface Order {
  id: string;
  date: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
}

const DEMO_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    date: '2025-11-15',
    items: [
      { productId: 'prod-001', name: 'Organic Face Serum', quantity: 1, price: 2500 },
      { productId: 'prod-005', name: 'Honey Beeswax Lip Balm', quantity: 2, price: 450 },
    ],
    total: 3400,
    status: 'delivered',
  },
  {
    id: 'ORD-002',
    date: '2025-11-28',
    items: [
      { productId: 'prod-002', name: 'Shea Body Butter', quantity: 1, price: 1800 },
    ],
    total: 1800,
    status: 'shipped',
  },
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  /** True while we're checking for an existing session on first load. */
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; isAdmin: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'phone'>>) => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  orders: Order[];
}

const AuthContext = createContext<AuthContextType | null>(null);

/** Load the profiles row for a Supabase auth user and map it to our `User` shape. */
async function fetchProfile(authUser: { id: string; email?: string | null }): Promise<User> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();
  if (error) throw error;
  return {
    id: authUser.id,
    name: data.name ?? '',
    email: authUser.email ?? '',
    phone: data.phone ?? '',
    role: data.role,
    addresses: data.addresses ?? [],
    joinedDate: data.joined_date,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders] = useState<Order[]>(DEMO_ORDERS);

  /* On mount: restore any existing session, then keep listening for changes
   * (login, logout, token refresh in another tab, etc). */
  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!active) return;
      if (session?.user) {
        try {
          setUser(await fetchProfile(session.user));
        } catch (err) {
          console.error('Failed to load profile:', err);
        }
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;
      if (session?.user) {
        try {
          setUser(await fetchProfile(session.user));
        } catch (err) {
          console.error('Failed to load profile:', err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  /* Login handler — real Supabase auth check. Returns isAdmin directly
   * (rather than relying on context state) so the caller can navigate
   * correctly without waiting for a re-render. */
  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return { success: false, isAdmin: false, error: error?.message ?? 'Invalid credentials.' };
    }
    try {
      const profile = await fetchProfile(data.user);
      setUser(profile);
      return { success: true, isAdmin: profile.role === 'admin' };
    } catch (err: any) {
      return { success: false, isAdmin: false, error: err.message ?? 'Could not load profile.' };
    }
  }, []);

  /* Register handler — creates a Supabase auth user; a DB trigger
   * (handle_new_user in schema.sql) automatically creates the matching
   * `profiles` row with role='customer'. */
  const register = useCallback(async (name: string, email: string, phone: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } },
    });
    if (error) return { success: false, error: error.message };

    if (data.user && !data.session) {
      // Email confirmation is required before a session exists.
      return { success: true, error: 'Check your email to confirm your account, then sign in.' };
    }
    if (data.user) {
      try {
        setUser(await fetchProfile(data.user));
      } catch (err) {
        console.error('Failed to load profile after signup:', err);
      }
    }
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    supabase.auth.signOut();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Pick<User, 'name' | 'phone'>>) => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({ name: updates.name ?? user.name, phone: updates.phone ?? user.phone })
      .eq('id', user.id);
    if (error) throw error;
    setUser(prev => (prev ? { ...prev, ...updates } : null));
  }, [user]);

  const addAddress = useCallback(async (address: Omit<Address, 'id'>) => {
    if (!user) return;
    const newAddress: Address = { ...address, id: `addr-${Date.now()}` };
    const updated = [...user.addresses, newAddress];
    const { error } = await supabase.from('profiles').update({ addresses: updated }).eq('id', user.id);
    if (error) throw error;
    setUser(prev => (prev ? { ...prev, addresses: updated } : null));
  }, [user]);

  const removeAddress = useCallback(async (id: string) => {
    if (!user) return;
    const updated = user.addresses.filter(a => a.id !== id);
    const { error } = await supabase.from('profiles').update({ addresses: updated }).eq('id', user.id);
    if (error) throw error;
    setUser(prev => (prev ? { ...prev, addresses: updated } : null));
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        removeAddress,
        orders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context throughout the app
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
