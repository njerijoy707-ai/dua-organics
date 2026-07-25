/**
 * Dua Organics — Product Card Component
 *
 * Displays a single product with image, name, price, rating,
 * and CTA button that redirects to WhatsApp for checkout.
 * Uses inline-style transitions for reliable scroll animation.
 */
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import StarRating from './StarRating';
import type { Product } from '../data/products';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface ProductCardProps {
  product: Product;
  index?: number; /* For staggered animation delay */
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  /* Each card gets a staggered delay based on its grid position */
  const { ref, style } = useScrollAnimation({ delay: index * 120 });

  /* WhatsApp checkout message with product details */
  const whatsappMessage = encodeURIComponent(
    `Hi Dua Organics! I'd like to order:\n\n` +
    `🌿 ${product.name}\n` +
    `💰 KES ${product.price.toLocaleString()}\n\n` +
    `Please confirm availability. Thank you!`
  );
  const whatsappUrl = `https://wa.me/254794368339?text=${whatsappMessage}`;

  return (
    <article
      ref={ref}
      style={style}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition-shadow duration-500"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        {/* Hover Overlay with Quick Actions */}
        <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/30 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <Link
            to={`/products/${product.slug}`}
            className="bg-white text-forest-900 p-3 rounded-full hover:bg-gold-500 hover:text-white transition-colors scale-75 group-hover:scale-100 duration-300"
            aria-label={`View ${product.name}`}
          >
            <Eye className="w-5 h-5" />
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-forest-900 p-3 rounded-full hover:bg-gold-500 hover:text-white transition-colors scale-75 group-hover:scale-100 duration-300"
            aria-label={`Order ${product.name} on WhatsApp`}
          >
            <ShoppingBag className="w-5 h-5" />
          </a>
        </div>
        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-forest-800/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
          {product.category}
        </span>
      </div>

      {/* Product Details */}
      <div className="p-5">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-heading text-xl font-semibold text-forest-900 hover:text-gold-600 transition-colors mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} size={14} />
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <span className="font-heading text-2xl font-bold text-forest-800">
            KES {product.price.toLocaleString()}
          </span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-forest-700 hover:bg-forest-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1"
          >
            <ShoppingBag className="w-4 h-4" />
            Order
          </a>
        </div>
      </div>
    </article>
  );
}
