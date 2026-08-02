/**
 * Dua Organics — Home Page
 *
 * Landing page with hero section, featured products, reviews,
 * blog preview, locations, and trust signals.
 * All scroll animations use inline transition styles.
 */
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Leaf, Shield, Truck, Heart } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import ReviewCard from '../components/ReviewCard';
import { useData } from '../context/DataContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function HomePage() {
  const { products, blogPosts } = useData();
  const featuredHeader = useScrollAnimation();
  const trustSection = useScrollAnimation();
  const reviewsHeader = useScrollAnimation();
  const blogHeader = useScrollAnimation();
  const locationsHeader = useScrollAnimation();
  const locationsCards = useScrollAnimation({ delay: 200 });
  const ctaSection = useScrollAnimation();

  /* Collect top reviews from all products */
  const topReviews = products.flatMap(p => p.reviews.filter(r => r.rating >= 4)).slice(0, 6);

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Dua Organics — Premium Organic Skincare from Nature | Kenya</title>
        <meta name="description" content="Discover premium organic skincare products crafted from nature's finest botanicals. Face serums, body butters, herbal teas, essential oils & lip balms. Nairobi & Nakuru." />
        <meta property="og:title" content="Dua Organics — Premium Organic Skincare" />
        <meta property="og:description" content="Premium organic skincare crafted from nature's finest botanicals in Kenya." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://duaorganics.com" />
      </Helmet>

      {/* Schema.org structured data for local business */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Dua Organics",
        "description": "Premium Organic Skincare from Nature",
        "url": "https://duaorganics.com",
        "telephone": "+254794368339",
        "address": [
          { "@type": "PostalAddress", "streetAddress": "StarMall, Shop C1", "addressLocality": "Nairobi", "addressCountry": "KE" },
          { "@type": "PostalAddress", "streetAddress": "Maasai Market, Stall 27", "addressLocality": "Nakuru", "addressCountry": "KE" }
        ]
      })}} />

      <main>
        {/* Hero Section — Fullscreen video background */}
        <HeroSection />

        {/* ========== Featured Products Section ========== */}
        <section
          id="products"
          className="py-20 md:py-28"
          aria-labelledby="products-heading"
          style={{
            backgroundImage: 'url(/products-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div ref={featuredHeader.ref} style={featuredHeader.style} className="text-center mb-14">
              <span className="text-forest-500 text-sm font-semibold uppercase tracking-widest">Our Collection</span>
              <h2 id="products-heading" className="font-heading text-4xl md:text-5xl font-bold text-forest-900 mt-2 rose-heading">
                Nature's Finest
              </h2>
              <div className="flex items-center justify-center gap-3 mt-3">
                <span className="w-12 h-px bg-forest-300 inline-block" />
                <Leaf className="w-5 h-5 text-forest-400" />
                <span className="w-12 h-px bg-forest-300 inline-block" />
              </div>
              <p className="text-gray-600 mt-4 max-w-xl mx-auto">
                Each product is handcrafted with sustainably sourced organic ingredients,
                bringing you the purest botanicals from Kenya's forests and highlands.
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 3).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8 max-w-3xl mx-auto">
              {products.slice(3).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i + 3} />
              ))}
            </div>

            {/* View All Link */}
            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-forest-700 hover:text-gold-600 font-semibold transition-colors group"
              >
                View All Products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========== Trust Signals Section ========== */}
        <section className="py-16 bg-forest-900">
          <div ref={trustSection.ref} style={trustSection.style} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { icon: Leaf, label: '100% Organic', desc: 'Certified natural ingredients' },
                { icon: Shield, label: 'Cruelty Free', desc: 'Never tested on animals' },
                { icon: Truck, label: 'Kenya Delivery', desc: 'Nationwide shipping' },
                { icon: Heart, label: 'Made with Love', desc: 'Handcrafted in small batches' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <item.icon className="w-8 h-8 text-gold-400" />
                  <h3 className="font-heading text-lg font-semibold text-white">{item.label}</h3>
                  <p className="text-white/60 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== Customer Reviews Section ========== */}
        <section
          className="py-20 md:py-28 bg-white"
          aria-labelledby="reviews-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={reviewsHeader.ref} style={reviewsHeader.style} className="text-center mb-14">
              <span className="text-forest-500 text-sm font-semibold uppercase tracking-widest">Testimonials</span>
              <h2 id="reviews-heading" className="font-heading text-4xl md:text-5xl font-bold text-forest-900 mt-2 floral-heading">
                What Our Customers Say
              </h2>
              <div className="flex items-center justify-center gap-3 mt-3">
                <span className="w-12 h-px bg-forest-300 inline-block" />
                <span className="text-forest-400">✦</span>
                <span className="w-12 h-px bg-forest-300 inline-block" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topReviews.map((review, i) => (
                <ReviewCardAnimated key={review.id} review={review} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ========== Blog Preview Section ========== */}
        <section
          className="py-20 md:py-28 bg-forest-50"
          aria-labelledby="blog-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={blogHeader.ref} style={blogHeader.style} className="text-center mb-14">
              <span className="text-forest-500 text-sm font-semibold uppercase tracking-widest">From Our Journal</span>
              <h2 id="blog-heading" className="font-heading text-4xl md:text-5xl font-bold text-forest-900 mt-2 rose-heading">
                Wellness & Wisdom
              </h2>
              <div className="flex items-center justify-center gap-3 mt-3">
                <span className="w-12 h-px bg-forest-300 inline-block" />
                <Leaf className="w-5 h-5 text-forest-400" />
                <span className="w-12 h-px bg-forest-300 inline-block" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post, i) => (
                <BlogCardAnimated key={post.id} post={post} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ========== Shop Locations Section ========== */}
        <section
          className="py-20 md:py-28 bg-white"
          aria-labelledby="locations-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={locationsHeader.ref} style={locationsHeader.style} className="text-center mb-14">
              <span className="text-forest-500 text-sm font-semibold uppercase tracking-widest">Visit Us</span>
              <h2 id="locations-heading" className="font-heading text-4xl md:text-5xl font-bold text-forest-900 mt-2 floral-heading">
                Our Shops
              </h2>
            </div>

            <div ref={locationsCards.ref} style={locationsCards.style} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Nairobi */}
              <div className="bg-forest-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-forest-700" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-forest-900 mb-2">Nairobi</h3>
                <p className="text-gray-600 font-medium">StarMall, Shop C1</p>
                <p className="text-gray-400 text-sm mt-1">Mon–Sat: 9:00 AM – 7:00 PM</p>
                <a
                  href="https://wa.me/254794368339?text=Hi!%20I'd%20like%20directions%20to%20your%20Nairobi%20shop."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-forest-700 hover:text-gold-600 font-semibold text-sm"
                >
                  Get Directions →
                </a>
              </div>
              {/* Nakuru */}
              <div className="bg-forest-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-forest-700" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-forest-900 mb-2">Nakuru</h3>
                <p className="text-gray-600 font-medium">Maasai Market, Stall 27</p>
                <p className="text-gray-400 text-sm mt-1">Mon–Sat: 8:00 AM – 6:00 PM</p>
                <a
                  href="https://wa.me/254794368339?text=Hi!%20I'd%20like%20directions%20to%20your%20Nakuru%20stall."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-forest-700 hover:text-gold-600 font-semibold text-sm"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========== CTA Banner ========== */}
        <section className="py-20 bg-forest-900 text-center">
          <div ref={ctaSection.ref} style={ctaSection.style} className="max-w-3xl mx-auto px-4">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Embrace Natural Beauty?
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Join thousands of customers who've made the switch to organic skincare.
              Order directly via WhatsApp for the fastest service.
            </p>
            <a
              href="https://wa.me/254794368339?text=Hi%20Dua%20Organics!%20I'd%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 shadow-lg"
            >
              💬 Chat & Order on WhatsApp
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

/* =============================================
   Animated wrapper for Review cards
   ============================================= */
import type { Review } from '../data/products';

function ReviewCardAnimated({ review, index }: { review: Review; index: number }) {
  const { ref, style } = useScrollAnimation({ delay: index * 100 });
  return (
    <div ref={ref} style={style}>
      <ReviewCard review={review} />
    </div>
  );
}

/* =============================================
   Animated wrapper for Blog cards
   ============================================= */
import type { BlogPost } from '../data/blog';

function BlogCardAnimated({ post, index }: { post: BlogPost; index: number }) {
  const { ref, style } = useScrollAnimation({ delay: index * 150 });
  return (
    <article
      ref={ref}
      style={style}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500"
    >
      <div className="overflow-hidden aspect-video">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-forest-600 bg-forest-100 px-2 py-0.5 rounded-full">{post.category}</span>
          <span className="text-xs text-gray-400">{post.readTime}</span>
        </div>
        <Link to={`/blog/${post.slug}`}>
          <h3 className="font-heading text-xl font-semibold text-forest-900 hover:text-gold-600 transition-colors mb-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-forest-700 hover:text-gold-600 text-sm font-semibold transition-colors group/link"
        >
          Read More
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
