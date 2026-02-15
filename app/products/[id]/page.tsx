'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingCart, Heart, Star, StarHalf, Package, Truck, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
  useAddToCartMutation,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetWishlistQuery,
  useAddToRecentlyViewedMutation,
  useGetProductReviewsQuery,
  useCreateReviewMutation,
} from '@/lib/services/api';
import { toast } from 'sonner';
import { formatDateTime } from '@/lib/utils';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const { data: productData, isLoading, error } = useGetProductByIdQuery(productId);
  const { data: relatedData } = useGetRelatedProductsQuery(productId);
  const { data: wishlistData } = useGetWishlistQuery(undefined);
  const { data: reviewsData } = useGetProductReviewsQuery({ productId, page: 1, limit: 10 });

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToRecentlyViewed] = useAddToRecentlyViewedMutation();
  const [createReview, { isLoading: isCreatingReview }] = useCreateReviewMutation();

  const product = productData?.data;
  const relatedProducts = relatedData?.data?.products || [];
  const reviews = reviewsData?.data?.reviews || [];
  const wishlistItems = wishlistData?.data?.products || [];
  const isInWishlist = wishlistItems.some((item: any) => item._id === productId);

  useEffect(() => {
    if (product) {
      // Track recently viewed
      addToRecentlyViewed(productId);
    }
  }, [product, productId, addToRecentlyViewed]);

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId, quantity }).unwrap();
      toast.success('Added to cart!', {
        description: `${product.name} (×${quantity})`,
      });
    } catch (error: any) {
      if (error?.status === 401) {
        toast.info('Please login to add items to cart');
        router.push('/login');
      } else {
        toast.error(error?.data?.message || 'Failed to add to cart');
      }
    }
  };

  const handleWishlistToggle = async () => {
    try {
      if (isInWishlist) {
        await removeFromWishlist(productId).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(productId).unwrap();
        toast.success('Added to wishlist');
      }
    } catch (error: any) {
      if (error?.status === 401) {
        toast.info('Please login to manage wishlist');
        router.push('/login');
      } else {
        toast.error(error?.data?.message || 'Failed to update wishlist');
      }
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }
    if (reviewText.trim().length < 10) {
      toast.error('Review must be at least 10 characters long');
      return;
    }

    try {
      await createReview({
        productId,
        rating,
        comment: reviewText,
      }).unwrap();
      toast.success('Review submitted successfully');
      setRating(0);
      setReviewText('');
    } catch (error: any) {
      if (error?.status === 401) {
        toast.info('Please login to write a review');
        router.push('/login');
      } else {
        toast.error(error?.data?.message || 'Failed to submit review');
      }
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }
    return stars;
  };

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <Header />
        <div className="flex-1 flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <Header />
        <div className="flex-1 flex items-center justify-center py-16">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Product not found</h2>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist</p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      
      <main className="flex-1">
        {/* Product Details */}
        <section className="px-4 md:px-10 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={product.images?.[selectedImage] || product.productImage || '/placeholder.png'}
                    alt={product.name || 'Product'}
                    fill
                    className="object-cover"
                  />
                </div>
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square relative bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index ? 'border-primary' : 'border-transparent'
                        }`}
                      >
                        <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
                  {product.category && (
                    <p className="text-gray-600">
                      Category: <span className="text-primary font-medium">{product.category.name}</span>
                    </p>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(product.averageRating || 0)}</div>
                  <span className="text-sm text-gray-600">
                    ({product.reviewCount || 0} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">${product.comparePrice.toFixed(2)}</span>
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded">
                        Save {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>

                {/* Stock Status */}
                <div>
                  {product.stock > 0 ? (
                    <p className="text-green-600 font-medium">
                      ✓ In Stock ({product.stock} available)
                    </p>
                  ) : (
                    <p className="text-red-600 font-medium">✗ Out of Stock</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>

                {/* Quantity Selector */}
                {product.stock > 0 && (
                  <div className="flex items-center gap-4">
                    <span className="font-medium">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || isAddingToCart}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </Button>
                  <Button
                    variant={isInWishlist ? 'default' : 'outline'}
                    size="lg"
                    onClick={handleWishlistToggle}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                {/* Features */}
                <Card className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-primary" />
                      <span className="text-sm">Free Delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      <span className="text-sm">Easy Returns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      <span className="text-sm">Secure Payment</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
              
              {/* Write Review */}
              <Card className="p-6 mb-6">
                <h3 className="font-semibold mb-4">Write a Review</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Review</label>
                    <Textarea
                      placeholder="Share your experience with this product... (minimum 10 characters)"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={4}
                      className={reviewText.trim().length > 0 && reviewText.trim().length < 10 ? 'border-red-300' : ''}
                    />
                    <p className={`text-sm mt-1 ${reviewText.trim().length < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                      {reviewText.trim().length}/10 characters minimum
                    </p>
                  </div>
                  <Button onClick={handleSubmitReview} disabled={isCreatingReview}>
                    {isCreatingReview ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </Card>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review: any) => (
                    <Card key={review._id} className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold">{review.userId?.name || 'Anonymous'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-sm text-gray-500">
                              {formatDateTime(review.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {relatedProducts.map((relatedProduct: any) => (
                    <Link key={relatedProduct._id} href={`/products/${relatedProduct._id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="aspect-square relative bg-gray-100">
                          <Image
                            src={relatedProduct.images[0] || relatedProduct.productImage || '/placeholder.png'}
                            alt={relatedProduct.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-sm mb-1 line-clamp-2">{relatedProduct.name}</h3>
                          <p className="text-primary font-bold">${relatedProduct.price.toFixed(2)}</p>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
