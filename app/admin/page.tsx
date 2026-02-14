"use client"

import Link from "next/link"
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  AlertTriangle,
  Eye 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGetDashboardStatsQuery } from "@/lib/services/api"
import { toast } from "sonner"
import { useEffect } from "react"

export default function AdminDashboard() {
  const { data, isLoading, error } = useGetDashboardStatsQuery(undefined)
  
  const stats = data?.data?.stats

  useEffect(() => {
    if (error) {
      toast.error("Failed to load dashboard stats")
    }
  }, [error])

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
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {isLoading ? "..." : `₹${stats?.totalRevenue.toLocaleString() || 0}`}
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
                Total Orders
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {isLoading ? "..." : stats?.totalOrders || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.pendingOrders} pending
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Products
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {isLoading ? "..." : stats?.totalProducts || 0}
              </p>
              <p className="text-xs text-red-500 mt-1">
                {stats?.lowStockProducts} low stock
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
                Active Users
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {isLoading ? "..." : stats?.activeUsers || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {!isLoading && stats && stats.lowStockAlert.length > 0 && (
        <Card className="p-6 bg-red-50 dark:bg-red-900/10 border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-red-900 dark:text-red-200">
              Low Stock Alert ({stats.lowStockAlert.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.lowStockAlert.slice(0, 6).map((product: any) => (
              <div
                key={product._id}
                className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg"
              >
                {product.images[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{product.name}</p>
                  <p className="text-xs text-red-600 font-bold">
                    Only {product.stock} left
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin/inventory">
            <Button variant="outline" className="w-full mt-4">
              View All Low Stock Items
            </Button>
          </Link>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        {!isLoading && stats && stats.topProducts.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Top Products
              </h2>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-3">
              {stats.topProducts.slice(0, 5).map((item: any, index: number) => (
                <div
                  key={item.product._id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <span className="text-2xl font-bold text-gray-300">
                    #{index + 1}
                  </span>
                  {item.product.images[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.totalQuantity} sold
                    </p>
                  </div>
                  <p className="font-bold text-primary">
                    ₹{item.totalRevenue.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/products/create">
              <Button variant="outline" className="w-full h-24 flex-col gap-2">
                <Package className="w-8 h-8" />
                <span className="text-sm">Add Product</span>
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="outline" className="w-full h-24 flex-col gap-2">
                <ShoppingCart className="w-8 h-8" />
                <span className="text-sm">View Orders</span>
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full h-24 flex-col gap-2">
                <Users className="w-8 h-8" />
                <span className="text-sm">Manage Users</span>
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full h-24 flex-col gap-2">
                <Eye className="w-8 h-8" />
                <span className="text-sm">View Site</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
