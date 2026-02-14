'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Star, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetAllReviewsQuery, useModerateReviewMutation } from '@/lib/services/api';
import { toast } from 'sonner';

export default function AdminReviewsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  
  const { data: reviewsData, isLoading, error } = useGetAllReviewsQuery({ 
    page: 1, 
    limit: 50, 
    status: statusFilter || undefined 
  });
  const [moderateReview] = useModerateReviewMutation();

  const reviews = reviewsData?.data?.reviews || [];

  useEffect(() => {
    if (error) {
      toast.error('Failed to load reviews');
    }
  }, [error]);

  const handleModerate = async (reviewId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await moderateReview({ id: reviewId, status }).unwrap();
      toast.success(`Review ${status.toLowerCase()} successfully`);
    } catch (error: any) {
      toast.error('Failed to moderate review');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reviews Moderation</h1>
          <p className="text-gray-600 mt-1">Review and moderate customer reviews</p>
        </div>
      </div>

      {/* Status Filter */}
      <Card className="p-4">
        <div className="flex gap-2">
          {['PENDING', 'APPROVED', 'REJECTED'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </Card>

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : reviews.length === 0 ? (
        <Card className="p-12 text-center">
          <Star className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">No {statusFilter.toLowerCase()} reviews</h2>
          <p className="text-gray-600">There are no reviews to moderate at the moment</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <Card key={review._id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{review.product.name}</h3>
                    {review.isVerifiedPurchase && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    By {review.user.name} • {new Date(review.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>

              {review.status === 'PENDING' && (
                <div className="flex gap-2 border-t pt-4">
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => handleModerate(review._id, 'APPROVED')}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 gap-2"
                    onClick={() => handleModerate(review._id, 'REJECTED')}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                </div>
              )}

              {review.status === 'APPROVED' && (
                <div className="flex items-center gap-2 text-green-600 text-sm border-t pt-4">
                  <CheckCircle className="w-4 h-4" />
                  <span>This review is published on the product page</span>
                </div>
              )}

              {review.status === 'REJECTED' && (
                <div className="flex items-center gap-2 text-red-600 text-sm border-t pt-4">
                  <XCircle className="w-4 h-4" />
                  <span>This review has been rejected</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
