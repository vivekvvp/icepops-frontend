"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, ChevronRight,Star, ChevronLeft, SlidersHorizontal, X } from "lucide-react"
import { toast } from "sonner"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useGetProductsQuery, useGetAllCategoriesQuery, useAddToCartMutation } from "@/lib/services/api"
import { useAppSelector } from "@/lib/store/hooks"
import { selectIsAuthenticated } from "@/lib/store/authSlice"

export default function ProductsPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const limit = 12

  const { data: response, isLoading, error } = useGetProductsQuery({
    page,
    limit,
    search: search || undefined,
    category: selectedCategory || undefined,
    isPublished: true,
  })
  const { data: categoriesResponse } = useGetAllCategoriesQuery(undefined)
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation()

  const data = response?.data
  const categories = categoriesResponse?.data || []

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart")
      return
    }
    try {
      await addToCart({ productId, quantity: 1 }).unwrap()
      toast.success("Added to cart!")
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add to cart")
    }
  }

  return (
    <div
      className="relative flex min-h-screen w-full flex-col"
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
                >
                  Home
                </span>
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="font-semibold" style={{ color: 'rgb(55, 65, 81)' }}>Products</span>
            </div>

            {/* ── Page Title + Search Row ── */}
            <div
              className="overflow-hidden"
              style={{
                backgroundColor: 'rgb(255, 255, 255)',
                border: '1px solid rgb(220, 223, 230)',
                borderRadius: '6px',
              }}
            >
              {/* Header */}
              <div
                className="px-5 py-4"
                style={{ borderBottom: '1px solid rgb(240, 242, 245)', backgroundColor: 'rgb(248, 249, 251)' }}
              >
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'rgb(15, 20, 35)' }}>
                      All Products
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
                      {data?.pagination?.totalProducts
                        ? `${data.pagination.totalProducts} products found`
                        : 'Discover our delicious collection of ice pops'}
                    </p>
                  </div>

                  {/* Mobile filter toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden flex items-center gap-1.5 text-sm font-bold px-3 py-2 transition-colors"
                    style={{
                      borderRadius: '4px',
                      border: '1px solid rgb(220, 223, 230)',
                      backgroundColor: showFilters ? 'rgb(254, 242, 242)' : 'rgb(255, 255, 255)',
                      color: showFilters ? 'rgb(185, 28, 28)' : 'rgb(75, 85, 99)',
                    }}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Filters
                  </button>
                </div>
              </div>

              {/* Search + Filter (desktop always visible / mobile toggleable) */}
              <div className={`p-5 ${!showFilters ? 'hidden md:block' : 'block'}`}>
                <div className="flex flex-col sm:flex-row gap-3">

                  {/* Search */}
                  <div
                    className="flex-1 flex items-center gap-2 px-3 h-9"
                    style={{
                      borderRadius: '4px',
                      border: '1px solid rgb(220, 223, 230)',
                      backgroundColor: 'rgb(248, 249, 251)',
                    }}
                  >
                    <Search className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgb(150, 158, 175)' }} />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={search}
                      onChange={e => { setSearch(e.target.value); setPage(1) }}
                      className="flex-1 text-sm bg-transparent outline-none"
                      style={{ color: 'rgb(15, 20, 35)' }}
                    />
                    {search && (
                      <button onClick={() => { setSearch(''); setPage(1) }}>
                        <X className="w-3.5 h-3.5" style={{ color: 'rgb(150, 158, 175)' }} />
                      </button>
                    )}
                  </div>

                  {/* Category Filter */}
                  {categories.length > 0 && (
                    <select
                      value={selectedCategory}
                      onChange={e => { setSelectedCategory(e.target.value === 'all' ? '' : e.target.value); setPage(1) }}
                      className="text-sm font-semibold outline-none h-9 px-3 transition-colors"
                      style={{
                        borderRadius: '4px',
                        border: '1px solid rgb(220, 223, 230)',
                        backgroundColor: 'rgb(248, 249, 251)',
                        color: 'rgb(55, 65, 81)',
                        minWidth: '160px',
                      }}
                    >
                      <option value="all">All Categories</option>
                      {categories.map((cat: any) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Active filter chips */}
                {(search || selectedCategory) && (
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className="text-xs" style={{ color: 'rgb(110, 118, 135)' }}>Active filters:</span>
                    {search && (
                      <span
                        className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 cursor-pointer"
                        style={{
                          borderRadius: '4px',
                          backgroundColor: 'rgb(254, 242, 242)',
                          color: 'rgb(185, 28, 28)',
                          border: '1px solid rgb(254, 202, 202)',
                        }}
                        onClick={() => { setSearch(''); setPage(1) }}
                      >
                        "{search}" <X className="w-3 h-3" />
                      </span>
                    )}
                    {selectedCategory && (
                      <span
                        className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 cursor-pointer"
                        style={{
                          borderRadius: '4px',
                          backgroundColor: 'rgb(254, 242, 242)',
                          color: 'rgb(185, 28, 28)',
                          border: '1px solid rgb(254, 202, 202)',
                        }}
                        onClick={() => { setSelectedCategory(''); setPage(1) }}
                      >
                        {categories.find((c: any) => c._id === selectedCategory)?.name}
                        <X className="w-3 h-3" />
                      </span>
                    )}
                    <button
                      onClick={() => { setSearch(''); setSelectedCategory(''); setPage(1) }}
                      className="text-xs font-bold transition-colors"
                      style={{ color: 'rgb(110, 118, 135)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgb(110, 118, 135)')}
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── Products Grid ── */}
            {isLoading ? (
              /* Skeleton */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden animate-pulse"
                    style={{
                      borderRadius: '6px',
                      backgroundColor: 'rgb(255, 255, 255)',
                      border: '1px solid rgb(220, 223, 230)',
                    }}
                  >
                    <div style={{ height: '180px', backgroundColor: 'rgb(240, 242, 245)' }} />
                    <div className="p-4 space-y-2">
                      <div style={{ height: '14px', borderRadius: '4px', backgroundColor: 'rgb(240, 242, 245)', width: '75%' }} />
                      <div style={{ height: '12px', borderRadius: '4px', backgroundColor: 'rgb(240, 242, 245)', width: '55%' }} />
                      <div style={{ height: '12px', borderRadius: '4px', backgroundColor: 'rgb(240, 242, 245)', width: '90%' }} />
                      <div className="flex justify-between items-center pt-2">
                        <div style={{ height: '20px', borderRadius: '4px', backgroundColor: 'rgb(240, 242, 245)', width: '35%' }} />
                        <div style={{ height: '30px', borderRadius: '4px', backgroundColor: 'rgb(240, 242, 245)', width: '28%' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              /* Error */
              <div
                className="flex flex-col items-center text-center p-12"
                style={{
                  backgroundColor: 'rgb(255, 255, 255)',
                  border: '1px solid rgb(220, 223, 230)',
                  borderRadius: '6px',
                }}
              >
                <div
                  className="w-14 h-14 flex items-center justify-center mb-4"
                  style={{ borderRadius: '8px', backgroundColor: 'rgb(254, 242, 242)', border: '1px solid rgb(254, 202, 202)' }}
                >
                  <X className="w-6 h-6" style={{ color: 'rgb(185, 28, 28)' }} />
                </div>
                <h3 className="text-base font-bold mb-1" style={{ color: 'rgb(15, 20, 35)' }}>Failed to load products</h3>
                <p className="text-sm" style={{ color: 'rgb(110, 118, 135)' }}>Please try refreshing the page</p>
              </div>
            ) : !data?.products || data.products.length === 0 ? (
              /* Empty */
              <div
                className="flex flex-col items-center text-center p-12"
                style={{
                  backgroundColor: 'rgb(255, 255, 255)',
                  border: '1px solid rgb(220, 223, 230)',
                  borderRadius: '6px',
                }}
              >
                <div
                  className="w-14 h-14 flex items-center justify-center mb-4"
                  style={{ borderRadius: '8px', backgroundColor: 'rgb(254, 242, 242)', border: '1px solid rgb(254, 202, 202)' }}
                >
                  <Search className="w-6 h-6" style={{ color: 'rgb(185, 28, 28)' }} />
                </div>
                <h3 className="text-base font-bold mb-1" style={{ color: 'rgb(15, 20, 35)' }}>No products found</h3>
                <p className="text-sm mb-4" style={{ color: 'rgb(110, 118, 135)' }}>
                  Try adjusting your search or filter
                </p>
                <button
                  onClick={() => { setSearch(''); setSelectedCategory(''); setPage(1) }}
                  className="text-sm font-bold px-5 py-2 transition-colors"
                  style={{
                    borderRadius: '4px',
                    backgroundColor: 'rgb(185, 28, 28)',
                    color: 'rgb(255, 255, 255)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {data.products.map((product: any) => {
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
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.09)')}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)')}
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
                                  style={{ fill: 'transparent', color: 'rgb(229, 231, 235)', strokeWidth: 2 }}
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

                {/* ── Pagination ── */}
                {data.pagination?.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex items-center gap-1 text-sm font-bold px-3 py-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        borderRadius: '4px',
                        border: '1px solid rgb(220, 223, 230)',
                        backgroundColor: 'rgb(255, 255, 255)',
                        color: 'rgb(75, 85, 99)',
                      }}
                      onMouseEnter={e => { if (page > 1) e.currentTarget.style.borderColor = 'rgb(185, 28, 28)' }}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                    >
                      <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                    </button>

                    {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className="text-sm font-bold px-3.5 py-2 transition-colors"
                        style={{
                          borderRadius: '4px',
                          border: pageNum === page ? '1px solid rgb(185, 28, 28)' : '1px solid rgb(220, 223, 230)',
                          backgroundColor: pageNum === page ? 'rgb(185, 28, 28)' : 'rgb(255, 255, 255)',
                          color: pageNum === page ? 'rgb(255, 255, 255)' : 'rgb(75, 85, 99)',
                          minWidth: '38px',
                        }}
                        onMouseEnter={e => { if (pageNum !== page) e.currentTarget.style.borderColor = 'rgb(185, 28, 28)' }}
                        onMouseLeave={e => { if (pageNum !== page) e.currentTarget.style.borderColor = 'rgb(220, 223, 230)' }}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                      disabled={page >= data.pagination.totalPages}
                      className="flex items-center gap-1 text-sm font-bold px-3 py-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        borderRadius: '4px',
                        border: '1px solid rgb(220, 223, 230)',
                        backgroundColor: 'rgb(255, 255, 255)',
                        color: 'rgb(75, 85, 99)',
                      }}
                      onMouseEnter={e => { if (page < data.pagination.totalPages) e.currentTarget.style.borderColor = 'rgb(185, 28, 28)' }}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                    >
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
