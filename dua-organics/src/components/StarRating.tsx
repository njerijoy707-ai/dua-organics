/**
 * Dua Organics — Star Rating Component
 * 
 * Displays a visual star rating with support for half-stars.
 * Used in product cards and review sections.
 */
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;      /* Rating value (0-5) */
  maxStars?: number;   /* Maximum stars to display */
  size?: number;       /* Star icon size in pixels */
  showValue?: boolean; /* Whether to show the numeric value */
}

export default function StarRating({ rating, maxStars = 5, size = 16, showValue = true }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${rating} out of ${maxStars} stars`}>
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i < Math.floor(rating);
        const halfFilled = !filled && i < rating;
        
        return (
          <Star
            key={i}
            className={`${
              filled
                ? 'text-gold-500 fill-gold-500'
                : halfFilled
                ? 'text-gold-500 fill-gold-500/50'
                : 'text-gray-300'
            }`}
            size={size}
          />
        );
      })}
      {showValue && (
        <span className="text-sm text-gray-600 ml-1 font-medium">{rating}</span>
      )}
    </div>
  );
}
