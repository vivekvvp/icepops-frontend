'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, ChevronRight, Star, ArrowRight } from 'lucide-react';
import { useGetWishlistQuery, useRemoveFromWishlistMutation, useAddToCartMutation } from '@/lib/services/api';
import { UserProtectedRoute } from '@/lib/ProtectedRoute';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function WishlistPage() {
  const router = useRouter();
  const { data: wishlistData, isLoading } = useGetWishlistQuery(undefined);
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart] = useAddToCartMutation();

  const items = wishlistData?.data?.products || [];

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId).unwrap();
      toast.success('Removed from wishlist');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to remove item');
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart({ productId, quantity: 1 }).unwrap();
      toast.success('Added to cart');
      router.push('/cart');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to add to cart');
    }
  };

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col" style={{ backgroundColor: 'rgb(246, 247, 249)' }}>
        <Header />
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-10 h-10 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgb(185, 28, 28)', borderTopColor: 'transparent' }}
            />
            <p className="text-sm font-medium" style={{ color: 'rgb(110, 118, 135)' }}>
              Loading your wishlist...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Empty ── */
  if (items.length === 0) {
    return (
      <div className="relative flex min-h-screen w-full flex-col" style={{ backgroundColor: 'rgb(246, 247, 249)' }}>
        <Header />
        <div className="flex-1 flex items-center justify-center py-24 px-4">
          <div
            className="flex flex-col items-center text-center p-10"
            style={{
              backgroundColor: 'rgb(255, 255, 255)',
              border: '1px solid rgb(220, 223, 230)',
              borderRadius: '6px',
              maxWidth: '420px',
              width: '100%',
            }}
          >
            <div
              className="w-16 h-16 flex items-center justify-center mb-4"
              style={{
                borderRadius: '8px',
                backgroundColor: 'rgb(254, 242, 242)',
                border: '1px solid rgb(254, 202, 202)',
              }}
            >
              <Heart className="w-7 h-7" style={{ color: 'rgb(185, 28, 28)' }} />
            </div>
            <h2 className="text-lg font-bold mb-1" style={{ color: 'rgb(15, 20, 35)' }}>
              Your wishlist is empty
            </h2>
            <p className="text-sm mb-6" style={{ color: 'rgb(110, 118, 135)' }}>
              Save your favourite products here to buy them later
            </p>
            <Link href="/products">
              <button
                className="flex items-center gap-2 text-sm font-bold px-6 py-2.5 transition-colors"
                style={{
                  borderRadius: '6px',
                  backgroundColor: 'rgb(185, 28, 28)',
                  color: 'rgb(255, 255, 255)',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
              >
                Browse Products
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col" style={{ backgroundColor: 'rgb(246, 247, 249)' }}>
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
                >
                  Home
                </span>
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="font-semibold" style={{ color: 'rgb(55, 65, 81)' }}>My Wishlist</span>
            </div>

            {/* ── Page Title ── */}
            <div
              className="flex items-center justify-between pb-5"
              style={{ borderBottom: '1px solid rgb(220, 223, 230)' }}
            >
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'rgb(15, 20, 35)' }}>
                  My Wishlist
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
                  {items.length} saved {items.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              <Link href="/products">
                <button
                  className="hidden md:flex items-center gap-1.5 text-sm font-bold transition-colors"
                  style={{ color: 'rgb(185, 28, 28)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgb(153, 27, 27)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
                >
                  Continue Shopping
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </Link>
            </div>

            {/* ── Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {items.map((product: any) => {
                if (!product?._id) return null;
                const outOfStock = (product.stock || 0) === 0;
                const hasDiscount = product.comparePrice && product.comparePrice > product.price;
                const discountPct = hasDiscount
                  ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                  : 0;

                return (
                  <div
                    key={product._id}
                    className="group flex flex-col transition-shadow"
                    style={{
                      backgroundColor: 'rgb(255, 255, 255)',
                      border: '1px solid rgb(220, 223, 230)',
                      borderRadius: '6px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.09)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)')}
                  >
                    {/* ── Image ── */}
                    <div
                      className="relative overflow-hidden"
                      style={{
                        height: '180px',
                        backgroundColor: 'rgb(243, 244, 246)',
                      }}
                    >
                      <Link href={`/products/${product._id}`}>
                        <Image
                          src={product.images?.[0] || '/placeholder.png'}
                          alt={product.name || 'Product'}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>

                      {/* Discount badge */}
                      {hasDiscount && (
                        <span
                          className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5"
                          style={{
                            borderRadius: '4px',
                            backgroundColor: 'rgba(185, 28, 28, 0.85)',
                            color: 'rgb(255, 255, 255)',
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          -{discountPct}%
                        </span>
                      )}

                      {/* Heart / Remove button */}
                      <button
                        onClick={() => handleRemove(product._id)}
                        className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 transition-colors"
                        style={{
                          borderRadius: '50%',
                          backgroundColor: 'rgb(255, 255, 255)',
                          border: '1px solid rgb(254, 202, 202)',
                          color: 'rgb(185, 28, 28)',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)'
                          e.currentTarget.style.color = 'rgb(255, 255, 255)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)'
                          e.currentTarget.style.color = 'rgb(185, 28, 28)'
                        }}
                        title="Remove from wishlist"
                      >
                        <Heart className="w-3.5 h-3.5" style={{ fill: 'currentColor' }} />
                      </button>

                      {/* Out of stock overlay */}
                      {outOfStock && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
                        >
                          <span
                            className="text-xs font-bold px-3 py-1"
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

                    {/* ── Body ── */}
                    <div className="flex flex-col flex-1 p-3 gap-2">

                      {/* Name */}
                      <Link href={`/products/${product._id}`}>
                        <h3
                          className="font-bold text-sm leading-snug line-clamp-1 transition-colors"
                          style={{ color: 'rgb(15, 20, 35)' }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'rgb(15, 20, 35)')}
                        >
                          {product.name || 'Product'}
                        </h3>
                      </Link>

                      {/* Description */}
                      {product.description && (
                        <p
                          className="text-xs leading-relaxed"
                          style={{
                            color: 'rgb(110, 118, 135)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {product.description}
                        </p>
                      )}

                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3"
                            style={{
                              fill: product.averageRating && i < Math.round(product.averageRating)
                                ? 'rgb(250, 204, 21)'
                                : 'transparent',
                              color: product.averageRating && i < Math.round(product.averageRating)
                                ? 'rgb(250, 204, 21)'
                                : 'rgb(209, 213, 219)',
                              strokeWidth: 2,
                            }}
                          />
                        ))}
                        {product.averageRating ? (
                          <span className="text-xs font-semibold" style={{ color: 'rgb(110, 118, 135)' }}>
                            {product.averageRating.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-xs" style={{ color: 'rgb(209, 213, 219)' }}>
                            No reviews yet
                          </span>
                        )}
                      </div>

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-extrabold" style={{ color: 'rgb(15, 20, 35)' }}>
                          ₹{(product.price ?? 0).toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs line-through" style={{ color: 'rgb(150, 158, 175)' }}>
                            ₹{product.comparePrice}
                          </span>
                        )}
                      </div>

                      {/* Divider */}
                      <div style={{ height: '1px', backgroundColor: 'rgb(240, 242, 245)' }} />

                      {/* CTA */}
                      <button
                        onClick={() => !outOfStock && handleAddToCart(product._id)}
                        disabled={outOfStock}
                        className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2 transition-colors disabled:cursor-not-allowed"
                        style={{
                          borderRadius: '4px',
                          backgroundColor: outOfStock ? 'rgb(243, 244, 246)' : 'rgb(185, 28, 28)',
                          color: outOfStock ? 'rgb(150, 158, 175)' : 'rgb(255, 255, 255)',
                        }}
                        onMouseEnter={e => { if (!outOfStock) e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)' }}
                        onMouseLeave={e => { if (!outOfStock) e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)' }}
                      >
                        <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" />
                        {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function ProtectedWishlistPage() {
  return (
    <UserProtectedRoute>
      <WishlistPage />
    </UserProtectedRoute>
  );
}
