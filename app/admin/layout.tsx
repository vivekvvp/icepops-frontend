"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  LayoutDashboard, 
  Package, 
  LogOut, 
  Home, 
  ShoppingCart, 
  Users, 
  Tag, 
  Star, 
  FolderTree,
  Boxes
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { selectCurrentUser, logout as logoutAction } from "@/lib/store/authSlice"
import { useLogoutMutation } from "@/lib/services/api"
import { AdminProtectedRoute } from "@/lib/ProtectedRoute"
import { toast } from "sonner"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)
  const [logout] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      dispatch(logoutAction())
      toast.success("Logged out successfully")
      router.push("/")
    } catch (error) {
      dispatch(logoutAction())
      toast.success("Logged out successfully")
      router.push("/")
    }
  }

  return (
    <AdminProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed h-full">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <Link href="/admin" className="flex items-center gap-3 text-primary">
                <div className="size-8">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path
                      clipRule="evenodd"
                      d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
                      fill="currentColor"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold">IcePops</h2>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Package className="w-5 h-5" />
                <span className="font-medium">Products</span>
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FolderTree className="w-5 h-5" />
                <span className="font-medium">Categories</span>
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium">Orders</span>
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Users</span>
              </Link>
              <Link
                href="/admin/coupons"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Tag className="w-5 h-5" />
                <span className="font-medium">Coupons</span>
              </Link>
              <Link
                href="/admin/reviews"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Star className="w-5 h-5" />
                <span className="font-medium">Reviews</span>
              </Link>
              <Link
                href="/admin/inventory"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Boxes className="w-5 h-5" />
                <span className="font-medium">Inventory</span>
              </Link>
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="mb-3 px-2">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
              <Link href="/">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 mt-2">
                  <Home className="w-4 h-4" />
                  Back to Site
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </AdminProtectedRoute>
  )
}
