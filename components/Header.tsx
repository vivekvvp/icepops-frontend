"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, LogOut, User, Heart, Package, MapPin, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLogoutMutation, useGetCartQuery } from "@/lib/services/api"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { selectIsAuthenticated, logout as logoutAction } from "@/lib/store/authSlice"
import { toast } from "sonner"

export default function Header() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector((state) => state.auth.user)
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation()
  const { data: cartData } = useGetCartQuery(undefined, { skip: !isAuthenticated })
  const [showUserMenu, setShowUserMenu] = useState(false)

  const cartItemCount = cartData?.data?.items?.length || 0

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      dispatch(logoutAction())
      toast.success("Logged out successfully")
      router.push("/")
      router.refresh()
    } catch (error) {
      // Even if API call fails, clear local state
      dispatch(logoutAction())
      toast.success("Logged out successfully")
      router.push("/")
      router.refresh()
    }
  }

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f4f0f0] dark:border-[#332222] px-10 py-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-4 text-primary">
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
          <h2 className="text-xl font-extrabold leading-tight tracking-tight">IcePops</h2>
        </Link>
        <nav className="hidden lg:flex items-center gap-9">
          <Link href="/" className="text-sm font-semibold hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/products" className="text-sm font-semibold hover:text-primary transition-colors">
            Products
          </Link>
          <a className="text-sm font-semibold hover:text-primary transition-colors" href="#">
            About
          </a>
          {isAuthenticated && user?.role === 'ADMIN' && (
            <Link href="/admin" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
              Admin
            </Link>
          )}
        </nav>
      </div>
      <div className="flex flex-1 justify-end gap-4 items-center">
        <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-full h-full">
            <div className="text-[#886364] flex border-none bg-white dark:bg-[#332222] items-center justify-center pl-4 rounded-l-full">
              <Search className="w-5 h-5" />
            </div>
            <Input
              className="flex w-full min-w-0 flex-1 rounded-r-full text-[#181111] dark:text-white focus:outline-0 focus:ring-0 border-none bg-white dark:bg-[#332222] h-full placeholder:text-[#886364] px-4 pl-2 text-sm font-normal"
              placeholder="Search flavors"
            />
          </div>
        </label>
        
        <Link href="/cart">
          <Button className="relative flex min-w-[48px] items-center justify-center rounded-full h-10 px-4 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
            <ShoppingCart className="mr-2 h-5 w-5" />
            <span className="truncate">Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Button>
        </Link>
        
        {isAuthenticated ? (
          <div className="relative flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="hidden sm:flex items-center gap-2 rounded-full border-primary/20 hover:bg-primary/10"
            >
              <LogOut className="h-4 w-4" />
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </Button>
            
            <div className="relative">
              <div
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20 cursor-pointer hover:border-primary transition-colors"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA8B6qNggFZSQeQz9fKui41jH8xlB1ZfYBUaK1zqkW5wlAyNPA0vkcQ9odFlEvi6lnEBva-jmEO9rQqw4qmaqcUejjiuubW7y2VUCVgwC5fq4gTg2QErE5GdyCU-H-dFVmTUn1wO6rBftLGM4xi4BQzti02zyaYdje2n52GQmHhI0C4MGPdc5axpd3vABiVpStOyuiZMfDm55ZqM7jqxXM1GlmAqE4c79FxemdGnK7p2aRuPlZ4_h7bEzM6gZYvDjcWFEEhc5vWY4Y")',
                }}
              ></div>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#332222] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span>Wishlist</span>
                    </Link>
                    <Link
                      href="/addresses"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Addresses</span>
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        handleLogout()
                      }}
                      disabled={isLoggingOut}
                      className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors rounded"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="outline"
                className="rounded-full border-primary/20 hover:bg-primary/10 font-semibold"
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
