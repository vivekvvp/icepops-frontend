"use client"

import Link from "next/link"
import {
  Package,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  AlertTriangle,
  Eye,
  Plus,
} from "lucide-react"
import { useGetDashboardStatsQuery } from "@/lib/services/api"
import { toast } from "sonner"
import { useEffect } from "react"

export default function AdminDashboard() {
  const { data, isLoading, error } = useGetDashboardStatsQuery(undefined)

  const stats = data?.data

  const totalOrders = stats?.orderStatusBreakdown
    ? Object.values(stats.orderStatusBreakdown as Record<string, number>).reduce(
        (a: number, b: number) => a + b,
        0
      )
    : 0

  const pendingOrders = (stats?.orderStatusBreakdown as any)?.PENDING || 0
  const topSellingProducts: any[] = stats?.topSellingProducts || []
  const lowStockProducts: any[] = stats?.lowStockProducts || []

  useEffect(() => {
    if (error) toast.error("Failed to load dashboard stats")
  }, [error])

  return (
    <div className="min-h-screen p-8 space-y-6" style={{ backgroundColor: 'rgb(246, 247, 249)' }}>

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between pb-6"
        style={{ borderBottom: '1px solid rgb(220, 223, 230)' }}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'rgb(15, 20, 35)' }}>
            Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
            Business performance overview
          </p>
        </div>
        <Link href="/admin/products/create">
          <button
            className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-md transition-colors"
            style={{ backgroundColor: 'rgb(185, 28, 28)', color: 'rgb(255, 255, 255)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Add Product
          </button>
        </Link>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Revenue */}
        <div
          className="p-5 rounded-md"
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            border: '1px solid rgb(220, 223, 230)',
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: 'rgb(150, 158, 175)' }}
              >
                Total Revenue
              </p>
              <p className="text-2xl font-bold mt-2" style={{ color: 'rgb(15, 20, 35)' }}>
                {isLoading ? '—' : `₹${stats?.totalRevenue != null ? Number(stats.totalRevenue).toFixed(2) : '0.00'}`}
              </p>
            </div>
            <div
              className="p-2.5 shrink-0"
              style={{
                borderRadius: '6px',
                backgroundColor: 'rgb(240, 253, 244)',
                border: '1px solid rgb(187, 247, 208)',
              }}
            >
              <DollarSign className="w-5 h-5 stroke-[2.5]" style={{ color: 'rgb(21, 91, 48)' }} />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div
          className="p-5 rounded-md"
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            border: '1px solid rgb(220, 223, 230)',
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: 'rgb(150, 158, 175)' }}
              >
                Total Orders
              </p>
              <p className="text-2xl font-bold mt-2" style={{ color: 'rgb(15, 20, 35)' }}>
                {isLoading ? '—' : totalOrders}
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgb(150, 158, 175)' }}>
                {pendingOrders} pending
              </p>
            </div>
            <div
              className="p-2.5 shrink-0"
              style={{
                borderRadius: '6px',
                backgroundColor: 'rgb(239, 246, 255)',
                border: '1px solid rgb(219, 234, 254)',
              }}
            >
              <ShoppingCart className="w-5 h-5 stroke-[2.5]" style={{ color: 'rgb(29, 78, 216)' }} />
            </div>
          </div>
        </div>

        {/* Orders This Month */}
        <div
          className="p-5 rounded-md"
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            border: '1px solid rgb(220, 223, 230)',
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: 'rgb(150, 158, 175)' }}
              >
                Orders This Month
              </p>
              <p className="text-2xl font-bold mt-2" style={{ color: 'rgb(15, 20, 35)' }}>
                {isLoading ? '—' : stats?.ordersMonth || 0}
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgb(185, 28, 28)' }}>
                {lowStockProducts.length} low stock
              </p>
            </div>
            <div
              className="p-2.5 shrink-0"
              style={{
                borderRadius: '6px',
                backgroundColor: 'rgb(254, 242, 242)',
                border: '1px solid rgb(254, 202, 202)',
              }}
            >
              <Package className="w-5 h-5 stroke-[2.5]" style={{ color: 'rgb(185, 28, 28)' }} />
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div
          className="p-5 rounded-md"
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            border: '1px solid rgb(220, 223, 230)',
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: 'rgb(150, 158, 175)' }}
              >
                Active Users
              </p>
              <p className="text-2xl font-bold mt-2" style={{ color: 'rgb(15, 20, 35)' }}>
                {isLoading ? '—' : stats?.activeUsers || 0}
              </p>
            </div>
            <div
              className="p-2.5 shrink-0"
              style={{
                borderRadius: '6px',
                backgroundColor: 'rgb(245, 243, 255)',
                border: '1px solid rgb(221, 214, 254)',
              }}
            >
              <Users className="w-5 h-5 stroke-[2.5]" style={{ color: 'rgb(109, 40, 217)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Low Stock Alert ── */}
      {!isLoading && lowStockProducts.length > 0 && (
        <div
          className="rounded-md overflow-hidden"
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            border: '1px solid rgb(220, 223, 230)',
          }}
        >
          {/* Section header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{
              borderBottom: '1px solid rgb(240, 242, 245)',
              backgroundColor: 'rgb(248, 249, 251)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="flex items-center justify-center w-7 h-7"
                style={{
                  borderRadius: '6px',
                  backgroundColor: 'rgb(254, 242, 242)',
                  border: '1px solid rgb(254, 202, 202)',
                }}
              >
                <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" style={{ color: 'rgb(185, 28, 28)' }} />
              </div>
              <p className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
                Low Stock Alert
              </p>
              <span
                className="text-xs font-bold px-2 py-0.5"
                style={{
                  borderRadius: '4px',
                  backgroundColor: 'rgb(254, 242, 242)',
                  color: 'rgb(185, 28, 28)',
                  border: '1px solid rgb(254, 202, 202)',
                }}
              >
                {lowStockProducts.length} items
              </span>
            </div>
            <Link href="/admin/inventory">
              <button
                className="text-xs font-bold transition-colors"
                style={{ color: 'rgb(185, 28, 28)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgb(153, 27, 27)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
              >
                View All →
              </button>
            </Link>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgb(240, 242, 245)', backgroundColor: 'rgb(252, 252, 253)' }}>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'rgb(100, 108, 125)' }}>Product</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'rgb(100, 108, 125)' }}>Status</th>
                <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'rgb(100, 108, 125)' }}>Stock</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.slice(0, 6).map((product: any, i: number) => (
                <tr
                  key={product._id}
                  style={{ borderBottom: i < Math.min(lowStockProducts.length, 6) - 1 ? '1px solid rgb(240, 242, 245)' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(252, 252, 253)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-8 h-8 object-cover shrink-0"
                          style={{ borderRadius: '4px', border: '1px solid rgb(220, 223, 230)' }}
                        />
                      ) : (
                        <div
                          className="w-8 h-8 shrink-0"
                          style={{
                            borderRadius: '4px',
                            backgroundColor: 'rgb(243, 244, 246)',
                            border: '1px solid rgb(220, 223, 230)',
                          }}
                        />
                      )}
                      <span
                        className="font-semibold truncate"
                        style={{ color: 'rgb(15, 20, 35)', maxWidth: '200px' }}
                      >
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-xs font-bold px-2.5 py-1"
                      style={
                        product.stock === 0
                          ? { borderRadius: '4px', backgroundColor: 'rgb(254, 242, 242)', color: 'rgb(185, 28, 28)', border: '1px solid rgb(254, 202, 202)' }
                          : { borderRadius: '4px', backgroundColor: 'rgb(255, 251, 235)', color: 'rgb(161, 72, 10)', border: '1px solid rgb(253, 230, 138)' }
                      }
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-bold" style={{ color: 'rgb(55, 65, 81)' }}>
                    {product.stock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Bottom Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Selling Products */}
        {!isLoading && topSellingProducts.length > 0 && (
          <div
            className="rounded-md overflow-hidden"
            style={{
              backgroundColor: 'rgb(255, 255, 255)',
              border: '1px solid rgb(220, 223, 230)',
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{
                borderBottom: '1px solid rgb(240, 242, 245)',
                backgroundColor: 'rgb(248, 249, 251)',
              }}
            >
              <p className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
                Top Selling Products
              </p>
              <TrendingUp className="w-4 h-4 stroke-[2.5]" style={{ color: 'rgb(185, 28, 28)' }} />
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgb(240, 242, 245)', backgroundColor: 'rgb(252, 252, 253)' }}>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'rgb(100, 108, 125)' }}>#</th>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'rgb(100, 108, 125)' }}>Product</th>
                  <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'rgb(100, 108, 125)' }}>Sold</th>
                  <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'rgb(100, 108, 125)' }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topSellingProducts.slice(0, 5).map((item: any, index: number) => (
                  <tr
                    key={item._id}
                    style={{
                      borderBottom: index < Math.min(topSellingProducts.length, 5) - 1
                        ? '1px solid rgb(240, 242, 245)'
                        : 'none',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(252, 252, 253)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td className="px-5 py-3.5 text-xs font-bold" style={{ color: 'rgb(185, 28, 28)' }}>
                      {index + 1}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-8 h-8 object-cover shrink-0"
                            style={{ borderRadius: '4px', border: '1px solid rgb(220, 223, 230)' }}
                          />
                        ) : (
                          <div
                            className="w-8 h-8 shrink-0"
                            style={{
                              borderRadius: '4px',
                              backgroundColor: 'rgb(243, 244, 246)',
                              border: '1px solid rgb(220, 223, 230)',
                            }}
                          />
                        )}
                        <span
                          className="font-semibold truncate"
                          style={{ color: 'rgb(15, 20, 35)', maxWidth: '140px' }}
                        >
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold" style={{ color: 'rgb(110, 118, 135)' }}>
                      {item.totalSold}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
                      ₹{Number(item.revenue).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Quick Actions */}
        <div
          className="rounded-md overflow-hidden"
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            border: '1px solid rgb(220, 223, 230)',
          }}
        >
          <div
            className="px-5 py-4"
            style={{
              borderBottom: '1px solid rgb(240, 242, 245)',
              backgroundColor: 'rgb(248, 249, 251)',
            }}
          >
            <p className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>Quick Actions</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>Common admin tasks</p>
          </div>

          <div className="p-5 grid grid-cols-2 gap-3">
            {[
              { href: '/admin/products/create', icon: Package,      label: 'Add Product',   color: 'rgb(185, 28, 28)',  bg: 'rgb(254, 242, 242)',  border: 'rgb(254, 202, 202)' },
              { href: '/admin/orders',          icon: ShoppingCart, label: 'View Orders',   color: 'rgb(29, 78, 216)',  bg: 'rgb(239, 246, 255)',  border: 'rgb(219, 234, 254)' },
              { href: '/admin/users',           icon: Users,        label: 'Manage Users',  color: 'rgb(109, 40, 217)', bg: 'rgb(245, 243, 255)',  border: 'rgb(221, 214, 254)' },
              { href: '/',                      icon: Eye,          label: 'View Site',     color: 'rgb(21, 91, 48)',   bg: 'rgb(240, 253, 244)',  border: 'rgb(187, 247, 208)' },
            ].map(({ href, icon: Icon, label, color, bg, border }) => (
              <Link key={href} href={href}>
                <button
                  className="w-full h-20 flex flex-col items-center justify-center gap-2 transition-all"
                  style={{
                    borderRadius: '6px',
                    border: `1px solid rgb(220, 223, 230)`,
                    backgroundColor: 'rgb(255, 255, 255)',
                    color: 'rgb(75, 85, 99)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = bg
                    e.currentTarget.style.borderColor = border
                    e.currentTarget.style.color = color
                    const icon = e.currentTarget.querySelector('svg') as SVGElement
                    if (icon) icon.style.color = color
                    const span = e.currentTarget.querySelector('span') as HTMLElement
                    if (span) span.style.color = color
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)'
                    e.currentTarget.style.borderColor = 'rgb(220, 223, 230)'
                    e.currentTarget.style.color = 'rgb(75, 85, 99)'
                    const icon = e.currentTarget.querySelector('svg') as SVGElement
                    if (icon) icon.style.color = 'rgb(100, 108, 125)'
                    const span = e.currentTarget.querySelector('span') as HTMLElement
                    if (span) span.style.color = 'rgb(75, 85, 99)'
                  }}
                >
                  <Icon className="w-5 h-5 stroke-[2.5]" style={{ color: 'rgb(100, 108, 125)' }} />
                  <span className="text-xs font-semibold">{label}</span>
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}