'use client';

import { useEffect, useState } from 'react';
import { Star, Trash2, MessageSquare, AlertTriangle } from 'lucide-react';
import { useGetAllReviewsQuery, useDeleteReviewAdminMutation } from '@/lib/services/api';
import { toast } from 'sonner';
import { formatDateTime } from '@/lib/utils';

export default function AdminReviewsPage() {
  const { data: reviewsData, isLoading, error } = useGetAllReviewsQuery({
    page: 1,
    limit: 100,
  });
  const [deleteReviewAdmin, { isLoading: isDeleting }] = useDeleteReviewAdminMutation();

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    reviewId: string;
  }>({ open: false, reviewId: '' });

  const reviews = reviewsData?.data?.reviews || [];

  useEffect(() => {
    if (error) toast.error('Failed to load reviews');
  }, [error]);

  const openConfirm = (id: string) =>
    setConfirmDialog({ open: true, reviewId: id });

  const closeConfirm = () =>
    setConfirmDialog({ open: false, reviewId: '' });

  const handleDelete = async () => {
    try {
      await deleteReviewAdmin(confirmDialog.reviewId).unwrap();
      toast.success('Review deleted successfully');
      closeConfirm();
    } catch {
      toast.error('Failed to delete review');
      closeConfirm();
    }
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className="w-3.5 h-3.5"
        style={{
          fill: i < rating ? 'rgb(250, 204, 21)' : 'transparent',
          color: i < rating ? 'rgb(250, 204, 21)' : 'rgb(209, 213, 219)',
          strokeWidth: 2,
        }}
      />
    ));

  return (
    <div className="min-h-screen p-8 space-y-6" style={{ backgroundColor: 'rgb(246, 247, 249)' }}>

      {/* ── Confirm Delete Dialog ── */}
      {confirmDialog.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          onClick={closeConfirm}
        >
          <div
            className="w-full max-w-sm mx-4"
            style={{
              backgroundColor: 'rgb(255, 255, 255)',
              borderRadius: '8px',
              border: '1px solid rgb(220, 223, 230)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              className="flex items-start gap-3 p-5"
              style={{ borderBottom: '1px solid rgb(240, 242, 245)' }}
            >
              <div
                className="flex items-center justify-center w-9 h-9 shrink-0"
                style={{
                  borderRadius: '6px',
                  backgroundColor: 'rgb(254, 242, 242)',
                  border: '1px solid rgb(254, 202, 202)',
                }}
              >
                <AlertTriangle className="w-4 h-4" style={{ color: 'rgb(185, 28, 28)', strokeWidth: 2.5 }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
                  Delete Review
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
                  This action cannot be undone
                </p>
              </div>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm" style={{ color: 'rgb(55, 65, 81)' }}>
                Are you sure you want to permanently delete this review?
              </p>
            </div>
            <div
              className="flex items-center justify-end gap-2 px-5 py-4"
              style={{
                borderTop: '1px solid rgb(240, 242, 245)',
                backgroundColor: 'rgb(248, 249, 251)',
                borderRadius: '0 0 8px 8px',
              }}
            >
              <button
                onClick={closeConfirm}
                disabled={isDeleting}
                className="text-xs font-semibold px-4 py-2 transition-colors disabled:opacity-50"
                style={{
                  borderRadius: '6px',
                  border: '1px solid rgb(220, 223, 230)',
                  backgroundColor: 'rgb(255, 255, 255)',
                  color: 'rgb(55, 65, 81)',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(246, 247, 249)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)')}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs font-bold px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderRadius: '6px', backgroundColor: 'rgb(185, 28, 28)', color: 'rgb(255, 255, 255)' }}
                onMouseEnter={e => { if (!isDeleting) e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)' }}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
              >
                {isDeleting ? 'Deleting...' : 'Delete Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between pb-6"
        style={{ borderBottom: '1px solid rgb(220, 223, 230)' }}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'rgb(15, 20, 35)' }}>
            Reviews
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
            View and manage all customer reviews
          </p>
        </div>

        {/* Total count badge */}
        {reviews.length > 0 && (
          <span
            className="text-xs font-bold px-3 py-1.5"
            style={{
              borderRadius: '4px',
              backgroundColor: 'rgb(248, 249, 251)',
              border: '1px solid rgb(220, 223, 230)',
              color: 'rgb(55, 65, 81)',
            }}
          >
            {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Table ── */}
      <div
        className="rounded-md overflow-hidden"
        style={{
          backgroundColor: 'rgb(255, 255, 255)',
          border: '1px solid rgb(220, 223, 230)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid rgb(220, 223, 230)',
                  backgroundColor: 'rgb(248, 249, 251)',
                }}
              >
                {['#', 'Product', 'Customer', 'Rating', 'Review', 'Date', ''].map((h, i) => (
                  <th
                    key={i}
                    className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider ${i === 6 ? 'text-right' : 'text-left'}`}
                    style={{ color: 'rgb(100, 108, 125)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm"
                    style={{ color: 'rgb(156, 163, 175)' }}
                  >
                    Loading reviews...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <MessageSquare className="w-8 h-8" style={{ color: 'rgb(209, 213, 219)' }} />
                      <p className="text-sm font-medium" style={{ color: 'rgb(156, 163, 175)' }}>
                        No reviews yet
                      </p>
                      <p className="text-xs" style={{ color: 'rgb(209, 213, 219)' }}>
                        Customer reviews will appear here
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                reviews.map((review: any, index: number) => (
                  <tr
                    key={review._id}
                    style={{
                      borderBottom:
                        index < reviews.length - 1
                          ? '1px solid rgb(240, 242, 245)'
                          : 'none',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(252, 252, 253)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* # */}
                    <td
                      className="px-5 py-4 text-xs font-bold"
                      style={{ color: 'rgb(185, 28, 28)' }}
                    >
                      {index + 1}
                    </td>

                    {/* Product */}
                    <td className="px-5 py-4" style={{ maxWidth: '180px' }}>
                      <div className="flex items-center gap-2.5">
                        {review.productId?.images?.[0] ? (
                          <img
                            src={review.productId.images[0]}
                            alt={review.productId.name}
                            className="w-9 h-9 object-cover shrink-0"
                            style={{
                              borderRadius: '4px',
                              border: '1px solid rgb(220, 223, 230)',
                            }}
                          />
                        ) : (
                          <div
                            className="w-9 h-9 shrink-0 flex items-center justify-center"
                            style={{
                              borderRadius: '4px',
                              backgroundColor: 'rgb(243, 244, 246)',
                              border: '1px solid rgb(220, 223, 230)',
                            }}
                          >
                            <Star className="w-4 h-4" style={{ color: 'rgb(209, 213, 219)' }} />
                          </div>
                        )}
                        <p
                          className="text-sm font-semibold truncate"
                          style={{ color: 'rgb(15, 20, 35)', maxWidth: '120px' }}
                        >
                          {review.productId?.name || 'Product Deleted'}
                        </p>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold" style={{ color: 'rgb(15, 20, 35)' }}>
                        {review.userId?.name || 'Anonymous'}
                      </p>
                      {review.userId?.email && (
                        <p className="text-xs mt-0.5" style={{ color: 'rgb(150, 158, 175)' }}>
                          {review.userId.email}
                        </p>
                      )}
                      {review.isVerifiedPurchase && (
                        <span
                          className="text-xs font-bold px-2 py-0.5 inline-flex mt-1"
                          style={{
                            borderRadius: '4px',
                            backgroundColor: 'rgb(240, 253, 244)',
                            color: 'rgb(21, 91, 48)',
                            border: '1px solid rgb(187, 247, 208)',
                          }}
                        >
                          ✓ Verified
                        </span>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <p
                        className="text-xs font-bold mt-1"
                        style={{ color: 'rgb(55, 65, 81)' }}
                      >
                        {review.rating}/5
                      </p>
                    </td>

                    {/* Review comment */}
                    <td className="px-5 py-4" style={{ maxWidth: '260px' }}>
                      <p
                        className="text-sm"
                        style={{
                          color: 'rgb(55, 65, 81)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {review.comment}
                      </p>

                      {/* Review images */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-1.5 mt-2">
                          {review.images.slice(0, 3).map((img: string, idx: number) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Review ${idx + 1}`}
                              className="w-8 h-8 object-cover"
                              style={{
                                borderRadius: '4px',
                                border: '1px solid rgb(220, 223, 230)',
                              }}
                            />
                          ))}
                          {review.images.length > 3 && (
                            <div
                              className="w-8 h-8 flex items-center justify-center text-xs font-bold"
                              style={{
                                borderRadius: '4px',
                                backgroundColor: 'rgb(243, 244, 246)',
                                border: '1px solid rgb(220, 223, 230)',
                                color: 'rgb(100, 108, 125)',
                              }}
                            >
                              +{review.images.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Date */}
                    <td
                      className="px-5 py-4 text-sm"
                      style={{ color: 'rgb(110, 118, 135)', whiteSpace: 'nowrap' }}
                    >
                      {formatDateTime(review.createdAt)}
                    </td>

                    {/* Delete */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => openConfirm(review._id)}
                        disabled={isDeleting}
                        className="p-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ borderRadius: '4px', color: 'rgb(150, 158, 175)' }}
                        title="Delete review"
                        onMouseEnter={e => {
                          e.currentTarget.style.color = 'rgb(185, 28, 28)'
                          e.currentTarget.style.backgroundColor = 'rgb(254, 242, 242)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = 'rgb(150, 158, 175)'
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        <Trash2 className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
