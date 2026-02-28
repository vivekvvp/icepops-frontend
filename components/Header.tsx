"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, LogOut, User, Heart, Package, MapPin, ChevronDown, Menu, X } from "lucide-react"
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
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const menuRef = useRef<HTMLDivElement>(null)

  const cartItemCount = cartData?.data?.items?.length || 0

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleLogout = async () => {
    setShowUserMenu(false)
    try {
      await logout().unwrap()
      dispatch(logoutAction())
      toast.success("Logged out successfully")
      router.push("/")
      router.refresh()
    } catch {
      dispatch(logoutAction())
      toast.success("Logged out successfully")
      router.push("/")
      router.refresh()
    }
  }

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
  ]

  const menuItems = [
    { label: "My Orders", href: "/orders", icon: Package },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    { label: "Addresses", href: "/addresses", icon: MapPin },
    { label: "Profile", href: "/profile", icon: User },
  ]

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderBottom: '1px solid rgb(220, 223, 230)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div
              className="flex items-center justify-center w-8 h-8"
              style={{ borderRadius: '6px', backgroundColor: 'rgb(185, 28, 28)' }}
            >
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                <path
                  clipRule="evenodd"
                  d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
                  fill="white"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <span
              className="text-lg font-extrabold tracking-tight"
              style={{ color: 'rgb(15, 20, 35)' }}
            >
              IcePops
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold transition-colors"
                style={{ color: 'rgb(75, 85, 99)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgb(75, 85, 99)')}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="text-sm font-bold transition-colors"
                style={{ color: 'rgb(185, 28, 28)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgb(153, 27, 27)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* ── Right Section ── */}
          <div className="flex items-center gap-2.5">

            {/* Search (desktop) */}
            <div
              className="hidden md:flex items-center gap-2 h-9 px-3"
              style={{
                borderRadius: '6px',
                border: '1px solid rgb(220, 223, 230)',
                backgroundColor: 'rgb(248, 249, 251)',
                minWidth: '180px',
                maxWidth: '240px',
              }}
              onFocus={() => {}}
            >
              <Search className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgb(150, 158, 175)' }} />
              <input
                type="text"
                placeholder="Search flavors..."
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                className="flex-1 text-sm bg-transparent outline-none"
                style={{ color: 'rgb(15, 20, 35)' }}
              />
            </div>

            {/* Cart */}
            <Link href="/cart">
              <button
                className="relative flex items-center gap-1.5 h-9 px-3 text-sm font-bold transition-colors"
                style={{
                  borderRadius: '6px',
                  backgroundColor: 'rgb(185, 28, 28)',
                  color: 'rgb(255, 255, 255)',
                  border: '1px solid rgb(185, 28, 28)',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
              >
                <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Cart</span>
                {cartItemCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 text-xs font-extrabold"
                    style={{
                      borderRadius: '50%',
                      backgroundColor: 'rgb(255, 255, 255)',
                      color: 'rgb(185, 28, 28)',
                      border: '1.5px solid rgb(185, 28, 28)',
                      fontSize: '10px',
                    }}
                  >
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 h-9 px-2.5 transition-colors"
                  style={{
                    borderRadius: '6px',
                    border: '1px solid rgb(220, 223, 230)',
                    backgroundColor: showUserMenu ? 'rgb(248, 249, 251)' : 'rgb(255, 255, 255)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(248, 249, 251)')}
                  onMouseLeave={e => {
                    if (!showUserMenu) e.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)'
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="flex items-center justify-center w-6 h-6 text-xs font-extrabold"
                    style={{
                      borderRadius: '4px',
                      backgroundColor: 'rgb(254, 242, 242)',
                      color: 'rgb(185, 28, 28)',
                      border: '1px solid rgb(254, 202, 202)',
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span
                    className="hidden sm:inline text-sm font-bold max-w-[90px] truncate"
                    style={{ color: 'rgb(15, 20, 35)' }}
                  >
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown
                    className="w-3.5 h-3.5 transition-transform"
                    style={{
                      color: 'rgb(110, 118, 135)',
                      transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>

                {/* Dropdown */}
                {showUserMenu && (
                  <div
                    className="absolute right-0 mt-1.5 w-56 overflow-hidden"
                    style={{
                      borderRadius: '6px',
                      backgroundColor: 'rgb(255, 255, 255)',
                      border: '1px solid rgb(220, 223, 230)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                      zIndex: 100,
                    }}
                  >
                    {/* User Info */}
                    <div
                      className="px-4 py-3"
                      style={{ borderBottom: '1px solid rgb(240, 242, 245)', backgroundColor: 'rgb(248, 249, 251)' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex items-center justify-center w-8 h-8 shrink-0 text-sm font-extrabold"
                          style={{
                            borderRadius: '6px',
                            backgroundColor: 'rgb(254, 242, 242)',
                            color: 'rgb(185, 28, 28)',
                            border: '1px solid rgb(254, 202, 202)',
                          }}
                        >
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-sm font-bold truncate"
                            style={{ color: 'rgb(15, 20, 35)' }}
                          >
                            {user?.name}
                          </p>
                          <p
                            className="text-xs truncate"
                            style={{ color: 'rgb(110, 118, 135)' }}
                          >
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      {menuItems.map(item => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div
                            className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
                            style={{ color: 'rgb(55, 65, 81)' }}
                            onMouseEnter={e => {
                              e.currentTarget.style.backgroundColor = 'rgb(248, 249, 251)'
                              e.currentTarget.style.color = 'rgb(185, 28, 28)'
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                              e.currentTarget.style.color = 'rgb(55, 65, 81)'
                            }}
                          >
                            <item.icon className="w-4 h-4 shrink-0" />
                            <span className="text-sm font-semibold">{item.label}</span>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Logout */}
                    <div style={{ borderTop: '1px solid rgb(240, 242, 245)' }} className="p-1.5">
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-3 px-3 py-2 w-full transition-colors disabled:opacity-50"
                        style={{ borderRadius: '4px', color: 'rgb(185, 28, 28)' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(254, 242, 242)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <LogOut className="w-4 h-4 shrink-0" />
                        <span className="text-sm font-bold">
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <button
                    className="h-9 px-4 text-sm font-bold transition-colors"
                    style={{
                      borderRadius: '6px',
                      border: '1px solid rgb(220, 223, 230)',
                      backgroundColor: 'rgb(255, 255, 255)',
                      color: 'rgb(55, 65, 81)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgb(185, 28, 28)'
                      e.currentTarget.style.color = 'rgb(185, 28, 28)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgb(220, 223, 230)'
                      e.currentTarget.style.color = 'rgb(55, 65, 81)'
                    }}
                  >
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button
                    className="h-9 px-4 text-sm font-bold transition-colors"
                    style={{
                      borderRadius: '6px',
                      backgroundColor: 'rgb(185, 28, 28)',
                      color: 'rgb(255, 255, 255)',
                      border: '1px solid rgb(185, 28, 28)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
                  >
                    Sign Up
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 transition-colors"
              style={{
                borderRadius: '6px',
                border: '1px solid rgb(220, 223, 230)',
                backgroundColor: 'rgb(255, 255, 255)',
                color: 'rgb(75, 85, 99)',
              }}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(248, 249, 251)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)')}
            >
              {showMobileMenu
                ? <X className="w-4 h-4 stroke-[2.5]" />
                : <Menu className="w-4 h-4 stroke-[2.5]" />
              }
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {showMobileMenu && (
          <div
            className="lg:hidden py-3 space-y-1"
            style={{ borderTop: '1px solid rgb(220, 223, 230)' }}
          >
            {/* Mobile Search */}
            <div
              className="flex items-center gap-2 h-9 px-3 mx-0 mb-2"
              style={{
                borderRadius: '6px',
                border: '1px solid rgb(220, 223, 230)',
                backgroundColor: 'rgb(248, 249, 251)',
              }}
            >
              <Search className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgb(150, 158, 175)' }} />
              <input
                type="text"
                placeholder="Search flavors..."
                className="flex-1 text-sm bg-transparent outline-none"
                style={{ color: 'rgb(15, 20, 35)' }}
              />
            </div>

            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setShowMobileMenu(false)}
              >
                <div
                  className="flex items-center px-3 py-2.5 text-sm font-semibold transition-colors cursor-pointer"
                  style={{ borderRadius: '4px', color: 'rgb(55, 65, 81)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'rgb(254, 242, 242)'
                    e.currentTarget.style.color = 'rgb(185, 28, 28)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = 'rgb(55, 65, 81)'
                  }}
                >
                  {link.label}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
