"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ShoppingCart } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useGetProductsQuery, useGetAllCategoriesQuery } from "@/lib/services/api"

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [page, setPage] = useState(1)
  const limit = 12

  const { data, isLoading, error } = useGetProductsQuery({
    page,
    limit,
    search: search || undefined,
    category: selectedCategory || undefined,
  })
  const { data: categoriesData } = useGetAllCategoriesQuery(undefined)
  
  const categories = categoriesData?.data || []

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="px-10 py-12 bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Our Products
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Discover our delicious collection of ice pops and frozen treats
              </p>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setPage(1)
                    }}
                    className="pl-10"
                  />
                </div>
                
                {/* Category Filter */}
                {categories && categories.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    <Button
                      variant={selectedCategory === "" ? "default" : "outline"}
                      onClick={() => {
                        setSelectedCategory("")
                        setPage(1)
                      }}
                      className="whitespace-nowrap"
                    >
                      All
                    </Button>
                    {categories.map((category: any) => (
                      <Button
                        key={category._id}
                        variant={selectedCategory === category._id ? "default" : "outline"}
                        onClick={() => {
                          setSelectedCategory(category._id)
                          setPage(1)
                        }}
                        className="whitespace-nowrap"
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Products Grid */}
          <section className="px-10 py-12">
            <div className="max-w-7xl mx-auto">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <Card key={i} className="h-96 animate-pulse bg-gray-200 dark:bg-gray-800" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">Error loading products</p>
                </div>
              ) : !data?.data?.products || data.data.products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">No products found</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {data?.data?.products.map((product: any) => {
                      // Safety check for missing product data
                      if (!product || !product._id) {
                        return null;
                      }
                      
                      return (
                        <Card
                          key={product._id}
                          className="group overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                          <Link href={`/products/${product._id}`}>
                            <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer">
                              {(product.images?.[0] || product.productImage) ? (
                                <img
                                  src={product.images?.[0] || product.productImage}
                                  alt={product.name || 'Product'}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  No Image
                                </div>
                              )}
                              <div className="absolute top-3 right-3">
                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/90 text-white backdrop-blur-sm">
                                  {product.category?.name || product.category || 'Uncategorized'}
                                </span>
                              </div>
                            </div>
                          </Link>
                          <div className="p-4">
                            <Link href={`/products/${product._id}`}>
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1 hover:text-primary cursor-pointer">
                                {product.name || 'Product'}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                              {product.description || ''}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-primary">
                                ${(product.price || 0).toFixed(2)}
                              </span>
                              <Link href={`/products/${product._id}`}>
                              <Button size="sm" className="bg-primary hover:bg-primary/90">
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {data?.data && data.data.pagination.totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-2">
                        {[...Array(Math.min(5, data.data.pagination.totalPages))].map((_, i) => {
                          const pageNum = i + 1
                          return (
                            <Button
                              key={i}
                              variant={page === pageNum ? "default" : "outline"}
                              onClick={() => setPage(pageNum)}
                              size="sm"
                            >
                              {pageNum}
                            </Button>
                          )
                        })}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= data.data.pagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  )
}
