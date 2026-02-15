'use client';

import { useEffect } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetAllReviewsQuery, useDeleteReviewAdminMutation } from '@/lib/services/api';
import { toast } from 'sonner';
import { formatDateTime } from '@/lib/utils';

export default function AdminReviewsPage() {
  const { data: reviewsData, isLoading, error } = useGetAllReviewsQuery({ 
    page: 1, 
    limit: 100
  });
  const [deleteReviewAdmin] = useDeleteReviewAdminMutation();

  const reviews = reviewsData?.data?.reviews || [];

  useEffect(() => {
    if (error) {
      toast.error('Failed to load reviews');
    }
  }, [error]);

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteReviewAdmin(reviewId).unwrap();
      toast.success('Review deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete review');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Reviews</h1>
          <p className="text-gray-600 mt-1">View and manage all customer reviews</p>
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : reviews.length === 0 ? (
        <Card className="p-12 text-center">
          <Star className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">No reviews yet</h2>
          <p className="text-gray-600">Customer reviews will appear here</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <Card key={review._id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">
                      {review.productId?.name || 'Product Deleted'}
                    </h3>
                    {review.isVerifiedPurchase && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>{review.userId?.name || 'Anonymous'}</span>
                    <span>•</span>
                    <span>{formatDateTime(review.createdAt)}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(review._id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="mb-3">
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
              </div>

              <p className="text-gray-700 mb-4">{review.comment}</p>

              {review.images && review.images.length > 0 && (
                <div className="flex gap-2">
                  {review.images.map((image: string, idx: number) => (
                    <img
                      key={idx}
                      src={image}
                      alt={`Review ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
