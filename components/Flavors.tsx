"use client"

import Link from "next/link"
import { ChevronRight, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGetLatestProductsQuery } from "@/lib/services/product.api"

export default function Flavors() {
  const { data: products, isLoading } = useGetLatestProductsQuery(4)

  if (isLoading) {
    return (
      <section className="pb-24 bg-background-light dark:bg-background-dark">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-chocolate-rich dark:text-white">
              Latest Products
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="h-80 animate-pulse bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pb-24 bg-background-light dark:bg-background-dark">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-chocolate-rich dark:text-white">
            Latest Products
          </h2>
          <Link
            href="/products"
            className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
          >
            See All <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products && products.length > 0 ? (
            products.map((product) => (
              <Card
                key={product._id}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {(product.images[0] || product.productImage) ? (
                    <img
                      src={product.images[0] || product.productImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/90 text-white backdrop-blur-sm">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <ShoppingCart className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-4 text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No products available yet</p>
              <Link href="/products">
                <Button className="mt-4 bg-primary hover:bg-primary/90">
                  Browse All Products
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {products && products.length > 0 && (
          <div className="flex justify-center mt-12">
            <Link href="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                View More Products
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
