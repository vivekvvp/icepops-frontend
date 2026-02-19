"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGetProductsQuery, useGetAllCategoriesQuery, useAddToCartMutation } from "@/lib/services/api"

export default function ProductsPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
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
  
  // Extract data from API response wrapper
  const data = response?.data
  const categories = categoriesResponse?.data

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await addToCart({ productId, quantity: 1 }).unwrap()
      toast.success("Product added to cart!")
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add to cart")
    }
  }

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
              <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setPage(1)
                    }}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
                
                {/* Category Dropdown */}
                {categories && categories.length > 0 && (
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => {
                      setSelectedCategory(value === "all" ? "" : value)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-[180px] h-9 text-sm">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category: any) => (
                        <SelectItem key={category._id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              ) : !data?.products || data.products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">No products found</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {data?.products.map((product: any) => (
                      <Link
                        key={product._id}
                        href={`/products/${product._id}`}
                      >
                        <Card
                          className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full"
                        >
                          <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800">
                            {(product.images?.[0] || product.productImage) ? (
                              <img
                                src={product.images[0] || product.productImage}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                suppressHydrationWarning
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Image
                              </div>
                            )}
                            <div className="absolute top-3 right-3">
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/90 text-white backdrop-blur-sm" suppressHydrationWarning>
                                {typeof product.category === 'object' ? product.category?.name : product.category}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-primary" suppressHydrationWarning>
                                ${product.price?.toFixed(2)}
                              </span>
                              <Button 
                                size="sm" 
                                className="bg-primary hover:bg-primary/90"
                                onClick={(e) => handleAddToCart(product._id, e)}
                                disabled={isAddingToCart}
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {data && data.pagination.totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-2">
                        {[...Array(Math.min(5, data.pagination.totalPages))].map((_, i) => {
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
                        disabled={page >= data.pagination.totalPages}
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
