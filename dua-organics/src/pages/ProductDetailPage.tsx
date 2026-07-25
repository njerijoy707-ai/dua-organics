/**
 * Dua Organics — Product Detail Page
 * 
 * Displays full product information, reviews, and WhatsApp CTA.
 * SEO: product schema markup, meta tags.
 */
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, ArrowLeft, Leaf, Truck, Shield } from 'lucide-react';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';
import { useData } from '../context/DataContext';
import ProductCard from '../components/ProductCard';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getProductBySlug, products } = useData();
  const product = getProductBySlug(slug || '');
  const reviewsAnim = useScrollAnimation();
  const relatedAnim = useScrollAnimation();

  /* 404 — Product not found */
  if (!product) {
    return (
      <main className="pt-24 pb-20 min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-forest-900 mb-4">Product Not Found</h1>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="text-forest-700 hover:text-gold-600 font-semibold">← Back to Shop</Link>
        </div>
      </main>
    );
  }

  /* WhatsApp checkout link */
  const whatsappMessage = encodeURIComponent(
    `Hi Dua Organics! I'd like to order:\n\n` +
    `🌿 ${product.name}\n` +
    `💰 KES ${product.price.toLocaleString()}\n\n` +
    `Please confirm availability and payment options. Thank you!`
  );
  const whatsappUrl = `https://wa.me/254794368339?text=${whatsappMessage}`;

  /* Related products (exclude current) */
  const related = products.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{product.name} — Dua Organics | Organic Skincare</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={`${product.name} — Dua Organics`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
        <meta property="og:type" content="product" />
      </Helmet>

      {/* Product Schema Markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.image,
        "brand": { "@type": "Brand", "name": "Dua Organics" },
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "KES",
          "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": product.rating,
          "reviewCount": product.reviewCount
        }
      })}} />

      <main className="pt-24 pb-20 bg-cream-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-forest-700">Home</Link></li>
              <li>/</li>
              <li><Link to="/products" className="hover:text-forest-700">Shop</Link></li>
              <li>/</li>
              <li className="text-forest-700 font-medium">{product.name}</li>
            </ol>
          </nav>

          {/* Product Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Product Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover aspect-square"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <span className="text-forest-500 text-sm font-semibold uppercase tracking-widest mb-2">{product.category}</span>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-forest-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={product.rating} size={20} />
                <span className="text-gray-400 text-sm">({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <p className="font-heading text-3xl font-bold text-forest-800 mb-6">
                KES {product.price.toLocaleString()}
              </p>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6">
                {product.longDescription}
              </p>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Leaf, label: '100% Organic' },
                  { icon: Truck, label: 'Free Delivery' },
                  { icon: Shield, label: 'Quality Assured' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-1 bg-forest-50 rounded-xl p-3">
                    <item.icon className="w-5 h-5 text-forest-600" />
                    <span className="text-xs text-forest-700 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 shadow-lg flex-1"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Order on WhatsApp
                </a>
                <Link
                  to="/products"
                  className="flex items-center justify-center gap-2 border-2 border-forest-300 text-forest-700 hover:bg-forest-50 px-6 py-4 rounded-full text-lg font-semibold transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Shop
                </Link>
              </div>
            </div>
          </div>

          {/* ========== Reviews Section ========== */}
          <section
            ref={reviewsAnim.ref}
            style={reviewsAnim.style}
            className="mb-20"
            aria-labelledby="reviews-heading"
          >
            <h2 id="reviews-heading" className="font-heading text-3xl font-bold text-forest-900 mb-8 floral-heading text-center">
              Customer Reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </section>

          {/* ========== Related Products ========== */}
          <section
            ref={relatedAnim.ref}
            style={relatedAnim.style}
          >
            <h2 className="font-heading text-3xl font-bold text-forest-900 mb-8 text-center rose-heading">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
