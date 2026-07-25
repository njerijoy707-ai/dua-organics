-- ============================================================
-- Dua Organics — Supabase schema
-- Run this whole file once in: Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- 1. PROFILES (extends built-in auth.users with role/name/phone)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  addresses jsonb not null default '[]'::jsonb,
  joined_date date not null default current_date
);

-- Auto-create a profile row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'customer'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. PRODUCTS
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  price numeric not null default 0,
  currency text not null default 'KES',
  description text not null default '',
  long_description text not null default '',
  image text not null default '',
  rating numeric not null default 0,
  review_count integer not null default 0,
  category text not null default '',
  in_stock boolean not null default true,
  reviews jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- 3. BLOG POSTS
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  image text not null default '',
  author text not null default 'Dua Organics Team',
  author_avatar text not null default '🌿',
  date date not null default current_date,
  read_time text not null default '5 min read',
  category text not null default '',
  tags text[] not null default '{}',
  meta_title text not null default '',
  meta_description text not null default '',
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.blog_posts enable row level security;

-- Helper: is the current logged-in user an admin?
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- PROFILES: users see/update their own row, admins see all
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- PRODUCTS: anyone (including logged-out visitors) can read; only admins write
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select using (true);
drop policy if exists "products_admin_insert" on public.products;
create policy "products_admin_insert" on public.products
  for insert with check (public.is_admin());
drop policy if exists "products_admin_update" on public.products;
create policy "products_admin_update" on public.products
  for update using (public.is_admin());
drop policy if exists "products_admin_delete" on public.products;
create policy "products_admin_delete" on public.products
  for delete using (public.is_admin());

-- BLOG POSTS: same pattern
drop policy if exists "blog_public_read" on public.blog_posts;
create policy "blog_public_read" on public.blog_posts
  for select using (true);
drop policy if exists "blog_admin_insert" on public.blog_posts;
create policy "blog_admin_insert" on public.blog_posts
  for insert with check (public.is_admin());
drop policy if exists "blog_admin_update" on public.blog_posts;
create policy "blog_admin_update" on public.blog_posts
  for update using (public.is_admin());
drop policy if exists "blog_admin_delete" on public.blog_posts;
create policy "blog_admin_delete" on public.blog_posts
  for delete using (public.is_admin());

-- ============================================================
-- STORAGE (product & blog images)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');
drop policy if exists "media_admin_write" on storage.objects;
create policy "media_admin_write" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());

-- ============================================================
-- SEED DATA — Dua Organics real product catalog
-- (safe to re-run: deletes the old placeholder rows by slug first,
-- then upserts the real products on conflict (slug) do update)
-- ============================================================

-- Remove the old placeholder products from earlier testing, if present
delete from public.products where slug in (
  'organic-face-serum','shea-body-butter','forest-herbal-tea',
  'botanical-essential-oil','honey-beeswax-lip-balm'
);

insert into public.products (name, slug, price, currency, description, long_description, image, rating, review_count, category, in_stock, reviews)
values
('Infused Herbal Hair Growth Oil','infused-herbal-hair-growth-oil',800,'KES',
 'A rosemary and castor oil blend that stimulates circulation, strengthens strands, and soothes a dry, itchy scalp.',
 'Our Infused Herbal Hair Growth Oil combines rosemary, castor, and jojoba oils into one lightweight scalp treatment. Rosemary is well known for boosting circulation to the hair follicles and helping extend their growth phase, while castor oil''s rich fatty acid content coats each strand to reduce breakage and add thickness over time. Jojoba oil closely mimics your scalp''s own natural oils, so it absorbs quickly without leaving hair greasy. Together they calm dandruff and irritation, smooth the hair cuticle for extra shine, and create a healthier environment for new growth. Massage a few drops into your scalp 2-3 times a week and leave it in, or apply as an overnight treatment before washing.

Key ingredients: Rosemary oil, castor oil, jojoba oil, vitamin E.
100ml / 150ml bottle with applicator tip for precise scalp application.',
 '/products/dua-hair-growth-oil.jpg',
 4.9,2,'Hair Care',true,
 '[{"id":"r1","author":"Wanjiku Nderi","rating":5,"date":"2026-05-10","text":"You should see our hair...best 🥰","verified":true},
   {"id":"r2","author":"Miss.Mata_","rating":5,"date":"2026-05-18","text":"I use it in my hair and my daughter''s hair, never gone back.","verified":true}]'::jsonb),

('Infused Herbal Shea Hair Growth Butter','infused-herbal-shea-hair-growth-butter',800,'KES',
 'A rich shea-based hair butter that seals in moisture, tames frizz, and protects natural hair from breakage.',
 'This Shea Hair Growth Butter is whipped from unrefined shea butter and infused with the same growth-supporting herbs as our hair oil. Shea butter is naturally rich in vitamins A, E and F plus essential fatty acids, making it a powerful sealant that locks moisture into the hair shaft and smooths the cuticle to fight frizz and flyaways. Its anti-inflammatory properties soothe an irritated scalp, creating better conditions for hair follicles to thrive, while its light, non-greasy melt makes it safe for daily use on natural, colour-treated, or chemically processed hair. Perfect as a leave-in seal after your hair oil, or on its own for twist-outs, braids, and edges.

Key ingredients: Unrefined shea butter, rosemary, castor oil, vitamin E.
Best applied to damp hair to lock in moisture, or sparingly on dry hair and edges for shine and hold.',
 '/products/dua-shea-hair-growth-butter.jpg',
 4.8,2,'Hair Care',true,
 '[{"id":"r3","author":"Wanjiku Nderi","rating":5,"date":"2026-05-12","text":"You should see our hair...best 🥰","verified":true},
   {"id":"r4","author":"Miss.Mata_","rating":5,"date":"2026-05-20","text":"I use it in my hair and my daughter''s hair, never gone back.","verified":true}]'::jsonb),

('Shea & Cocoa Vanilla Whipped Body Butter','shea-cocoa-vanilla-whipped-body-butter',750,'KES',
 'A fluffy, whipped shea and cocoa butter blend finished with warm vanilla for deeply hydrated, glowing skin.',
 'We whip pure shea butter with cocoa butter, coconut oil, and a warm vanilla scent to create a cloud-light moisturiser that melts straight into skin on contact. Shea butter penetrates deeply to restore elasticity and calm dry or irritated patches, while cocoa butter forms a light protective layer that locks that moisture in for hours, leaving skin soft long after application. Coconut oil adds extra glide and a touch of shine, and the natural vanilla note leaves a subtle, comforting scent without any synthetic fragrance. Ideal for dry elbows, knees, and everyday all-over moisture, especially after a shower while skin is still slightly damp.

Key ingredients: Shea butter, cocoa butter, coconut oil, natural vanilla.
Net weight: 200g jar.',
 '/products/dua-shea-cocoa-vanilla-body-butter.jpg',
 4.9,2,'Body Care',true,
 '[{"id":"r5","author":"Maria","rating":5,"date":"2026-06-02","text":"Honestly, I love how everything works together. My skin is glowing, my hair is healthier, and I don''t think I''ll be switching anytime soon. 🥹💚","verified":true},
   {"id":"r6","author":"Linet","rating":5,"date":"2026-06-15","text":"Sikuwa najua body butter inaweza make such a difference. Skin yangu ina-glow hadi watu wameanza kuuliza natumia nini. 😂 Na best part ni moisture inakaa all day. Hakuna ile feeling ya kujipaka lotion every few hours. Definitely buying again. 💯","verified":true}]'::jsonb),

('Whipped Raw Shea Body Butter','whipped-raw-shea-body-butter',400,'KES',
 'Pure, unrefined raw shea butter whipped to a soft, light finish for everyday all-over moisture.',
 'For a no-frills, single-ingredient moisturiser, our Whipped Raw Shea Body Butter is 100% unrefined shea butter, whipped until soft and fluffy so it glides on easily instead of sitting in a hard block. Raw shea is packed with vitamins A and E and essential fatty acids that deeply nourish and repair the skin barrier, calm inflammation, and help fade the look of scars and stretch marks over time. Because nothing else is added, it is gentle enough for sensitive skin, eczema-prone skin, and even babies. Warm a small amount between your palms and massage into skin after bathing while it is still damp, for the longest-lasting hydration.

Key ingredients: 100% raw, unrefined shea butter.
Net weight: 150g jar.',
 '/products/dua-raw-shea-body-butter.jpg',
 4.7,1,'Body Care',true,
 '[{"id":"r7","author":"Maria","rating":5,"date":"2026-06-05","text":"Honestly, I love how everything works together. My skin is glowing, my hair is healthier, and I don''t think I''ll be switching anytime soon. 🥹💚","verified":true}]'::jsonb),

('Shea & Cocoa Vanilla Whipped Body Butter — Jar','shea-cocoa-vanilla-whipped-body-butter-jar',650,'KES',
 'The same fluffy shea, cocoa & vanilla whip in a jar size built for daily use.',
 'The same shea, cocoa butter, and coconut oil blend as our Shea & Cocoa Vanilla Whipped Body Butter, whipped light and finished with warm vanilla. This size is perfect for keeping by the bathroom sink or bed for daily top-ups between showers. Shea and cocoa butters work together to deeply hydrate, restore elasticity, and protect skin from moisture loss throughout the day.

Key ingredients: Shea butter, cocoa butter, coconut oil, natural vanilla.
NOTE TO ADMIN: this product currently reuses the Shea & Cocoa Vanilla product photo and description from a different angle — rename, re-price, or merge it with the other Shea & Cocoa listing once you confirm the real size/formula difference between the two jars.',
 '/products/dua-shea-cocoa-vanilla-body-butter-jar.jpg',
 4.9,1,'Body Care',true,
 '[{"id":"r8","author":"Linet","rating":5,"date":"2026-06-18","text":"Sikuwa najua body butter inaweza make such a difference. Skin yangu ina-glow hadi watu wameanza kuuliza natumia nini. 😂 Na best part ni moisture inakaa all day. Hakuna ile feeling ya kujipaka lotion every few hours. Definitely buying again. 💯","verified":true}]'::jsonb)
on conflict (slug) do update set
  name = excluded.name,
  price = excluded.price,
  currency = excluded.currency,
  description = excluded.description,
  long_description = excluded.long_description,
  image = excluded.image,
  rating = excluded.rating,
  review_count = excluded.review_count,
  category = excluded.category,
  in_stock = excluded.in_stock,
  reviews = excluded.reviews;

-- Starter blog posts, relevant to the current product catalog.
-- Edit or add more anytime from /admin > Blog — no code changes needed.
insert into public.blog_posts (title, slug, excerpt, content, image, author, author_avatar, date, read_time, category, tags, meta_title, meta_description)
values
('Rosemary Oil for Hair Growth: Does It Really Work?',
 'rosemary-oil-for-hair-growth-does-it-really-work',
 'A look at why rosemary and castor oil are two of the most trusted natural ingredients for thicker, healthier hair — and how to use them consistently for real results.',
 'If you have spent any time researching natural hair growth, you have almost certainly come across rosemary oil. It is one of the most studied botanical oils for scalp health, and for good reason: rosemary is believed to improve circulation to the hair follicles, which helps deliver more oxygen and nutrients to the roots. Over time, this can support thicker regrowth and reduce shedding, especially when the oil is massaged directly into the scalp rather than just applied to the lengths of the hair.

Castor oil plays a different but complementary role. It is naturally rich in ricinoleic acid and fatty acids that coat each strand, reducing friction and breakage, which means the hair you already have holds on for longer instead of falling out from damage. Combined with jojoba oil, which closely resembles the scalp''s own natural sebum, the blend absorbs without leaving hair looking greasy or weighed down.

The biggest factor in whether any hair oil "works" is consistency. A single application will not transform your hair overnight — real results generally show up after 8 to 12 weeks of regular use, 2 to 3 times a week. Warm the oil slightly between your palms, section your hair, and massage it directly into the scalp in small circular motions for a few minutes before leaving it in or washing out after an hour.

Our Infused Herbal Hair Growth Oil combines all three of these ingredients in one bottle, so you do not have to mix your own blend at home.',
 '/products/dua-hair-growth-oil.jpg',
 'Dua Organics Team','🌿','2026-04-18','4 min read','Hair Care',
 array['hair growth','rosemary oil','natural hair care','scalp health'],
 'Rosemary Oil for Hair Growth: Does It Really Work? | Dua Organics',
 'Discover how rosemary and castor oil support natural hair growth, and how to use them consistently for real results.'),

('Why Shea Butter Is a Staple for Both Skin and Hair',
 'why-shea-butter-is-a-staple-for-both-skin-and-hair',
 'One ingredient, two uses: how unrefined shea butter locks in moisture, calms irritation, and works just as well on your hair as it does on your skin.',
 'Shea butter has been used across West and East Africa for generations, long before it became a global skincare staple. What makes it so versatile is its fat composition — it is naturally rich in vitamins A, E and F along with essential fatty acids, which is why it works equally well as a hair sealant and a body moisturiser.

On skin, shea butter forms a light, breathable layer that helps prevent water loss, which is why it feels so effective on dry patches like elbows, knees, and heels. Its anti-inflammatory properties also make it a common choice for sensitive or irritated skin, including mild eczema. Because it is gentle and free of added fragrance in its raw form, it is generally considered safe for daily use on both adults and children.

On hair, shea butter works as a sealant rather than a primary moisturiser — meaning it locks in whatever moisture is already in the hair strand rather than adding new hydration itself. That is why it works best applied to damp hair right after washing, or over a leave-in conditioner or hair oil. It is especially useful for protective styles like twists and braids, where hair needs to stay moisturised for days at a time without daily washing.

Whether you reach for our Whipped Raw Shea Body Butter for your skin or our Infused Herbal Shea Hair Growth Butter for your hair, the underlying ingredient doing the work is the same.',
 '/products/dua-shea-hair-growth-butter.jpg',
 'Dua Organics Team','🌿','2026-05-02','3 min read','Ingredients',
 array['shea butter','natural moisturiser','skin care','hair care'],
 'Why Shea Butter Works for Both Skin and Hair | Dua Organics',
 'How unrefined shea butter locks in moisture and calms irritation, and why it works just as well on hair as it does on skin.'),

('Building a Simple Body Care Routine With Whipped Body Butter',
 'building-a-simple-body-care-routine-with-whipped-body-butter',
 'You do not need a ten-step routine for soft, hydrated skin. Here is a simple, realistic way to build body butter into your daily habits.',
 'A lot of skincare advice online makes body care sound complicated, but the truth is a simple, consistent routine will get you further than a long list of products used inconsistently. If you are starting from scratch, whipped body butter is one of the easiest places to build a habit around, because it does most of the work on its own.

The single most important tip is timing: apply body butter within a few minutes of stepping out of the shower or bath, while your skin is still slightly damp. This helps trap the water already on your skin underneath the butter, which is what gives that noticeably longer-lasting hydration compared to applying it to fully dry skin. Warm a small amount between your palms first so it melts slightly and spreads more easily, then massage it in using upward strokes.

For very dry areas like elbows, knees, and heels, a slightly thicker layer at night works well, since it has hours to absorb without rubbing off on clothing. During the day, a thinner layer on arms and legs is usually enough to keep skin soft without feeling greasy under clothes.

If you want a richer, more indulgent option, our Shea & Cocoa Vanilla Whipped Body Butter adds cocoa butter and a warm vanilla scent on top of the same moisturising base. For a simpler, fragrance-light option, our Whipped Raw Shea Body Butter is just one ingredient, unrefined shea butter, whipped to a lighter texture.',
 '/products/dua-shea-cocoa-vanilla-body-butter.jpg',
 'Dua Organics Team','🌿','2026-05-20','3 min read','Skincare Tips',
 array['body butter','skincare routine','moisturising','self care'],
 'Building a Simple Body Care Routine | Dua Organics',
 'A simple, realistic body care routine built around whipped body butter, plus tips for making hydration last all day.')
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  image = excluded.image,
  author = excluded.author,
  author_avatar = excluded.author_avatar,
  date = excluded.date,
  read_time = excluded.read_time,
  category = excluded.category,
  tags = excluded.tags,
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description;

-- ============================================================
-- MAKE YOURSELF ADMIN (run this AFTER you sign up once on the live site)
-- ============================================================
-- update public.profiles set role = 'admin' where id =
--   (select id from auth.users where email = 'you@example.com');
