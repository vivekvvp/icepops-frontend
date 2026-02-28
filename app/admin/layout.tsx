"use client"

import { usePathname, useRouter } from "next/navigation"
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
  Boxes,
} from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { selectCurrentUser, logout as logoutAction } from "@/lib/store/authSlice"
import { useLogoutMutation } from "@/lib/services/api"
import { AdminProtectedRoute } from "@/lib/ProtectedRoute"
import { toast } from "sonner"

const navItems = [
  { href: '/admin',            label: 'Dashboard',  icon: LayoutDashboard, exact: true },
  { href: '/admin/products',   label: 'Products',   icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/orders',     label: 'Orders',     icon: ShoppingCart },
  { href: '/admin/users',      label: 'Users',      icon: Users },
  { href: '/admin/coupons',    label: 'Coupons',    icon: Tag },
  { href: '/admin/reviews',    label: 'Reviews',    icon: Star },
  { href: '/admin/inventory',  label: 'Inventory',  icon: Boxes },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const user     = useAppSelector(selectCurrentUser)
  const [logout] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
    } catch {}
    dispatch(logoutAction())
    toast.success("Logged out successfully")
    router.push("/")
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  return (
    <AdminProtectedRoute>
      <div className="flex min-h-screen" style={{ backgroundColor: 'rgb(246, 247, 249)' }}>

        {/* ── Sidebar ── */}
        <aside
          className="w-60 fixed h-full flex flex-col"
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            borderRight: '1px solid rgb(220, 223, 230)',
            zIndex: 40,
          }}
        >
          {/* Logo */}
          <div
            className="px-5 py-5 flex items-center gap-3 shrink-0"
            style={{ borderBottom: '1px solid rgb(220, 223, 230)' }}
          >
            <div
              className="flex items-center justify-center w-8 h-8 shrink-0"
              style={{
                borderRadius: '6px',
                backgroundColor: 'rgb(185, 28, 28)',
              }}
            >
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                <path
                  clipRule="evenodd"
                  d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
                  fill="white"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h2
                className="text-base font-extrabold leading-tight tracking-tight"
                style={{ color: 'rgb(15, 20, 35)' }}
              >
                IcePops
              </h2>
              <p className="text-xs" style={{ color: 'rgb(150, 158, 175)' }}>
                Admin Panel
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-3 ">
            {navItems.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact)
              return (
                <Link key={href} href={href}>
                  <div
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-colors cursor-pointer"
                    style={{
                      borderRadius: '6px',
                      backgroundColor: active ? 'rgb(254, 242, 242)' : 'transparent',
                      color: active ? 'rgb(185, 28, 28)' : 'rgb(75, 85, 99)',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'rgb(248, 249, 251)'
                        e.currentTarget.style.color = 'rgb(15, 20, 35)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = 'rgb(75, 85, 99)'
                      }
                    }}
                  >
                    <Icon
                      className="w-4 h-4 shrink-0"
                      style={{ strokeWidth: active ? 2.5 : 2 }}
                    />
                    {label}
                    {active && (
                      <div
                        className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: 'rgb(185, 28, 28)' }}
                      />
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div
            className="px-3 py-4 shrink-0 space-y-1"
            style={{ borderTop: '1px solid rgb(220, 223, 230)' }}
          >
            {/* User info */}
            <div
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-md mb-2"
              style={{
                backgroundColor: 'rgb(248, 249, 251)',
                border: '1px solid rgb(240, 242, 245)',
              }}
            >
              <div
                className="flex items-center justify-center w-7 h-7 text-xs font-bold shrink-0"
                style={{
                  borderRadius: '6px',
                  backgroundColor: 'rgb(254, 242, 242)',
                  border: '1px solid rgb(254, 202, 202)',
                  color: 'rgb(185, 28, 28)',
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="overflow-hidden">
                <p
                  className="text-xs font-bold truncate"
                  style={{ color: 'rgb(15, 20, 35)' }}
                >
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs truncate" style={{ color: 'rgb(150, 158, 175)' }}>
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Back to site */}
            <Link href="/">
              <div
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-colors cursor-pointer"
                style={{ borderRadius: '6px', color: 'rgb(75, 85, 99)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgb(248, 249, 251)'
                  e.currentTarget.style.color = 'rgb(15, 20, 35)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'rgb(75, 85, 99)'
                }}
              >
                <Home className="w-4 h-4 shrink-0" strokeWidth={2} />
                Back to Site
              </div>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-colors"
              style={{ borderRadius: '6px', color: 'rgb(185, 28, 28)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(254, 242, 242)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <LogOut className="w-4 h-4 shrink-0" strokeWidth={2.5} />
              Logout
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1" style={{ marginLeft: '240px' }}>
          {children}
        </main>
      </div>
    </AdminProtectedRoute>
  )
}
