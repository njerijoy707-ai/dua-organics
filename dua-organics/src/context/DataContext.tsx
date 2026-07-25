/**
 * Dua Organics — Data Context
 *
 * Single source of truth for products & blog posts, backed by Supabase.
 * - Public pages read `products` / `blogPosts` from here (no more static imports).
 * - AdminPage calls the CRUD functions here, which write to Supabase and
 *   then refresh local state so the whole site updates immediately.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Product, Review } from '../data/products';
import type { BlogPost } from '../data/blog';

/* ---------- Row <-> App-model mapping (DB is snake_case, app is camelCase) ---------- */

function rowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: Number(row.price),
    currency: row.currency,
    description: row.description,
    longDescription: row.long_description,
    image: row.image,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    category: row.category,
    inStock: row.in_stock,
    reviews: (row.reviews ?? []) as Review[],
  };
}

function productToRow(p: Partial<Product>) {
  return {
    name: p.name,
    slug: p.slug,
    price: p.price,
    currency: p.currency,
    description: p.description,
    long_description: p.longDescription,
    image: p.image,
    rating: p.rating,
    review_count: p.reviewCount,
    category: p.category,
    in_stock: p.inStock,
    reviews: p.reviews,
  };
}

function rowToPost(row: any): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    image: row.image,
    author: row.author,
    authorAvatar: row.author_avatar,
    date: row.date,
    readTime: row.read_time,
    category: row.category,
    tags: row.tags ?? [],
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
  };
}

function postToRow(p: Partial<BlogPost>) {
  return {
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    image: p.image,
    author: p.author,
    author_avatar: p.authorAvatar,
    date: p.date,
    read_time: p.readTime,
    category: p.category,
    tags: p.tags,
    meta_title: p.metaTitle,
    meta_description: p.metaDescription,
  };
}

/* ---------------------------------- Context shape ---------------------------------- */

interface DataContextType {
  products: Product[];
  blogPosts: BlogPost[];
  loading: boolean;
  error: string | null;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  getBlogBySlug: (slug: string) => BlogPost | undefined;
  refetch: () => Promise<void>;
  /* Admin CRUD — each throws on failure so the caller can show an error */
  saveProduct: (product: Product, isNew: boolean) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  savePost: (post: BlogPost, isNew: boolean) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, postsRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: true }),
        supabase.from('blog_posts').select('*').order('date', { ascending: false }),
      ]);
      if (productsRes.error) throw productsRes.error;
      if (postsRes.error) throw postsRes.error;
      setProducts((productsRes.data ?? []).map(rowToProduct));
      setBlogPosts((postsRes.data ?? []).map(rowToPost));
    } catch (err: any) {
      console.error('Failed to load site data from Supabase:', err);
      setError(err.message ?? 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const getProductBySlug = useCallback(
    (slug: string) => products.find(p => p.slug === slug),
    [products]
  );
  const getProductById = useCallback(
    (id: string) => products.find(p => p.id === id),
    [products]
  );
  const getBlogBySlug = useCallback(
    (slug: string) => blogPosts.find(p => p.slug === slug),
    [blogPosts]
  );

  /* ---- Admin CRUD: write to Supabase, then refresh from the server ---- */

  const saveProduct = useCallback(async (product: Product, isNew: boolean) => {
    const row = productToRow(product);
    const { error } = isNew
      ? await supabase.from('products').insert(row)
      : await supabase.from('products').update(row).eq('id', product.id);
    if (error) throw error;
    await fetchAll();
  }, [fetchAll]);

  const deleteProduct = useCallback(async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    await fetchAll();
  }, [fetchAll]);

  const savePost = useCallback(async (post: BlogPost, isNew: boolean) => {
    const row = postToRow(post);
    const { error } = isNew
      ? await supabase.from('blog_posts').insert(row)
      : await supabase.from('blog_posts').update(row).eq('id', post.id);
    if (error) throw error;
    await fetchAll();
  }, [fetchAll]);

  const deletePost = useCallback(async (id: string) => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) throw error;
    await fetchAll();
  }, [fetchAll]);

  return (
    <DataContext.Provider
      value={{
        products,
        blogPosts,
        loading,
        error,
        getProductBySlug,
        getProductById,
        getBlogBySlug,
        refetch: fetchAll,
        saveProduct,
        deleteProduct,
        savePost,
        deletePost,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
