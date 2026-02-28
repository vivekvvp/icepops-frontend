'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { useGetProductsQuery } from '@/lib/services/api';

export default function FeaturedProducts() {
  const { data, isLoading } = useGetProductsQuery({
    page: 1,
    limit: 8,
    isPublished: true,
  });

  const products = data?.data?.products || [];

  /* ================= Skeleton Loader ================= */
  if (isLoading) {
    return (
      <section className="px-4 md:px-10 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <div className="h-6 w-40 bg-gray-200 rounded mx-auto animate-pulse" />
            <div className="h-4 w-60 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 bg-gray-200 rounded mt-4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  /* ================= Main Section ================= */
  return (
    <section className="px-4 md:px-10 py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-red-600 mb-2">
              Best Sellers
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Discover our most loved ice pops
            </p>
          </div>

          <Link
            href="/products"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product: any) => {
            if (!product?._id) return null;

            const hasDiscount =
              product.comparePrice && product.comparePrice > product.price;

            const discountPct = hasDiscount
              ? Math.round(
                  ((product.comparePrice - product.price) /
                    product.comparePrice) *
                    100
                )
              : 0;

            const outOfStock = product.stock === 0;

            return (
              <div
                key={product._id}
                className="group relative flex flex-col bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <Link
                  href={`/products/${product._id}`}
                  className="relative aspect-square bg-gray-100 overflow-hidden"
                >
                  <Image
                    src={product.images?.[0] || '/placeholder.png'}
                    alt={product.name || 'Product'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Gradient hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

                  {/* Discount Badge */}
                  {hasDiscount && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                      -{discountPct}%
                    </span>
                  )}

                  {/* Out of Stock Overlay */}
                  {outOfStock && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <span className="bg-white text-red-600 text-xs font-bold px-4 py-1.5 rounded-full shadow">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 space-y-3">

                  {/* Category */}
                  {product.category?.name && (
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                      {product.category.name}
                    </span>
                  )}

                  {/* Product Name */}
                  <Link href={`/products/${product._id}`}>
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  {product.averageRating > 0 && (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(product.averageRating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        {product.averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}

                  <div className="flex-1" />

                  {/* Price */}
                  <div className="flex items-end gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{product.price}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.comparePrice}
                      </span>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link href={`/products/${product._id}`}>
                    <button
                      disabled={outOfStock}
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {outOfStock ? 'Unavailable' : 'View Product'}
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile View All */}
        <div className="flex justify-center mt-10 md:hidden">
          <Link
            href="/products"
            className="flex items-center gap-2 text-sm font-medium border border-red-600 text-red-600 px-6 py-2.5 rounded-xl hover:bg-red-50 transition"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}