'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Minus, Plus, ShoppingCart, Heart, Star,
  Package, Truck, Shield, ArrowLeft, ChevronRight,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
  const [hoverRating, setHoverRating] = useState(0);
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
    if (product) addToRecentlyViewed(productId);
  }, [product, productId, addToRecentlyViewed]);

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId, quantity }).unwrap();
      toast.success('Added to cart!', { description: `${product.name} (×${quantity})` });
    } catch (error: any) {
      if (error?.status === 401) { toast.info('Please login to add items to cart'); router.push('/login'); }
      else toast.error(error?.data?.message || 'Failed to add to cart');
    }
  };

  const handleWishlistToggle = async () => {
    try {
      if (isInWishlist) { await removeFromWishlist(productId).unwrap(); toast.success('Removed from wishlist'); }
      else { await addToWishlist(productId).unwrap(); toast.success('Added to wishlist'); }
    } catch (error: any) {
      if (error?.status === 401) { toast.info('Please login to manage wishlist'); router.push('/login'); }
      else toast.error(error?.data?.message || 'Failed to update wishlist');
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) return toast.error('Please select a rating');
    if (!reviewText.trim()) return toast.error('Please write a review');
    if (reviewText.trim().length < 10) return toast.error('Review must be at least 10 characters');
    try {
      await createReview({ productId, rating, comment: reviewText }).unwrap();
      toast.success('Review submitted successfully');
      setRating(0);
      setReviewText('');
    } catch (error: any) {
      if (error?.status === 401) { toast.info('Please login to write a review'); router.push('/login'); }
      else toast.error(error?.data?.message || 'Failed to submit review');
    }
  };

  const renderStars = (value: number, size = 'w-4 h-4') =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={size}
        style={{
          fill: i < Math.round(value) ? 'rgb(250, 204, 21)' : 'transparent',
          color: i < Math.round(value) ? 'rgb(250, 204, 21)' : 'rgb(209, 213, 219)',
          strokeWidth: 2,
        }}
      />
    ));

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden"
        style={{ backgroundColor: 'rgb(246, 247, 249)' }}>
        <Header />
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'rgb(185, 28, 28)', borderTopColor: 'transparent' }}
            />
            <p className="text-sm font-medium" style={{ color: 'rgb(110, 118, 135)' }}>
              Loading product...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Not Found ── */
  if (error || !product) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden"
        style={{ backgroundColor: 'rgb(246, 247, 249)' }}>
        <Header />
        <div className="flex-1 flex items-center justify-center py-24 px-4">
          <div
            className="flex flex-col items-center text-center p-10 rounded-lg"
            style={{
              backgroundColor: 'rgb(255, 255, 255)',
              border: '1px solid rgb(220, 223, 230)',
              maxWidth: '420px',
              width: '100%',
            }}
          >
            <div
              className="w-14 h-14 flex items-center justify-center mb-4"
              style={{
                borderRadius: '8px',
                backgroundColor: 'rgb(254, 242, 242)',
                border: '1px solid rgb(254, 202, 202)',
              }}
            >
              <Package className="w-6 h-6" style={{ color: 'rgb(185, 28, 28)' }} />
            </div>
            <h2 className="text-lg font-bold mb-1" style={{ color: 'rgb(15, 20, 35)' }}>
              Product not found
            </h2>
            <p className="text-sm mb-6" style={{ color: 'rgb(110, 118, 135)' }}>
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/products">
              <button
                className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 transition-colors"
                style={{ borderRadius: '6px', backgroundColor: 'rgb(185, 28, 28)', color: 'rgb(255, 255, 255)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
              >
                Browse Products
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden"
      style={{ backgroundColor: 'rgb(246, 247, 249)' }}
    >
      <Header />

      <main className="flex-1">
        <section className="px-4 md:px-6 py-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* ── Breadcrumb ── */}
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgb(150, 158, 175)' }}>
              <Link href="/">
                <span
                  className="transition-colors cursor-pointer"
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgb(150, 158, 175)')}
                >Home</span>
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/products">
                <span
                  className="transition-colors cursor-pointer"
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgb(150, 158, 175)')}
                >Products</span>
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span
                className="font-semibold truncate max-w-[200px]"
                style={{ color: 'rgb(55, 65, 81)' }}
              >
                {product.name}
              </span>
            </div>

            {/* ── Back Button ── */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
              style={{ color: 'rgb(110, 118, 135)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgb(110, 118, 135)')}
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              Back
            </button>

            {/* ── Product Details ── */}
            <div
              className="overflow-hidden"
              style={{
                backgroundColor: 'rgb(255, 255, 255)',
                border: '1px solid rgb(220, 223, 230)',
                borderRadius: '6px',
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                {/* ── Image ── */}
                <div
                  className="p-6 space-y-3"
                  style={{ borderRight: '1px solid rgb(240, 242, 245)' }}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{
                      aspectRatio: '1/1',
                      borderRadius: '4px',
                      backgroundColor: 'rgb(243, 244, 246)',
                      border: '1px solid rgb(220, 223, 230)',
                    }}
                  >
                    <Image
                      src={product.images?.[selectedImage] || '/placeholder.png'}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {hasDiscount && (
                      <span
                        className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1"
                        style={{
                          borderRadius: '4px',
                          backgroundColor: 'rgb(185, 28, 28)',
                          color: 'rgb(255, 255, 255)',
                        }}
                      >
                        -{discountPct}%
                      </span>
                    )}
                    {product.stock === 0 && (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
                      >
                        <span
                          className="text-sm font-bold px-4 py-2"
                          style={{
                            borderRadius: '4px',
                            backgroundColor: 'rgb(254, 242, 242)',
                            color: 'rgb(185, 28, 28)',
                            border: '1px solid rgb(254, 202, 202)',
                          }}
                        >
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {product.images && product.images.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                      {product.images.map((image: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className="relative overflow-hidden transition-all"
                          style={{
                            aspectRatio: '1/1',
                            borderRadius: '4px',
                            border: selectedImage === index
                              ? '2px solid rgb(185, 28, 28)'
                              : '1px solid rgb(220, 223, 230)',
                            backgroundColor: 'rgb(243, 244, 246)',
                          }}
                        >
                          <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Product Info ── */}
                <div className="p-6 space-y-5">

                  {/* Category */}
                  {product.category?.name && (
                    <span
                      className="inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-1"
                      style={{
                        borderRadius: '4px',
                        backgroundColor: 'rgb(254, 242, 242)',
                        color: 'rgb(185, 28, 28)',
                        border: '1px solid rgb(254, 202, 202)',
                      }}
                    >
                      {product.category.name}
                    </span>
                  )}

                  {/* Name */}
                  <h1
                    className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight"
                    style={{ color: 'rgb(15, 20, 35)' }}
                  >
                    {product.name}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {renderStars(product.averageRating || 0)}
                    </div>
                    <span className="text-sm font-semibold" style={{ color: 'rgb(55, 65, 81)' }}>
                      {product.averageRating > 0 ? product.averageRating.toFixed(1) : 'No ratings'}
                    </span>
                    <span className="text-sm" style={{ color: 'rgb(150, 158, 175)' }}>
                      ({product.reviewCount || 0} reviews)
                    </span>
                  </div>

                  {/* Divider */}
                  <div style={{ height: '1px', backgroundColor: 'rgb(240, 242, 245)' }} />

                  {/* Price */}
                  <div className="flex items-baseline gap-3">
                    <span
                      className="text-3xl font-extrabold"
                      style={{ color: 'rgb(185, 28, 28)' }}
                    >
                      ₹{product.price.toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-lg line-through" style={{ color: 'rgb(150, 158, 175)' }}>
                          ₹{product.comparePrice.toFixed(2)}
                        </span>
                        <span
                          className="text-xs font-bold px-2 py-0.5"
                          style={{
                            borderRadius: '4px',
                            backgroundColor: 'rgb(240, 253, 244)',
                            color: 'rgb(21, 91, 48)',
                            border: '1px solid rgb(187, 247, 208)',
                          }}
                        >
                          Save {discountPct}%
                        </span>
                      </>
                    )}
                  </div>

                  {/* Stock */}
                  <div>
                    {product.stock > 0 ? (
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1"
                        style={{
                          borderRadius: '4px',
                          backgroundColor: 'rgb(240, 253, 244)',
                          color: 'rgb(21, 91, 48)',
                          border: '1px solid rgb(187, 247, 208)',
                        }}
                      >
                        ✓ In Stock — {product.stock} available
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1"
                        style={{
                          borderRadius: '4px',
                          backgroundColor: 'rgb(254, 242, 242)',
                          color: 'rgb(185, 28, 28)',
                          border: '1px solid rgb(254, 202, 202)',
                        }}
                      >
                        ✗ Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgb(150, 158, 175)' }}>
                      Description
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
                      {product.description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div style={{ height: '1px', backgroundColor: 'rgb(240, 242, 245)' }} />

                  {/* Quantity */}
                  {product.stock > 0 && (
                    <div className="flex items-center gap-4">
                      <p className="text-sm font-bold" style={{ color: 'rgb(55, 65, 81)' }}>Quantity</p>
                      <div
                        className="flex items-center"
                        style={{
                          border: '1px solid rgb(220, 223, 230)',
                          borderRadius: '6px',
                          overflow: 'hidden',
                        }}
                      >
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          className="px-3 py-2 text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{ backgroundColor: 'rgb(248, 249, 251)', color: 'rgb(55, 65, 81)' }}
                          onMouseEnter={e => { if (quantity > 1) e.currentTarget.style.backgroundColor = 'rgb(240, 242, 245)' }}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(248, 249, 251)')}
                        >
                          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                        <span
                          className="px-5 py-2 text-sm font-bold"
                          style={{
                            borderLeft: '1px solid rgb(220, 223, 230)',
                            borderRight: '1px solid rgb(220, 223, 230)',
                            color: 'rgb(15, 20, 35)',
                            minWidth: '52px',
                            textAlign: 'center',
                          }}
                        >
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          disabled={quantity >= product.stock}
                          className="px-3 py-2 text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{ backgroundColor: 'rgb(248, 249, 251)', color: 'rgb(55, 65, 81)' }}
                          onMouseEnter={e => { if (quantity < product.stock) e.currentTarget.style.backgroundColor = 'rgb(240, 242, 245)' }}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(248, 249, 251)')}
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0 || isAddingToCart}
                      className="flex-1 flex items-center justify-center gap-2 text-sm font-bold py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        borderRadius: '6px',
                        backgroundColor: product.stock === 0 ? 'rgb(243, 244, 246)' : 'rgb(185, 28, 28)',
                        color: product.stock === 0 ? 'rgb(150, 158, 175)' : 'rgb(255, 255, 255)',
                      }}
                      onMouseEnter={e => { if (product.stock > 0 && !isAddingToCart) e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)' }}
                      onMouseLeave={e => { if (product.stock > 0) e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)' }}
                    >
                      <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                      {isAddingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={handleWishlistToggle}
                      className="flex items-center justify-center w-12 h-12 transition-colors"
                      style={{
                        borderRadius: '6px',
                        border: '1px solid rgb(220, 223, 230)',
                        backgroundColor: isInWishlist ? 'rgb(254, 242, 242)' : 'rgb(255, 255, 255)',
                        color: isInWishlist ? 'rgb(185, 28, 28)' : 'rgb(110, 118, 135)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = 'rgb(254, 242, 242)'
                        e.currentTarget.style.borderColor = 'rgb(254, 202, 202)'
                        e.currentTarget.style.color = 'rgb(185, 28, 28)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = isInWishlist ? 'rgb(254, 242, 242)' : 'rgb(255, 255, 255)'
                        e.currentTarget.style.borderColor = isInWishlist ? 'rgb(254, 202, 202)' : 'rgb(220, 223, 230)'
                        e.currentTarget.style.color = isInWishlist ? 'rgb(185, 28, 28)' : 'rgb(110, 118, 135)'
                      }}
                    >
                      <Heart
                        className="w-5 h-5"
                        style={{
                          fill: isInWishlist ? 'rgb(185, 28, 28)' : 'transparent',
                          strokeWidth: 2.5,
                        }}
                      />
                    </button>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Truck, label: 'Free Delivery', desc: 'On all orders' },
                      { icon: Package, label: 'Easy Returns', desc: '7 day policy' },
                      { icon: Shield, label: 'Secure Payment', desc: '100% protected' },
                    ].map(({ icon: Icon, label, desc }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center gap-1.5 text-center p-3"
                        style={{
                          borderRadius: '6px',
                          backgroundColor: 'rgb(255, 255, 255)',
                          border: '1px solid rgb(220, 223, 230)',
                        }}
                      >
                        <div
                          className="flex items-center justify-center w-8 h-8"
                          style={{
                            borderRadius: '6px',
                            backgroundColor: 'rgb(254, 242, 242)',
                            border: '1px solid rgb(254, 202, 202)',
                          }}
                        >
                          <Icon className="w-4 h-4" style={{ color: 'rgb(185, 28, 28)', strokeWidth: 2 }} />
                        </div>
                        <p className="text-xs font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
                          {label}
                        </p>
                        <p className="text-xs" style={{ color: 'rgb(150, 158, 175)' }}>
                          {desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Reviews Section ── */}
            <div
              className="overflow-hidden"
              style={{
                backgroundColor: 'rgb(255, 255, 255)',
                border: '1px solid rgb(220, 223, 230)',
                borderRadius: '6px',
              }}
            >
              {/* Section Header */}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{
                  borderBottom: '1px solid rgb(240, 242, 245)',
                  backgroundColor: 'rgb(248, 249, 251)',
                }}
              >
                <div>
                  <h2 className="text-base font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
                    Customer Reviews
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
                    {reviews.length > 0 ? `${reviews.length} review${reviews.length !== 1 ? 's' : ''}` : 'No reviews yet'}
                  </p>
                </div>
                {product.averageRating > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {renderStars(product.averageRating)}
                    </div>
                    <span className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
                      {product.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-6">

                {/* Write Review */}
                <div
                  className="p-5 rounded"
                  style={{
                    backgroundColor: 'rgb(248, 249, 251)',
                    border: '1px solid rgb(240, 242, 245)',
                  }}
                >
                  <h3 className="text-sm font-bold mb-4" style={{ color: 'rgb(15, 20, 35)' }}>
                    Write a Review
                  </h3>
                  <div className="space-y-4">

                    {/* Star Picker */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgb(150, 158, 175)' }}>
                        Your Rating
                      </p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star
                              className="w-7 h-7"
                              style={{
                                fill: star <= (hoverRating || rating) ? 'rgb(250, 204, 21)' : 'transparent',
                                color: star <= (hoverRating || rating) ? 'rgb(250, 204, 21)' : 'rgb(209, 213, 219)',
                                strokeWidth: 2,
                              }}
                            />
                          </button>
                        ))}
                        {rating > 0 && (
                          <span className="ml-2 text-xs font-semibold" style={{ color: 'rgb(110, 118, 135)' }}>
                            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Review Text */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgb(150, 158, 175)' }}>
                        Your Review
                      </p>
                      <textarea
                        placeholder="Share your experience with this product... (minimum 10 characters)"
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        rows={4}
                        className="w-full text-sm resize-none outline-none transition-colors"
                        style={{
                          borderRadius: '6px',
                          border: reviewText.trim().length > 0 && reviewText.trim().length < 10
                            ? '1px solid rgb(254, 202, 202)'
                            : '1px solid rgb(220, 223, 230)',
                          padding: '10px 12px',
                          backgroundColor: 'rgb(255, 255, 255)',
                          color: 'rgb(15, 20, 35)',
                        }}
                        onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                        onBlur={e => (e.currentTarget.style.borderColor =
                          reviewText.trim().length > 0 && reviewText.trim().length < 10
                            ? 'rgb(254, 202, 202)'
                            : 'rgb(220, 223, 230)'
                        )}
                      />
                      <p
                        className="text-xs mt-1"
                        style={{
                          color: reviewText.trim().length > 0 && reviewText.trim().length < 10
                            ? 'rgb(185, 28, 28)'
                            : 'rgb(150, 158, 175)',
                        }}
                      >
                        {reviewText.trim().length}/10 characters minimum
                      </p>
                    </div>

                    <button
                      onClick={handleSubmitReview}
                      disabled={isCreatingReview}
                      className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        borderRadius: '6px',
                        backgroundColor: 'rgb(185, 28, 28)',
                        color: 'rgb(255, 255, 255)',
                      }}
                      onMouseEnter={e => { if (!isCreatingReview) e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)' }}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
                    >
                      <Star className="w-4 h-4 stroke-[2.5]" />
                      {isCreatingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </div>

                {/* Reviews List */}
                {reviews.length > 0 ? (
                  <div className="space-y-3">
                    {reviews.map((review: any, index: number) => (
                      <div
                        key={review._id}
                        className="p-4"
                        style={{
                          backgroundColor: 'rgb(255, 255, 255)',
                          border: '1px solid rgb(240, 242, 245)',
                          borderRadius: '4px',
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex items-center justify-center w-8 h-8 text-xs font-bold shrink-0"
                              style={{
                                borderRadius: '6px',
                                backgroundColor: 'rgb(254, 242, 242)',
                                border: '1px solid rgb(254, 202, 202)',
                                color: 'rgb(185, 28, 28)',
                              }}
                            >
                              {review.userId?.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div>
                              <p className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
                                {review.userId?.name || 'Anonymous'}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="flex items-center gap-0.5">
                                  {renderStars(review.rating, 'w-3 h-3')}
                                </div>
                                <span className="text-xs" style={{ color: 'rgb(150, 158, 175)' }}>
                                  {formatDateTime(review.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                          {review.isVerifiedPurchase && (
                            <span
                              className="text-xs font-bold px-2 py-0.5 shrink-0"
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
                        </div>
                        <p className="text-sm mt-3 leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-10 gap-2">
                    <div className="flex gap-0.5 mb-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className="w-5 h-5" style={{ color: 'rgb(229, 231, 235)', fill: 'transparent', strokeWidth: 2 }} />
                      ))}
                    </div>
                    <p className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
                      No reviews yet
                    </p>
                    <p className="text-xs" style={{ color: 'rgb(150, 158, 175)' }}>
                      Be the first to share your experience!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Related Products ── */}
            {relatedProducts.length > 0 && (
              <div
                className="overflow-hidden"
                style={{
                  backgroundColor: 'rgb(255, 255, 255)',
                  border: '1px solid rgb(220, 223, 230)',
                  borderRadius: '6px',
                }}
              >
                <div
                  className="flex items-center justify-between px-6 py-4"
                  style={{
                    borderBottom: '1px solid rgb(240, 242, 245)',
                    backgroundColor: 'rgb(248, 249, 251)',
                  }}
                >
                  <h2 className="text-base font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
                    You May Also Like
                  </h2>
                  <Link href="/products">
                    <button
                      className="text-xs font-bold transition-colors flex items-center gap-1"
                      style={{ color: 'rgb(185, 28, 28)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'rgb(153, 27, 27)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
                    >
                      View All <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </Link>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {relatedProducts.map((rel: any) => (
                      <Link key={rel._id} href={`/products/${rel._id}`}>
                        <div
                          className="group overflow-hidden transition-shadow cursor-pointer"
                          style={{
                            borderRadius: '4px',
                            border: '1px solid rgb(220, 223, 230)',
                            backgroundColor: 'rgb(255, 255, 255)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.09)')}
                          onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)')}
                        >
                          <div
                            className="relative overflow-hidden"
                            style={{
                              height: '150px',
                              backgroundColor: 'rgb(243, 244, 246)',
                            }}
                          >
                            <Image
                              src={rel.images?.[0] || '/placeholder.png'}
                              alt={rel.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-3">
                            <h3
                              className="text-sm font-bold line-clamp-1 mb-1"
                              style={{ color: 'rgb(15, 20, 35)' }}
                            >
                              {rel.name}
                            </h3>
                            <p
                              className="text-sm font-extrabold"
                              style={{ color: 'rgb(185, 28, 28)' }}
                            >
                              ₹{rel.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
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
