'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package, ChevronRight, ChevronLeft,
  ArrowRight, ShoppingBag, Clock,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatDate } from '@/lib/utils';
import { useGetUserOrdersQuery } from '@/lib/services/api';
import { UserProtectedRoute } from '@/lib/ProtectedRoute';
import { toast } from 'sonner';

/* ── Status config ── */
const orderStatusConfig: Record<string, { label: string; bg: string; color: string; border: string }> = {
  PENDING:          { label: 'Pending',          bg: 'rgb(254, 252, 232)', color: 'rgb(133, 77, 14)',  border: 'rgb(253, 230, 138)' },
  CONFIRMED:        { label: 'Confirmed',         bg: 'rgb(239, 246, 255)', color: 'rgb(29, 78, 216)',  border: 'rgb(191, 219, 254)' },
  PACKED:           { label: 'Packed',            bg: 'rgb(238, 242, 255)', color: 'rgb(67, 56, 202)',  border: 'rgb(199, 210, 254)' },
  SHIPPED:          { label: 'Shipped',           bg: 'rgb(245, 243, 255)', color: 'rgb(109, 40, 217)', border: 'rgb(221, 214, 254)' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery',  bg: 'rgb(255, 247, 237)', color: 'rgb(154, 52, 18)',  border: 'rgb(254, 215, 170)' },
  DELIVERED:        { label: 'Delivered',         bg: 'rgb(240, 253, 244)', color: 'rgb(21, 91, 48)',   border: 'rgb(187, 247, 208)' },
  CANCELLED:        { label: 'Cancelled',         bg: 'rgb(254, 242, 242)', color: 'rgb(185, 28, 28)',  border: 'rgb(254, 202, 202)' },
};

const paymentStatusConfig: Record<string, { label: string; bg: string; color: string; border: string }> = {
  PENDING:  { label: 'Unpaid',    bg: 'rgb(254, 252, 232)', color: 'rgb(133, 77, 14)',  border: 'rgb(253, 230, 138)' },
  PAID:     { label: 'Paid',      bg: 'rgb(240, 253, 244)', color: 'rgb(21, 91, 48)',   border: 'rgb(187, 247, 208)' },
  FAILED:   { label: 'Failed',    bg: 'rgb(254, 242, 242)', color: 'rgb(185, 28, 28)',  border: 'rgb(254, 202, 202)' },
  REFUNDED: { label: 'Refunded',  bg: 'rgb(248, 249, 251)', color: 'rgb(75, 85, 99)',   border: 'rgb(220, 223, 230)' },
};

function StatusBadge({ config }: { config: { label: string; bg: string; color: string; border: string } }) {
  return (
    <span
      className="text-xs font-bold px-2.5 py-1"
      style={{
        borderRadius: '4px',
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
      }}
    >
      {config.label}
    </span>
  );
}

function OrdersPage() {
  const [page, setPage] = useState(1);
  const { data: ordersData, isLoading, error } = useGetUserOrdersQuery({ page, limit: 10 });

  const orders = ordersData?.data?.orders || [];
  const pagination = ordersData?.data?.pagination;

  useEffect(() => {
    if (error) toast.error('Failed to load orders');
  }, [error]);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col" style={{ backgroundColor: 'rgb(246, 247, 249)' }}>
        <Header />
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-10 h-10 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgb(185, 28, 28)', borderTopColor: 'transparent' }}
            />
            <p className="text-sm font-medium" style={{ color: 'rgb(110, 118, 135)' }}>
              Loading your orders...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Empty ── */
  if (orders.length === 0) {
    return (
      <div className="relative flex min-h-screen w-full flex-col" style={{ backgroundColor: 'rgb(246, 247, 249)' }}>
        <Header />
        <div className="flex-1 flex items-center justify-center py-24 px-4">
          <div
            className="flex flex-col items-center text-center p-10"
            style={{
              backgroundColor: 'rgb(255, 255, 255)',
              border: '1px solid rgb(220, 223, 230)',
              borderRadius: '6px',
              maxWidth: '420px',
              width: '100%',
            }}
          >
            <div
              className="w-16 h-16 flex items-center justify-center mb-4"
              style={{ borderRadius: '8px', backgroundColor: 'rgb(254, 242, 242)', border: '1px solid rgb(254, 202, 202)' }}
            >
              <ShoppingBag className="w-7 h-7" style={{ color: 'rgb(185, 28, 28)' }} />
            </div>
            <h2 className="text-lg font-bold mb-1" style={{ color: 'rgb(15, 20, 35)' }}>No orders yet</h2>
            <p className="text-sm mb-6" style={{ color: 'rgb(110, 118, 135)' }}>
              Start shopping to see your orders here
            </p>
            <Link href="/products">
              <button
                className="flex items-center gap-2 text-sm font-bold px-6 py-2.5 transition-colors"
                style={{ borderRadius: '6px', backgroundColor: 'rgb(185, 28, 28)', color: 'rgb(255, 255, 255)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
              >
                Browse Products
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col" style={{ backgroundColor: 'rgb(246, 247, 249)' }}>
      <Header />

      <main className="flex-1">
        <section className="px-4 md:px-6 py-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* ── Breadcrumb ── */}
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgb(150, 158, 175)' }}>
              <Link href="/">
                <span
                  className="transition-colors cursor-pointer"
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgb(150, 158, 175)')}
                >
                  Home
                </span>
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="font-semibold" style={{ color: 'rgb(55, 65, 81)' }}>My Orders</span>
            </div>

            {/* ── Page Title ── */}
            <div
              className="flex items-center justify-between pb-5"
              style={{ borderBottom: '1px solid rgb(220, 223, 230)' }}
            >
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'rgb(15, 20, 35)' }}>
                  My Orders
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
                  {pagination?.totalOrders || orders.length} order{(pagination?.totalOrders || orders.length) !== 1 ? 's' : ''} found
                </p>
              </div>
              <Link href="/products">
                <button
                  className="hidden md:flex items-center gap-1.5 text-sm font-bold transition-colors"
                  style={{ color: 'rgb(185, 28, 28)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgb(153, 27, 27)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
                >
                  Continue Shopping
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </Link>
            </div>

            {/* ── Orders List ── */}
            <div className="space-y-4">
              {orders.map((order: any) => {
                if (!order || !order._id) return null;

                const orderStatus = orderStatusConfig[order.status] || orderStatusConfig['PENDING'];
                const paymentStatus = paymentStatusConfig[order.paymentStatus] || paymentStatusConfig['PENDING'];
                const previewItems = order.items?.slice(0, 3) || [];
                const remainingItems = (order.items?.length || 0) - 3;

                return (
                  <div
                    key={order._id}
                    className="overflow-hidden transition-shadow"
                    style={{
                      backgroundColor: 'rgb(255, 255, 255)',
                      border: '1px solid rgb(220, 223, 230)',
                      borderRadius: '6px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)')}
                  >
                    {/* ── Order Header ── */}
                    <div
                      className="flex items-center justify-between px-5 py-3 flex-wrap gap-2"
                      style={{
                        borderBottom: '1px solid rgb(240, 242, 245)',
                        backgroundColor: 'rgb(248, 249, 251)',
                      }}
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5" style={{ color: 'rgb(185, 28, 28)' }} />
                          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgb(110, 118, 135)' }}>
                            Order
                          </span>
                          <span className="text-xs font-extrabold" style={{ color: 'rgb(15, 20, 35)' }}>
                            #{order.orderNumber || 'N/A'}
                          </span>
                        </div>
                        <div
                          style={{ width: '1px', height: '14px', backgroundColor: 'rgb(220, 223, 230)' }}
                          className="hidden md:block"
                        />
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" style={{ color: 'rgb(150, 158, 175)' }} />
                          <span className="text-xs" style={{ color: 'rgb(110, 118, 135)' }}>
                            {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2">
                        <StatusBadge config={orderStatus} />
                        <StatusBadge config={paymentStatus} />
                      </div>
                    </div>

                    {/* ── Order Body ── */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap">

                        {/* Items Preview */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgb(150, 158, 175)' }}>
                            {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'Item' : 'Items'}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {previewItems.map((item: any, index: number) => {
                              const product = item.productId || item.product;
                              const image = item.image || product?.images?.[0] || '/placeholder.png';
                              return (
                                <div
                                  key={index}
                                  className="relative shrink-0 overflow-hidden"
                                  style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '4px',
                                    border: '1px solid rgb(220, 223, 230)',
                                    backgroundColor: 'rgb(243, 244, 246)',
                                  }}
                                  title={item.name || product?.name || 'Product'}
                                >
                                  <Image src={image} alt={item.name || 'Product'} fill className="object-cover" />
                                </div>
                              );
                            })}
                            {remainingItems > 0 && (
                              <div
                                className="shrink-0 flex items-center justify-center w-14 h-14 text-xs font-bold"
                                style={{
                                  borderRadius: '4px',
                                  border: '1px dashed rgb(220, 223, 230)',
                                  backgroundColor: 'rgb(248, 249, 251)',
                                  color: 'rgb(110, 118, 135)',
                                }}
                              >
                                +{remainingItems}
                              </div>
                            )}
                          </div>

                          {/* Item names */}
                          <p
                            className="text-xs mt-2 line-clamp-1"
                            style={{ color: 'rgb(110, 118, 135)' }}
                          >
                            {order.items?.map((item: any) => item.name || item.productId?.name).join(', ')}
                          </p>
                        </div>

                        {/* Divider (desktop) */}
                        <div
                          className="hidden md:block w-px self-stretch"
                          style={{ backgroundColor: 'rgb(240, 242, 245)' }}
                        />

                        {/* Order Total + CTA */}
                        <div className="flex flex-col items-end gap-3 shrink-0">
                          <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgb(150, 158, 175)' }}>
                              Total Amount
                            </p>
                            <p className="text-2xl font-extrabold mt-0.5" style={{ color: 'rgb(185, 28, 28)' }}>
                              ₹{(order.total || 0).toFixed(2)}
                            </p>
                            {order.discount > 0 && (
                              <p className="text-xs mt-0.5" style={{ color: 'rgb(21, 91, 48)' }}>
                                Saved ₹{order.discount.toFixed(2)}
                              </p>
                            )}
                          </div>

                          <Link href={`/orders/${order._id}`}>
                            <button
                              className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 transition-colors"
                              style={{
                                borderRadius: '4px',
                                border: '1px solid rgb(185, 28, 28)',
                                backgroundColor: 'rgb(255, 255, 255)',
                                color: 'rgb(185, 28, 28)',
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)'
                                e.currentTarget.style.color = 'rgb(255, 255, 255)'
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)'
                                e.currentTarget.style.color = 'rgb(185, 28, 28)'
                              }}
                            >
                              View Details
                              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* ── Delivery Address Strip ── */}
                    {order.shippingAddress && (
                      <div
                        className="px-5 py-2.5 flex items-center gap-2"
                        style={{ borderTop: '1px solid rgb(240, 242, 245)', backgroundColor: 'rgb(248, 249, 251)' }}
                      >
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgb(150, 158, 175)' }}>
                          Deliver to:
                        </span>
                        <span className="text-xs line-clamp-1" style={{ color: 'rgb(75, 85, 99)' }}>
                          {order.shippingAddress.fullName} — {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Pagination ── */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 text-sm font-bold px-3 py-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    borderRadius: '4px',
                    border: '1px solid rgb(220, 223, 230)',
                    backgroundColor: 'rgb(255, 255, 255)',
                    color: 'rgb(75, 85, 99)',
                  }}
                  onMouseEnter={e => { if (page > 1) e.currentTarget.style.borderColor = 'rgb(185, 28, 28)' }}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className="text-sm font-bold px-3.5 py-2 transition-colors"
                    style={{
                      borderRadius: '4px',
                      border: pageNum === page ? '1px solid rgb(185, 28, 28)' : '1px solid rgb(220, 223, 230)',
                      backgroundColor: pageNum === page ? 'rgb(185, 28, 28)' : 'rgb(255, 255, 255)',
                      color: pageNum === page ? 'rgb(255, 255, 255)' : 'rgb(75, 85, 99)',
                      minWidth: '38px',
                    }}
                    onMouseEnter={e => { if (pageNum !== page) e.currentTarget.style.borderColor = 'rgb(185, 28, 28)' }}
                    onMouseLeave={e => { if (pageNum !== page) e.currentTarget.style.borderColor = 'rgb(220, 223, 230)' }}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="flex items-center gap-1 text-sm font-bold px-3 py-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    borderRadius: '4px',
                    border: '1px solid rgb(220, 223, 230)',
                    backgroundColor: 'rgb(255, 255, 255)',
                    color: 'rgb(75, 85, 99)',
                  }}
                  onMouseEnter={e => { if (page < pagination.totalPages) e.currentTarget.style.borderColor = 'rgb(185, 28, 28)' }}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                >
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            )}

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function ProtectedOrdersPage() {
  return (
    <UserProtectedRoute>
      <OrdersPage />
    </UserProtectedRoute>
  );
}
