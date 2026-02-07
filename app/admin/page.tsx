"use client"

import Link from "next/link"
import { Package, TrendingUp, DollarSign, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGetProductsQuery } from "@/lib/services/product.api"

export default function AdminDashboard() {
  const { data, isLoading } = useGetProductsQuery({ limit: 100 })

  const totalProducts = data?.pagination.total || 0
  const categories = data ? [...new Set(data.products.map(p => p.category))].length : 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome to your admin panel
          </p>
        </div>
        <Link href="/admin/products/create">
          <Button className="bg-primary hover:bg-primary/90">
            <Package className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Products
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {isLoading ? "..." : totalProducts}
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Package className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Categories
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {isLoading ? "..." : categories}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Value
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${isLoading ? "..." : data?.products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Site Visitors
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                1,234
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/products/create">
            <Button variant="outline" className="w-full h-24 flex-col gap-2">
              <Package className="w-8 h-8" />
              <span>Add New Product</span>
            </Button>
          </Link>
          <Link href="/admin/products">
            <Button variant="outline" className="w-full h-24 flex-col gap-2">
              <Eye className="w-8 h-8" />
              <span>View All Products</span>
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full h-24 flex-col gap-2">
              <TrendingUp className="w-8 h-8" />
              <span>View Site</span>
            </Button>
          </Link>
        </div>
      </Card>

      {/* Recent Products */}
      {!isLoading && data && data.products.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Products
            </h2>
            <Link href="/admin/products">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {data.products.slice(0, 5).map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {(product.images[0] || product.productImage) && (
                    <img
                      src={product.images[0] || product.productImage}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {product.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">${product.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
