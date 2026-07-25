/**
 * Dua Organics — Blog Post Types
 *
 * Blog post data itself now lives in Supabase (see supabase/schema.sql).
 * This file only keeps the shared TypeScript shape used across the app.
 * Fetching/CRUD happens in src/context/DataContext.tsx.
 */

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
}
