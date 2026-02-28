"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Package, MapPin, CreditCard,
  User, Phone, Mail, Truck, Clock,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from "@/lib/services/api";
import { toast } from "sonner";

const statusStyles: Record<string, React.CSSProperties> = {
  PENDING: { backgroundColor: "rgb(255, 251, 235)", color: "rgb(161, 72, 10)", border: "1px solid rgb(253, 230, 138)" },
  CONFIRMED: { backgroundColor: "rgb(239, 246, 255)", color: "rgb(29, 78, 216)", border: "1px solid rgb(219, 234, 254)" },
  PACKED: { backgroundColor: "rgb(238, 242, 255)", color: "rgb(67, 56, 202)", border: "1px solid rgb(199, 210, 254)" },
  SHIPPED: { backgroundColor: "rgb(245, 243, 255)", color: "rgb(109, 40, 217)", border: "1px solid rgb(221, 214, 254)" },
  DELIVERED: { backgroundColor: "rgb(240, 253, 244)", color: "rgb(21, 91, 48)", border: "1px solid rgb(187, 247, 208)" },
  CANCELLED: { backgroundColor: "rgb(254, 242, 242)", color: "rgb(185, 28, 28)", border: "1px solid rgb(254, 202, 202)" },
  RETURN_REQUESTED: { backgroundColor: "rgb(255, 247, 237)", color: "rgb(154, 52, 18)", border: "1px solid rgb(254, 215, 170)" },
  RETURNED: { backgroundColor: "rgb(243, 244, 246)", color: "rgb(55, 65, 81)", border: "1px solid rgb(209, 213, 219)" },
  REFUNDED: { backgroundColor: "rgb(240, 253, 244)", color: "rgb(22, 101, 52)", border: "1px solid rgb(134, 239, 172)" },
}

const paymentStatusStyle = (status: string): React.CSSProperties => {
  if (status === "COMPLETED") return { color: "rgb(21, 91, 48)", fontWeight: 700 }
  if (status === "FAILED") return { color: "rgb(185, 28, 28)", fontWeight: 700 }
  return { color: "rgb(161, 72, 10)", fontWeight: 700 }
}

const statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PACKED", label: "Packed" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "RETURN_REQUESTED", label: "Return Requested" },
  { value: "RETURNED", label: "Returned" },
  { value: "REFUNDED", label: "Refunded" },
]

/* ── shared card style ── */
const card: React.CSSProperties = {
  backgroundColor: "rgb(255, 255, 255)",
  border: "1px solid rgb(220, 223, 230)",
  borderRadius: "8px",
  overflow: "hidden",
}

const sectionHeader = (icon: React.ReactNode, title: string) => (
  <div
    className="flex items-center gap-2 px-5 py-4"
    style={{ borderBottom: "1px solid rgb(240, 242, 245)", backgroundColor: "rgb(248, 249, 251)" }}
  >
    <span style={{ color: "rgb(185, 28, 28)" }}>{icon}</span>
    <p className="text-sm font-bold" style={{ color: "rgb(15, 20, 35)" }}>{title}</p>
  </div>
)

const labelStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "rgb(150, 158, 175)",
  marginBottom: "3px",
}

const valueStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  color: "rgb(15, 20, 35)",
}

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const { data: orderData, isLoading, error } = useGetOrderByIdQuery(orderId)
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation()

  const [selectedStatus, setSelectedStatus] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")

  const order = orderData?.data

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status)
      setTrackingNumber(order.trackingNumber || "")
    }
  }, [order])

  useEffect(() => {
    if (error) toast.error("Failed to load order details")
  }, [error])

  const handleUpdateStatus = async () => {
    try {
      await updateOrderStatus({
        id: orderId,
        status: selectedStatus,
        trackingNumber: trackingNumber || undefined,
      }).unwrap()
      toast.success("Order status updated successfully")
    } catch {
      toast.error("Failed to update order status")
    }
  }

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "rgb(246, 247, 249)" }}>
        <p style={{ fontSize: "14px", color: "rgb(110, 118, 135)" }}>Loading order...</p>
      </div>
    )
  }

  /* ── Not found ── */
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "rgb(246, 247, 249)" }}>
        <p style={{ fontSize: "14px", color: "rgb(185, 28, 28)" }}>Order not found</p>
      </div>
    )
  }

  const inputBase: React.CSSProperties = {
    width: "100%",
    height: "38px",
    padding: "0 12px",
    fontSize: "13px",
    borderRadius: "6px",
    border: "1px solid rgb(220, 223, 230)",
    backgroundColor: "rgb(255, 255, 255)",
    color: "rgb(15, 20, 35)",
    outline: "none",
  }

  return (
    <div className="min-h-screen p-8 space-y-6" style={{ backgroundColor: "rgb(246, 247, 249)" }}>

      {/* Header */}
      <div
        className="flex items-center justify-between pb-6"
        style={{ borderBottom: "1px solid rgb(220, 223, 230)" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-8 h-8 transition-colors"
            style={{
              borderRadius: "6px",
              border: "1px solid rgb(220, 223, 230)",
              backgroundColor: "rgb(255, 255, 255)",
              color: "rgb(100, 108, 125)",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgb(246, 247, 249)")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgb(255, 255, 255)")}
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "rgb(15, 20, 35)" }}>
              Order #{order.orderNumber}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "rgb(110, 118, 135)" }}>
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Current Status Badge */}
        <span
          className="text-xs font-bold px-3 py-1.5"
          style={{ borderRadius: "4px", ...(statusStyles[order.status] || {}) }}
        >
          {order.status.replace(/_/g, " ")}
        </span>
      </div>

      {/* Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left (2/3) ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Update Status */}
          <div style={card}>
            {sectionHeader(<Package className="w-4 h-4 stroke-[2.5]" />, "Update Order Status")}
            <div className="p-5 space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p style={labelStyle}>Current Status</p>
                  <span
                    className="text-xs font-bold px-2.5 py-1 inline-flex"
                    style={{ borderRadius: "4px", ...(statusStyles[order.status] || {}) }}
                  >
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div>
                  <p style={labelStyle}>Update To</p>
                  <select
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value)}
                    style={inputBase}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedStatus === "SHIPPED" && (
                <div>
                  <p style={labelStyle}>Tracking Number (Optional)</p>
                  <input
                    value={trackingNumber}
                    onChange={e => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    style={{ ...inputBase, marginTop: "4px" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgb(100, 108, 125)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgb(220, 223, 230)")}
                  />
                </div>
              )}

              <button
                onClick={handleUpdateStatus}
                disabled={isUpdating || selectedStatus === order.status}
                className="text-sm font-bold px-5 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderRadius: "6px", backgroundColor: "rgb(185, 28, 28)", color: "rgb(255, 255, 255)" }}
                onMouseEnter={e => { if (!isUpdating) e.currentTarget.style.backgroundColor = "rgb(153, 27, 27)" }}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgb(185, 28, 28)")}
              >
                {isUpdating ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>

          {/* Order Items */}
          <div style={card}>
            {sectionHeader(<Package className="w-4 h-4 stroke-[2.5]" />, "Order Items")}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgb(220, 223, 230)", backgroundColor: "rgb(248, 249, 251)" }}>
                    {["Product", "Price", "Qty", "Total"].map((h, i) => (
                      <th
                        key={h}
                        className={`px-5 py-3 text-xs font-bold uppercase tracking-wider ${i === 3 ? "text-right" : "text-left"}`}
                        style={{ color: "rgb(100, 108, 125)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item: any, index: number) => (
                    <tr
                      key={index}
                      style={{ borderBottom: index < order.items.length - 1 ? "1px solid rgb(240, 242, 245)" : "none" }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgb(252, 252, 253)")}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {item.image || item.productId?.images?.[0] ? (
                            <img
                              src={item.image || item.productId.images[0]}
                              alt={item.name}
                              className="w-10 h-10 object-cover shrink-0"
                              style={{ borderRadius: "4px", border: "1px solid rgb(220, 223, 230)" }}
                            />
                          ) : (
                            <div
                              className="w-10 h-10 shrink-0 flex items-center justify-center"
                              style={{ borderRadius: "4px", backgroundColor: "rgb(243, 244, 246)", border: "1px solid rgb(220, 223, 230)" }}
                            >
                              <Package className="w-4 h-4" style={{ color: "rgb(156, 163, 175)" }} />
                            </div>
                          )}
                          <span className="font-semibold" style={{ color: "rgb(15, 20, 35)" }}>{item.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: "rgb(55, 65, 81)" }}>
                        ₹{item.price.toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="text-xs font-bold px-2.5 py-1"
                          style={{ borderRadius: "4px", backgroundColor: "rgb(243, 244, 246)", color: "rgb(55, 65, 81)", border: "1px solid rgb(220, 223, 230)" }}
                        >
                          ×{item.quantity}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-bold" style={{ color: "rgb(15, 20, 35)" }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div
              className="px-5 py-4 space-y-2"
              style={{ borderTop: "1px solid rgb(220, 223, 230)", backgroundColor: "rgb(248, 249, 251)" }}
            >
              {[
                { label: "Subtotal", value: `₹${order.subtotal.toFixed(2)}` },
                ...(order.discount > 0 ? [{ label: "Discount", value: `-₹${order.discount.toFixed(2)}`, red: true }] : []),
                { label: "Shipping", value: order.shippingCost === 0 ? "Free" : `₹${order.shippingCost.toFixed(2)}` },
                { label: "Tax", value: `₹${order.tax.toFixed(2)}` },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span style={{ color: "rgb(110, 118, 135)" }}>{row.label}</span>
                  <span style={{ color: (row as any).red ? "rgb(21, 91, 48)" : "rgb(55, 65, 81)", fontWeight: 500 }}>
                    {row.value}
                  </span>
                </div>
              ))}
              <div
                className="flex justify-between pt-3"
                style={{ borderTop: "1px solid rgb(220, 223, 230)" }}
              >
                <span className="text-sm font-bold" style={{ color: "rgb(15, 20, 35)" }}>Total</span>
                <span className="text-base font-bold" style={{ color: "rgb(185, 28, 28)" }}>
                  ₹{order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div style={card}>
            {sectionHeader(<MapPin className="w-4 h-4 stroke-[2.5]" />, "Shipping Address")}
            <div className="p-5 space-y-1.5">
              <p style={valueStyle}>{order.shippingAddress.fullName}</p>
              <p style={{ fontSize: "13px", color: "rgb(110, 118, 135)" }}>{order.shippingAddress.phone}</p>
              <p style={{ fontSize: "13px", color: "rgb(110, 118, 135)" }}>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p style={{ fontSize: "13px", color: "rgb(110, 118, 135)" }}>{order.shippingAddress.addressLine2}</p>
              )}
              <p style={{ fontSize: "13px", color: "rgb(110, 118, 135)" }}>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p style={{ fontSize: "13px", color: "rgb(110, 118, 135)" }}>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar (1/3) ── */}
        <div className="space-y-6">

          {/* Customer Info */}
          <div style={card}>
            {sectionHeader(<User className="w-4 h-4 stroke-[2.5]" />, "Customer")}
            <div className="p-5 space-y-3">
              {[
                { icon: <User className="w-3.5 h-3.5" />, value: order.userId?.name || "N/A" },
                { icon: <Mail className="w-3.5 h-3.5" />, value: order.userId?.email || "N/A" },
                { icon: <Phone className="w-3.5 h-3.5" />, value: order.userId?.phone || "N/A" },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span style={{ color: "rgb(185, 28, 28)" }}>{row.icon}</span>
                  <span style={{ fontSize: "13px", color: "rgb(55, 65, 81)", fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <div style={card}>
            {sectionHeader(<CreditCard className="w-4 h-4 stroke-[2.5]" />, "Payment")}
            <div className="p-5 space-y-4">
              <div>
                <p style={labelStyle}>Payment Method</p>
                <p style={valueStyle}>{order.paymentMethod.replace(/_/g, " ")}</p>
              </div>
              <div>
                <p style={labelStyle}>Payment Status</p>
                <p style={paymentStatusStyle(order.paymentStatus)}>{order.paymentStatus}</p>
              </div>
              {order.trackingNumber && (
                <div>
                  <p style={labelStyle}>Tracking Number</p>
                  <span
                    className="text-xs font-bold px-2.5 py-1 inline-flex"
                    style={{ borderRadius: "4px", backgroundColor: "rgb(239, 246, 255)", color: "rgb(29, 78, 216)", border: "1px solid rgb(219, 234, 254)" }}
                  >
                    {order.trackingNumber}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Billing Address */}
          {order.billingAddress && (
            <div style={card}>
              {sectionHeader(<MapPin className="w-4 h-4 stroke-[2.5]" />, "Billing Address")}
              <div className="p-5 space-y-1.5">
                <p style={valueStyle}>{order.billingAddress.fullName}</p>
                <p style={{ fontSize: "13px", color: "rgb(110, 118, 135)" }}>{order.billingAddress.phone}</p>
                <p style={{ fontSize: "13px", color: "rgb(110, 118, 135)" }}>{order.billingAddress.addressLine1}</p>
                {order.billingAddress.addressLine2 && (
                  <p style={{ fontSize: "13px", color: "rgb(110, 118, 135)" }}>{order.billingAddress.addressLine2}</p>
                )}
                <p style={{ fontSize: "13px", color: "rgb(110, 118, 135)" }}>
                  {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}
                </p>
                <p style={{ fontSize: "13px", color: "rgb(110, 118, 135)" }}>{order.billingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div style={card}>
            {sectionHeader(<Clock className="w-4 h-4 stroke-[2.5]" />, "Order Timeline")}
            <div className="p-5 space-y-4">
              <div>
                <p style={labelStyle}>Placed</p>
                <p style={{ fontSize: "13px", color: "rgb(55, 65, 81)", fontWeight: 500 }}>{formatDateTime(order.createdAt)}</p>
              </div>
              {order.deliveredAt && (
                <div>
                  <p style={labelStyle}>Delivered</p>
                  <p style={{ fontSize: "13px", color: "rgb(21, 91, 48)", fontWeight: 600 }}>{formatDateTime(order.deliveredAt)}</p>
                </div>
              )}
              {order.cancelledAt && (
                <div>
                  <p style={labelStyle}>Cancelled</p>
                  <p style={{ fontSize: "13px", color: "rgb(185, 28, 28)", fontWeight: 600 }}>{formatDateTime(order.cancelledAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Cancellation Reason */}
          {order.cancellationReason && (
            <div
              style={{
                ...card,
                backgroundColor: "rgb(254, 242, 242)",
                border: "1px solid rgb(254, 202, 202)",
              }}
            >
              <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: "1px solid rgb(254, 202, 202)" }}>
                <span style={{ color: "rgb(185, 28, 28)", fontSize: "13px", fontWeight: 700 }}>
                  ✕ Cancellation Reason
                </span>
              </div>
              <p className="px-5 py-4 text-sm" style={{ color: "rgb(153, 27, 27)" }}>
                {order.cancellationReason}
              </p>
            </div>
          )}

          {/* Order Notes */}
          {order.notes && (
            <div style={card}>
              {sectionHeader(<Truck className="w-4 h-4 stroke-[2.5]" />, "Order Notes")}
              <p className="px-5 py-4 text-sm" style={{ color: "rgb(110, 118, 135)" }}>
                {order.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
