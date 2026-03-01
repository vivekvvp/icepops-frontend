'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, ArrowRight, Sparkles } from 'lucide-react';
import { useGetProductsQuery } from '@/lib/services/api';

const comboPacks = [
  {
    name: 'Starter Pack',
    description: '4 assorted ice pops — perfect for first-timers trying our flavors',
    originalPrice: 60,
    price: 40,
    flavors: ['🥭', '🍓', '🍊', '🫐'],
    badge: null,
    color: '#fff7ed',
    borderColor: '#fed7aa',
    popular: false,
  },
  {
    name: 'Family Pack',
    description: '12 ice pops across all flavors — the crowd favourite',
    originalPrice: 200,
    price: 149,
    flavors: ['🥭', '🍓', '🍊', '🫐', '🍋', '🍇'],
    badge: 'Most Popular',
    color: '#fff1f2',
    borderColor: '#fda4af',
    popular: true,
  },
  {
    name: 'Party Pack',
    description: '24 premium ice pops for your next event or gathering',
    originalPrice: 360,
    price: 259,
    flavors: ['🥭', '🍓', '🍊', '🫐'],
    badge: 'Best Value',
    color: '#fffbeb',
    borderColor: '#fde68a',
    popular: false,
  },
];

export default function FeaturedProducts() {
  const { data, isLoading } = useGetProductsQuery({
    page: 1,
    limit: 4,
    isPublished: true,
  });
  const products = data?.data?.products || [];

  return (
    <section className="py-24" style={{ background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

     

        {/* ── Best Sellers ── */}
        {isLoading ? (
          <div>
            <div className="text-center mb-14">
              <div className="h-8 w-48 rounded-full bg-slate-100 animate-pulse mx-auto" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl overflow-hidden border border-slate-100">
                  <div className="aspect-square bg-slate-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 rounded-full bg-slate-100" />
                    <div className="h-3 w-2/3 rounded-full bg-slate-100" />
                    <div className="h-9 rounded-xl bg-slate-100 mt-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : products.length > 0 ? (
          <div>
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#e11d48' }}>
                  Fan Favourites
                </p>
                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Best Sellers</h2>
              </div>
              <Link href="/products">
                <button
                  className="hidden md:flex items-center gap-1.5 text-sm font-bold transition-colors"
                  style={{ color: '#e11d48' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#9f1239')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#e11d48')}
                >
                  View All <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product: any) => {
                if (!product?._id) return null;
                const outOfStock = product.stock === 0;
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
                          🍭
                        </div>
                      )}
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
                                style={
                                  i < Math.round(product.averageRating)
                                    ? { fill: '#fbbf24', color: '#fbbf24' }
                                    : { color: '#e2e8f0' }
                                }
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

                      <Link href={`/products/${product._id}`}>
                        <button
                          disabled={outOfStock}
                          className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            borderRadius: '4px',
                            backgroundColor: outOfStock ? 'rgb(243, 244, 246)' : 'rgb(185, 28, 28)',
                            color: outOfStock ? 'rgb(150, 158, 175)' : 'rgb(255, 255, 255)',
                          }}
                          onMouseEnter={e => { if (!outOfStock) e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)' }}
                          onMouseLeave={e => { if (!outOfStock) e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)' }}
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
          </div>
        ) : null}

      </div>
    </section>
  );
}