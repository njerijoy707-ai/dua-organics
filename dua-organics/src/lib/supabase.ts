/**
 * Dua Organics — Supabase client
 *
 * One shared client used everywhere in the app (auth, database, storage).
 * Reads its connection info from Vite environment variables — see .env.example.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Loud, early warning instead of a confusing runtime error later.
  console.error(
    'Missing Supabase env vars. Copy .env.example to .env and fill in ' +
    'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from your Supabase project settings.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Public bucket used for product & blog images. Created by supabase/schema.sql */
export const MEDIA_BUCKET = 'media';

/** Upload a File to the media bucket and return its public URL. */
export async function uploadMediaFile(file: File, pathPrefix: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
