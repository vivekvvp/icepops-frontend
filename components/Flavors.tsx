"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingCart, Star } from "lucide-react";
import { useGetLatestProductsQuery } from "@/lib/services/api";

export default function Flavors() {
  const { data: productsResponse, isLoading } = useGetLatestProductsQuery(undefined);
  const products: any[] = productsResponse?.data || [];

  /* ── Skeleton ── */
  if (isLoading) {
    return (
      <section className="px-4 md:px-10 py-20" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-2">
              <div className="h-3 w-24 rounded" style={{ backgroundColor: 'rgb(229, 231, 235)' }} />
              <div className="h-8 w-52 rounded" style={{ backgroundColor: 'rgb(229, 231, 235)' }} />
              <div className="h-4 w-64 rounded" style={{ backgroundColor: 'rgb(229, 231, 235)' }} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg overflow-hidden"
                style={{
                  backgroundColor: 'rgb(255, 255, 255)',
                  border: '1px solid rgb(220, 223, 230)',
                }}
              >
                <div className="aspect-square" style={{ backgroundColor: 'rgb(243, 244, 246)' }} />
                <div className="p-4 space-y-2.5">
                  <div className="h-3 w-16 rounded" style={{ backgroundColor: 'rgb(229, 231, 235)' }} />
                  <div className="h-4 rounded" style={{ backgroundColor: 'rgb(229, 231, 235)' }} />
                  <div className="h-3 w-3/4 rounded" style={{ backgroundColor: 'rgb(229, 231, 235)' }} />
                  <div className="h-3 w-1/2 rounded mt-1" style={{ backgroundColor: 'rgb(229, 231, 235)' }} />
                  <div className="h-10 rounded mt-3" style={{ backgroundColor: 'rgb(229, 231, 235)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 md:px-10 py-20" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
      <div className="max-w-7xl mx-auto">

        {/* ── Section Header ── */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: 'rgb(185, 28, 28)' }}
            >
              Fresh Arrivals
            </p>
            <h2
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: 'rgb(15, 20, 35)' }}
            >
              Latest Products
            </h2>
            <p className="text-sm mt-1.5" style={{ color: 'rgb(110, 118, 135)' }}>
              Freshly added — be the first to try them
            </p>
          </div>
          <Link href="/products">
            <button
              className="hidden md:flex items-center gap-1.5 text-sm font-bold transition-colors"
              style={{ color: 'rgb(185, 28, 28)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgb(153, 27, 27)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
            >
              See All
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </Link>
        </div>

        {/* ── Product Grid ── */}
        {products.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-lg"
            style={{
              backgroundColor: 'rgb(248, 249, 251)',
              border: '1px solid rgb(220, 223, 230)',
            }}
          >
            <ShoppingCart className="w-10 h-10 mb-4" style={{ color: 'rgb(209, 213, 219)' }} />
            <p className="text-base font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
              No products available yet
            </p>
            <p className="text-sm mt-1 mb-6" style={{ color: 'rgb(150, 158, 175)' }}>
              Check back soon for new arrivals
            </p>
            <Link href="/products">
              <button
                className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 transition-colors"
                style={{
                  borderRadius: '6px',
                  backgroundColor: 'rgb(185, 28, 28)',
                  color: 'rgb(255, 255, 255)',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
              >
                Browse All Products
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product: any) => {
              if (!product?._id) return null;

              const outOfStock = product.stock === 0;
              const categoryName =
                typeof product.category === 'object'
                  ? product.category?.name
                  : product.category;
              const hasRating = product.averageRating > 0;

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
                  onMouseEnter={e =>
                    (e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.09)')
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)')
                  }
                >
                  {/* ── Image ── */}
                  <Link
                    href={`/products/${product._id}`}
                    className="relative block overflow-hidden"
                    style={{
                      height: '180px',
                      backgroundColor: 'rgb(243, 244, 246)',
                    }}
                  >
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ color: 'rgb(209, 213, 219)' }}
                      >
                        <ShoppingCart className="w-8 h-8" />
                      </div>
                    )}

                    {/* Category badge */}
                    {categoryName && (
                      <span
                        className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5"
                        style={{
                          borderRadius: '4px',
                          backgroundColor: 'rgba(185, 28, 28, 0.85)',
                          color: 'rgb(255, 255, 255)',
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        {categoryName}
                      </span>
                    )}

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
                  </Link>

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
                        {product.name}
                      </h3>
                    </Link>

                    {/* Description */}
                    <p
                      className="text-xs leading-relaxed"
                      style={{
                        color: 'rgb(110, 118, 135)',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.description}
                    </p>

                    {/* Rating */}
                    {hasRating ? (
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3"
                              style={{
                                fill:
                                  i < Math.round(product.averageRating)
                                    ? 'rgb(250, 204, 21)'
                                    : 'transparent',
                                color:
                                  i < Math.round(product.averageRating)
                                    ? 'rgb(250, 204, 21)'
                                    : 'rgb(209, 213, 219)',
                                strokeWidth: 2,
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold" style={{ color: 'rgb(110, 118, 135)' }}>
                          {product.averageRating.toFixed(1)}
                        </span>
                        {product.reviewCount > 0 && (
                          <span className="text-xs" style={{ color: 'rgb(209, 213, 219)' }}>
                            ({product.reviewCount})
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3"
                            style={{
                              fill: 'transparent',
                              color: 'rgb(229, 231, 235)',
                              strokeWidth: 2,
                            }}
                          />
                        ))}
                        <span className="text-xs" style={{ color: 'rgb(209, 213, 219)' }}>
                          No reviews yet
                        </span>
                      </div>
                    )}

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-extrabold" style={{ color: 'rgb(15, 20, 35)' }}>
                        ₹{(product.price ?? 0).toFixed(2)}
                      </span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-xs line-through" style={{ color: 'rgb(150, 158, 175)' }}>
                          ₹{product.comparePrice}
                        </span>
                      )}
                    </div>

                    {/* Divider */}
                    <div style={{ height: '1px', backgroundColor: 'rgb(240, 242, 245)' }} />

                    {/* CTA */}
                    <Link href={`/products/${product._id}`}>
                      <button
                        disabled={outOfStock}
                        className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          borderRadius: '4px',
                          backgroundColor: outOfStock ? 'rgb(243, 244, 246)' : 'rgb(185, 28, 28)',
                          color: outOfStock ? 'rgb(150, 158, 175)' : 'rgb(255, 255, 255)',
                        }}
                        onMouseEnter={e => {
                          if (!outOfStock)
                            e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)';
                        }}
                        onMouseLeave={e => {
                          if (!outOfStock)
                            e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)';
                        }}
                      >
                        <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" />
                        {outOfStock ? 'Out of Stock' : 'View Product'}
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── View More Button ── */}
        {products.length > 0 && (
          <div className="flex justify-center mt-12 gap-3">
            {/* Mobile: visible always */}
            <Link href="/products" className="md:hidden">
              <button
                className="flex items-center gap-2 text-sm font-bold px-6 py-2.5 transition-colors"
                style={{
                  borderRadius: '6px',
                  border: '1px solid rgb(185, 28, 28)',
                  color: 'rgb(185, 28, 28)',
                  backgroundColor: 'rgb(255, 255, 255)',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(254, 242, 242)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)')}
              >
                See All
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </Link>

            {/* Desktop: centered below grid */}
            <Link href="/products" className="hidden md:block">
              <button
                className="flex items-center gap-2 text-sm font-bold px-8 py-3 transition-colors"
                style={{
                  borderRadius: '6px',
                  backgroundColor: 'rgb(185, 28, 28)',
                  color: 'rgb(255, 255, 255)',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
              >
                View More Products
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
