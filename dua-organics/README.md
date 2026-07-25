# 🌿 Dua Organics — Premium Organic Skincare

A full-featured ecommerce website for **Dua Organics**, a premium organic skincare brand based in Kenya.

![Dua Organics](https://images.pexels.com/photos/7081208/pexels-photo-7081208.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=600)

---

## 📋 Features

### Storefront
- **Hero Section** — Fullscreen looping video background of a dense forest with a stream
- **Products Section** — 5 products with images, descriptions, ratings, and WhatsApp checkout
- **Reviews Section** — Customer review cards per product (editable from backend)
- **Blog** — 3 blog posts with full slug routing and rich content
- **About Page** — Brand story, values, and shop locations
- **Shop Locations** — Nairobi (StarMall, Shop C1) & Nakuru (Maasai Market, Stall 27)

### Customer Dashboard
- Login / Register with email & password
- Order history with status tracking
- Saved addresses management
- Profile settings & notifications

### Admin Panel
- Add / Edit / Delete products
- Manage orders and update statuses
- Publish / Edit / Delete blog posts
- Store overview with key metrics

### SEO
- ✅ Meta titles and descriptions per page
- ✅ Open Graph tags for social sharing
- ✅ `sitemap.xml` and `robots.txt`
- ✅ Semantic HTML throughout (`<main>`, `<article>`, `<section>`, `<nav>`)
- ✅ Blog posts structured for rich snippets (Schema.org `BlogPosting`)
- ✅ Product pages with Schema.org `Product` markup
- ✅ Local Business structured data

### Design
- Elegant **Cormorant Garamond** (serif) for headings
- Clean **Inter** (sans-serif) for body text
- 🌹 Floral green rose decorations for headings
- Smooth scroll behavior
- Fade-in animations on scroll (IntersectionObserver)
- Dark forest green color palette with gold accents
- Fully responsive (mobile, tablet, desktop)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ installed
- **npm** or **yarn** package manager

### Setup

This site is backed by [Supabase](https://supabase.com) (free tier is enough) for
the database, authentication, and image storage. You need a Supabase project
before the site will run.

```bash
# 1. Clone the repository
git clone https://github.com/duaorganics/website.git
cd website

# 2. Create a Supabase project at https://supabase.com/dashboard,
#    then go to SQL Editor > New query, paste the contents of
#    supabase/schema.sql, and run it once.

# 3. Copy environment variables and fill in your project's values
#    (Project Settings > API in the Supabase dashboard)
cp .env.example .env

# 4. Install dependencies
npm install

# 5. Start development server
npm run dev

# 6. Open in browser
# → http://localhost:5173

# 7. Sign up on the live site once (via /login > Register), then in the
#    Supabase SQL Editor run:
#    update public.profiles set role = 'admin' where id =
#      (select id from auth.users where email = 'you@example.com');
#    That account can now see /admin and add/edit/delete products & posts.
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
dua-organics/
├── public/
│   ├── robots.txt              # Search engine crawl rules
│   └── sitemap.xml             # XML sitemap for SEO
├── supabase/
│   └── schema.sql              # Run once in Supabase SQL Editor: tables, RLS, storage, seed data
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # Responsive navigation bar
│   │   ├── Footer.tsx           # Footer with locations & contact
│   │   ├── HeroSection.tsx      # Fullscreen video hero
│   │   ├── ProductCard.tsx      # Product display card
│   │   ├── ReviewCard.tsx       # Customer review card
│   │   ├── StarRating.tsx       # Star rating display
│   │   └── ScrollToTop.tsx      # Scroll reset on navigation
│   ├── context/
│   │   ├── AuthContext.tsx      # Supabase auth (login/register/roles)
│   │   └── DataContext.tsx      # Live products & blog posts (read + admin CRUD), backed by Supabase
│   ├── data/
│   │   ├── products.ts          # Shared Product/Review TypeScript types only
│   │   └── blog.ts              # Shared BlogPost TypeScript type only
│   ├── lib/
│   │   └── supabase.ts          # Supabase client + image upload helper
│   ├── hooks/
│   │   └── useScrollAnimation.ts # Scroll-triggered animations
│   ├── pages/
│   │   ├── HomePage.tsx         # Landing page
│   │   ├── ProductsPage.tsx     # Product listing with filters
│   │   ├── ProductDetailPage.tsx # Individual product page
│   │   ├── BlogListPage.tsx     # Blog listing
│   │   ├── BlogPostPage.tsx     # Individual blog post
│   │   ├── AboutPage.tsx        # About & locations
│   │   ├── LoginPage.tsx        # Login / Register
│   │   ├── DashboardPage.tsx    # Customer dashboard
│   │   └── AdminPage.tsx        # Admin panel — add/edit/delete products & posts, no dev needed
│   ├── utils/
│   │   └── cn.ts                # Tailwind class merge utility
│   ├── App.tsx                  # Root component with routes
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles & Tailwind
├── .env.example                 # Environment variable template (Supabase URL + anon key)
├── index.html                   # HTML entry with SEO meta tags
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 🏪 Shop Locations

| City    | Location                  | Hours              |
|---------|---------------------------|-------------------|
| Nairobi | StarMall, Shop C1         | Mon-Sat: 9AM-7PM |
| Nakuru  | Maasai Market, Stall 27   | Mon-Sat: 8AM-6PM |

---

## 📞 Contact

- **WhatsApp**: [+254 794 368 339](https://wa.me/254794368339)
- **Email**: hello@duaorganics.com
- **Website**: [duaorganics.com](https://duaorganics.com)

---

## 🔑 Accounts

There are no demo accounts — every account is a real Supabase Auth user.

- **Customers**: register from `/login` with any real email + password.
- **Admin**: register normally, then promote that one account to admin by running
  this once in the Supabase SQL Editor (see `supabase/schema.sql` for the exact
  snippet, already included at the bottom of that file):
  ```sql
  update public.profiles set role = 'admin' where id =
    (select id from auth.users where email = 'you@example.com');
  ```
  Admin accounts can add, edit, and delete products and blog posts from `/admin`
  — no code changes or developer required.

---

## 🔧 Backend Architecture (Supabase)

Products, blog posts, user profiles, and auth are all backed by
[Supabase](https://supabase.com):

1. **Products & Blog Posts** — Stored in the `products` and `blog_posts` tables.
   `src/context/DataContext.tsx` fetches them on load and exposes `saveProduct`,
   `deleteProduct`, `savePost`, `deletePost` for the admin panel — every save/delete
   writes straight to Postgres and the whole site updates immediately.
2. **Auth** — `src/context/AuthContext.tsx` uses real Supabase email/password auth.
   Roles (`customer` / `admin`) live in the `profiles` table and are enforced with
   Row Level Security, so only admins can write to `products` / `blog_posts` even
   if someone bypasses the UI.
3. **Images** — `src/lib/supabase.ts` uploads files to a public `media` storage
   bucket and returns a public URL; the admin panel lets you either upload a file
   or paste an image URL.
4. **Orders** — Orders are still taken over WhatsApp and the Orders tab shows
   placeholder demo data. Wiring up a real orders table + checkout flow (e.g. with
   M-Pesa) is a separate, larger project.

To reset or inspect data directly, use the Supabase dashboard's Table Editor —
no separate admin tool is needed.

---

## 📄 License

© 2025 Dua Organics. All rights reserved.

---

*Crafted with 🌿 in Kenya*
