/**
 * Dua Organics — Product Types
 *
 * Product data itself now lives in Supabase (see supabase/schema.sql).
 * This file only keeps the shared TypeScript shapes used across the app.
 * Fetching/CRUD happens in src/context/DataContext.tsx.
 */

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  description: string;
  longDescription: string;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  inStock: boolean;
  reviews: Review[];
}
