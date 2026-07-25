/**
 * Dua Organics — Customer Dashboard
 * 
 * Authenticated customer area with profile settings,
 * order history, and saved addresses.
 */
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Settings, LogOut, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Tab = 'profile' | 'orders' | 'addresses' | 'settings';

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading, logout, orders, updateProfile, addAddress, removeAddress } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const navigate = useNavigate();

  /* Address form state */
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', street: '', city: '', region: '', postalCode: '', isDefault: false });

  /* Profile edit state */
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [profileSaved, setProfileSaved] = useState(false);

  /* Wait for the session check before deciding whether to redirect —
   * otherwise a page refresh briefly bounces logged-in users to /login. */
  if (authLoading) {
    return <main className="pt-24 pb-20 min-h-screen flex items-center justify-center text-gray-400">Loading…</main>;
  }

  /* Redirect if not authenticated */
  if (!isAuthenticated || !user) return <Navigate to="/login" />;

  /* Handle profile save */
  const handleProfileSave = async () => {
    try {
      await updateProfile({ name: editName, phone: editPhone });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err: any) {
      alert(`Failed to save profile: ${err.message ?? 'unknown error'}`);
    }
  };

  /* Handle address add */
  const handleAddAddress = async () => {
    if (newAddress.label && newAddress.street && newAddress.city) {
      try {
        await addAddress(newAddress);
        setNewAddress({ label: '', street: '', city: '', region: '', postalCode: '', isDefault: false });
        setShowAddressForm(false);
      } catch (err: any) {
        alert(`Failed to save address: ${err.message ?? 'unknown error'}`);
      }
    }
  };

  /* Handle logout */
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <Helmet>
        <title>My Dashboard — Dua Organics</title>
        <meta name="description" content="Manage your Dua Organics account, view order history, and update your profile." />
      </Helmet>

      <main className="pt-24 pb-20 bg-cream-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-forest-900">
              Welcome, {user.name} 👋
            </h1>
            <p className="text-gray-500 mt-1">Manage your account and orders</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <nav className="space-y-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-forest-700 text-white'
                          : 'text-gray-600 hover:bg-forest-50'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">

                {/* ===== Profile Tab ===== */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-forest-900 mb-6">Profile Information</h2>
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={e => setEditPhone(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                        <p className="text-sm text-gray-500">{new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                      </div>
                      <button
                        onClick={handleProfileSave}
                        className="bg-forest-700 hover:bg-forest-800 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors"
                      >
                        Save Changes
                      </button>
                      {profileSaved && <p className="text-green-600 text-sm">✓ Profile updated successfully!</p>}
                    </div>
                  </div>
                )}

                {/* ===== Orders Tab ===== */}
                {activeTab === 'orders' && (
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-forest-900 mb-6">Order History</h2>
                    {orders.length === 0 ? (
                      <p className="text-gray-400">No orders yet. Start shopping!</p>
                    ) : (
                      <div className="space-y-4">
                        {orders.map(order => (
                          <div key={order.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <span className="font-semibold text-forest-900">{order.id}</span>
                                <span className="text-gray-400 text-sm ml-3">
                                  {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm text-gray-600">
                                  <span>{item.name} × {item.quantity}</span>
                                  <span>KES {(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                              <span className="font-semibold text-sm text-forest-900">Total</span>
                              <span className="font-bold text-forest-800">KES {order.total.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ===== Addresses Tab ===== */}
                {activeTab === 'addresses' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-heading text-2xl font-bold text-forest-900">Saved Addresses</h2>
                      <button
                        onClick={() => setShowAddressForm(!showAddressForm)}
                        className="flex items-center gap-1 bg-forest-700 hover:bg-forest-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add New
                      </button>
                    </div>

                    {/* Add Address Form */}
                    {showAddressForm && (
                      <div className="bg-forest-50 rounded-xl p-6 mb-6 space-y-3">
                        <input
                          type="text" placeholder="Label (e.g., Home, Office)"
                          value={newAddress.label} onChange={e => setNewAddress({ ...newAddress, label: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                        />
                        <input
                          type="text" placeholder="Street Address"
                          value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text" placeholder="City"
                            value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                          />
                          <input
                            type="text" placeholder="Region"
                            value={newAddress.region} onChange={e => setNewAddress({ ...newAddress, region: e.target.value })}
                            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                          />
                        </div>
                        <input
                          type="text" placeholder="Postal Code"
                          value={newAddress.postalCode} onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                        />
                        <div className="flex gap-3">
                          <button onClick={handleAddAddress} className="bg-forest-700 text-white px-5 py-2 rounded-lg text-sm font-semibold">Save Address</button>
                          <button onClick={() => setShowAddressForm(false)} className="text-gray-500 text-sm">Cancel</button>
                        </div>
                      </div>
                    )}

                    {/* Address List */}
                    {user.addresses.length === 0 ? (
                      <p className="text-gray-400">No saved addresses yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {user.addresses.map(addr => (
                          <div key={addr.id} className="border border-gray-100 rounded-xl p-4 flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-forest-900 text-sm">{addr.label}</p>
                              <p className="text-gray-500 text-sm">{addr.street}</p>
                              <p className="text-gray-500 text-sm">{addr.city}, {addr.region} {addr.postalCode}</p>
                            </div>
                            <button
                              onClick={() => removeAddress(addr.id).catch((err: any) => alert(`Failed to remove address: ${err.message ?? 'unknown error'}`))}
                              className="text-red-400 hover:text-red-600 p-1 transition-colors"
                              aria-label="Delete address"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ===== Settings Tab ===== */}
                {activeTab === 'settings' && (
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-forest-900 mb-6">Account Settings</h2>
                    <div className="space-y-6">
                      <div className="border border-gray-100 rounded-xl p-5">
                        <h3 className="font-semibold text-forest-900 mb-1">Email Notifications</h3>
                        <p className="text-sm text-gray-500 mb-3">Receive updates about orders and promotions</p>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-4 h-4 accent-forest-700 rounded" />
                          <span className="text-sm text-gray-700">Order updates</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer mt-2">
                          <input type="checkbox" defaultChecked className="w-4 h-4 accent-forest-700 rounded" />
                          <span className="text-sm text-gray-700">Promotional offers</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer mt-2">
                          <input type="checkbox" className="w-4 h-4 accent-forest-700 rounded" />
                          <span className="text-sm text-gray-700">Blog post notifications</span>
                        </label>
                      </div>
                      <div className="border border-red-100 rounded-xl p-5">
                        <h3 className="font-semibold text-red-700 mb-1">Danger Zone</h3>
                        <p className="text-sm text-gray-500 mb-3">Permanently delete your account and all data</p>
                        <button className="text-red-500 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
