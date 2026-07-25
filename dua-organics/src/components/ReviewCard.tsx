/**
 * Dua Organics — Review Card Component
 * 
 * Displays a customer review with rating, author info, and verified badge.
 * Editable from backend/admin panel.
 */
import StarRating from './StarRating';
import { CheckCircle } from 'lucide-react';
import type { Review } from '../data/products';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-forest-100 hover:shadow-md transition-shadow">
      {/* Rating Stars */}
      <StarRating rating={review.rating} size={16} showValue={false} />

      {/* Review Text */}
      <p className="text-gray-600 mt-3 mb-4 text-sm leading-relaxed italic">
        "{review.text}"
      </p>

      {/* Author Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Author avatar placeholder */}
          <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 font-semibold text-sm">
            {review.author.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-sm text-forest-900">{review.author}</p>
            <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
        {/* Verified badge */}
        {review.verified && (
          <span className="flex items-center gap-1 text-xs text-forest-600">
            <CheckCircle className="w-3.5 h-3.5" />
            Verified
          </span>
        )}
      </div>
    </div>
  );
}
