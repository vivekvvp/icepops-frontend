"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingCart, Star } from "lucide-react";
import { useGetLatestProductsQuery, useAddToCartMutation } from "@/lib/services/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Flavors() {
  const router = useRouter();
  const { data: productsResponse, isLoading } = useGetLatestProductsQuery(undefined);
  const products: any[] = productsResponse?.data || [];
  const [addToCart] = useAddToCartMutation();

  // Track loading state per product
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  const handleAddToCart = async (productId: string, productName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingProductId(productId);
    try {
      await addToCart({ productId, quantity: 1 }).unwrap();
      toast.success("Added to cart!", { description: `${productName} (×1)` });
    } catch (error: any) {
      if (error?.status === 401) {
        toast.info("Please login to add items to cart");
        router.push("/login");
      } else {
        toast.error(error?.data?.message || "Failed to add to cart");
      }
    } finally {
      setLoadingProductId(null);
    }
  };

  /* skeleton */
  if (isLoading) {
    return (
      <section id="flavors" className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <div className="h-3 w-24 rounded-full bg-slate-100 animate-pulse mx-auto mb-3" />
            <div className="h-8 w-60 rounded-full bg-slate-100 animate-pulse mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl overflow-hidden border border-slate-100">
                <div className="h-[200px] bg-slate-100" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-1/3 rounded-full bg-slate-100" />
                  <div className="h-4 rounded-full bg-slate-100" />
                  <div className="h-3 w-3/4 rounded-full bg-slate-100" />
                  <div className="h-10 rounded-xl bg-slate-100 mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="flavors" className="pt-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#e11d48' }}>
              Fresh Arrivals
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Choose Your Flavor
            </h2>
            <p className="text-slate-500 mt-3 text-base">Real fruit. Real taste. Zero guilt.</p>
          </div>
          <Link href="/products">
            <button
              className="hidden md:flex items-center gap-1.5 text-sm font-bold transition-colors"
              style={{ color: '#e11d48' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#9f1239')}
              onMouseLeave={e => (e.currentTarget.style.color = '#e11d48')}
            >
              See All <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </Link>
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 rounded-3xl"
            style={{ backgroundColor: '#fafafa', border: '1px solid #f1f5f9' }}
          >
            <span className="text-5xl mb-4">🍭</span>
            <p className="text-base font-bold text-slate-800">No products yet</p>
            <p className="text-sm text-slate-400 mt-1 mb-6">Check back soon for new flavors</p>
            <Link href="/products">
              <button
                className="text-sm font-bold px-6 py-2.5 rounded-xl text-white"
                style={{ backgroundColor: '#e11d48' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#be123c')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e11d48')}
              >
                Browse All
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: any) => {
              if (!product?._id) return null;

              const outOfStock = product.stock === 0;
              const hasDiscount =
                product.comparePrice &&
                product.comparePrice > product.price;

              const discountPct = hasDiscount
                ? Math.round(
                  ((product.comparePrice - product.price) /
                    product.comparePrice) *
                  100
                )
                : 0;

              // Consistent styling with ProductsPage
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
                    width: '270px',
                    minHeight: '340px',
                    margin: '0 auto',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.09)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)')}
                >
                  {/* Image */}
                  <Link
                    href={`/products/${product._id}`}
                    className="relative block overflow-hidden"
                    style={{
                      height: '150px',
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
                        🍭
                      </div>
                    )}

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

                    {/* Low stock badge */}
                    {!outOfStock && product.stock <= 5 && (
                      <span
                        className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5"
                        style={{
                          borderRadius: '4px',
                          backgroundColor: 'rgb(255, 247, 237)',
                          color: 'rgb(154, 52, 18)',
                          border: '1px solid rgb(254, 215, 170)',
                        }}
                      >
                        Only {product.stock} left
                      </span>
                    )}
                  </Link>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-3 gap-2">
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
                    {product.averageRating > 0 ? (
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3"
                              style={{
                                fill: i < Math.round(product.averageRating) ? 'rgb(250, 204, 21)' : 'transparent',
                                color: i < Math.round(product.averageRating) ? 'rgb(250, 204, 21)' : 'rgb(209, 213, 219)',
                                strokeWidth: 2,
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold" style={{ color: 'rgb(110, 118, 135)' }}>
                          {product.averageRating.toFixed(1)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3"
                            style={{ fill: 'transparent', color: 'rgb(229, 231, 235)', strokeWidth: 2 }}
                          />
                        ))}
                        <span className="text-xs" style={{ color: 'rgb(209, 213, 219)' }}>
                          No reviews yet
                        </span>
                      </div>
                    )}

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

                    <div style={{ height: '1px', backgroundColor: 'rgb(240, 242, 245)' }} />

                    {/* CTA */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        disabled={outOfStock || loadingProductId === product._id}
                        className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          borderRadius: '4px',
                          backgroundColor: outOfStock ? 'rgb(243, 244, 246)' : 'rgb(185, 28, 28)',
                          color: outOfStock ? 'rgb(150, 158, 175)' : 'rgb(255, 255, 255)',
                        }}
                        onClick={e => handleAddToCart(product._id, product.name, e)}
                        onMouseEnter={e => { if (!outOfStock) e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)' }}
                        onMouseLeave={e => { if (!outOfStock) e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)' }}
                      >
                        <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" />
                        {loadingProductId === product._id ? "Adding..." : "Add to Cart"}
                      </button>
                      <Link href={`/products/${product._id}`}>
                        <button
                          className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2 transition-colors"
                          style={{
                            borderRadius: '4px',
                            backgroundColor: 'rgb(15, 20, 35)',
                            color: 'rgb(255, 255, 255)',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(55, 65, 81)')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(15, 20, 35)')}
                        >
                          View Product
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {products.length > 0 && (
          <div className="flex justify-center mt-14">
            <Link href="/products">
              <button
                className="flex items-center gap-2 text-sm font-bold px-8 py-3.5 rounded-xl text-white transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: '#e11d48', boxShadow: '0 4px 16px rgba(225,29,72,0.2)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#be123c')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e11d48')}
              >
                View All Flavors <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
