"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { useGetAllOrdersQuery } from "@/lib/services/api";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

const statusStyles: Record<string, React.CSSProperties> = {
  PENDING: {
    backgroundColor: "rgb(255, 251, 235)",
    color: "rgb(161, 72, 10)",
    border: "1px solid rgb(253, 230, 138)",
  },
  CONFIRMED: {
    backgroundColor: "rgb(239, 246, 255)",
    color: "rgb(29, 78, 216)",
    border: "1px solid rgb(219, 234, 254)",
  },
  PACKED: {
    backgroundColor: "rgb(238, 242, 255)",
    color: "rgb(67, 56, 202)",
    border: "1px solid rgb(199, 210, 254)",
  },
  SHIPPED: {
    backgroundColor: "rgb(245, 243, 255)",
    color: "rgb(109, 40, 217)",
    border: "1px solid rgb(221, 214, 254)",
  },
  DELIVERED: {
    backgroundColor: "rgb(240, 253, 244)",
    color: "rgb(21, 91, 48)",
    border: "1px solid rgb(187, 247, 208)",
  },
  CANCELLED: {
    backgroundColor: "rgb(254, 242, 242)",
    color: "rgb(185, 28, 28)",
    border: "1px solid rgb(254, 202, 202)",
  },
  RETURN_REQUESTED: {
    backgroundColor: "rgb(255, 247, 237)",
    color: "rgb(154, 52, 18)",
    border: "1px solid rgb(254, 215, 170)",
  },
  RETURNED: {
    backgroundColor: "rgb(243, 244, 246)",
    color: "rgb(55, 65, 81)",
    border: "1px solid rgb(209, 213, 219)",
  },
  REFUNDED: {
    backgroundColor: "rgb(240, 253, 244)",
    color: "rgb(22, 101, 52)",
    border: "1px solid rgb(134, 239, 172)",
  },
};

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data: ordersData, isLoading, error } = useGetAllOrdersQuery({
    page,
    limit: 20,
    status: statusFilter && statusFilter !== "ALL" ? statusFilter : undefined,
  });

  const orders = ordersData?.data?.orders || [];
  const pagination = ordersData?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;

  useEffect(() => {
    if (error) toast.error("Failed to load orders");
  }, [error]);

  const filteredOrders = orders.filter((order: any) =>
    order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 space-y-6" style={{ backgroundColor: "rgb(246, 247, 249)" }}>

      {/* Header */}
      <div
        className="flex items-center justify-between pb-6"
        style={{ borderBottom: "1px solid rgb(220, 223, 230)" }}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "rgb(15, 20, 35)" }}>
            Orders
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "rgb(110, 118, 135)" }}>
            Manage and track all customer orders
          </p>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">

        {/* Search */}
        <div
          className="flex flex-1 items-center gap-3 px-4 py-3 rounded-md"
          style={{
            backgroundColor: "rgb(255, 255, 255)",
            border: "1px solid rgb(220, 223, 230)",
          }}
        >
          <Search
            className="w-4 h-4 shrink-0 stroke-[2.5]"
            style={{ color: "rgb(185, 28, 28)" }}
          />
          <input
            type="text"
            placeholder="Search by order number, name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: "rgb(30, 35, 50)" }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-semibold transition-colors"
              style={{ color: "rgb(156, 163, 175)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgb(75, 85, 99)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgb(156, 163, 175)")}
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          className="text-sm outline-none"
          style={{
            height: "46px",
            padding: "0 12px",
            borderRadius: "6px",
            border: "1px solid rgb(220, 223, 230)",
            backgroundColor: "rgb(255, 255, 255)",
            color: statusFilter && statusFilter !== "ALL" ? "rgb(15, 20, 35)" : "rgb(110, 118, 135)",
            fontWeight: 500,
            minWidth: "180px",
          }}
        >
          <option value="">All Orders</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PACKED">Packed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="RETURN_REQUESTED">Return Requested</option>
          <option value="RETURNED">Returned</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      {/* Table */}
      <div
        className="rounded-md overflow-hidden"
        style={{
          backgroundColor: "rgb(255, 255, 255)",
          border: "1px solid rgb(220, 223, 230)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid rgb(220, 223, 230)",
                  backgroundColor: "rgb(248, 249, 251)",
                }}
              >
                {["#", "Order", "Customer", "Date", "Items", "Total", "Status", ""].map((h, i) => (
                  <th
                    key={i}
                    className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider ${i === 7 ? "text-right" : "text-left"}`}
                    style={{ color: "rgb(100, 108, 125)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-sm"
                    style={{ color: "rgb(156, 163, 175)" }}
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-sm"
                    style={{ color: "rgb(156, 163, 175)" }}
                  >
                    {searchQuery || statusFilter
                      ? "No orders match your filters"
                      : "No orders yet"}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order: any, index: number) => (
                  <tr
                    key={order._id}
                    style={{
                      borderBottom:
                        index < filteredOrders.length - 1
                          ? "1px solid rgb(240, 242, 245)"
                          : "none",
                    }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.backgroundColor = "rgb(252, 252, 253)")
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    {/* # */}
                    <td
                      className="px-5 py-4 text-xs font-bold"
                      style={{ color: "rgb(185, 28, 28)" }}
                    >
                      {(page - 1) * 20 + index + 1}
                    </td>

                    {/* Order Number */}
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-bold px-2.5 py-1"
                        style={{
                          borderRadius: "4px",
                          backgroundColor: "rgb(248, 249, 251)",
                          color: "rgb(15, 20, 35)",
                          border: "1px solid rgb(220, 223, 230)",
                        }}
                      >
                        #{order.orderNumber}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-sm" style={{ color: "rgb(15, 20, 35)" }}>
                        {order.userId?.name || "—"}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "rgb(150, 158, 175)" }}>
                        {order.userId?.email || "—"}
                      </p>
                    </td>

                    {/* Date */}
                    <td
                      className="px-5 py-4 text-sm"
                      style={{ color: "rgb(110, 118, 135)" }}
                    >
                      {formatDateTime(order.createdAt)}
                    </td>

                    {/* Items */}
                    <td
                      className="px-5 py-4 text-sm font-semibold"
                      style={{ color: "rgb(55, 65, 81)" }}
                    >
                      {order.items?.length ?? 0}
                    </td>

                    {/* Total */}
                    <td
                      className="px-5 py-4 text-sm font-bold"
                      style={{ color: "rgb(15, 20, 35)" }}
                    >
                      ₹{order.total?.toFixed(2) ?? "0.00"}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-bold px-2.5 py-1"
                        style={{
                          borderRadius: "4px",
                          ...(statusStyles[order.status] || {
                            backgroundColor: "rgb(243, 244, 246)",
                            color: "rgb(55, 65, 81)",
                            border: "1px solid rgb(220, 223, 230)",
                          }),
                        }}
                      >
                        {order.status?.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      <Link href={`/admin/orders/${order._id}`}>
                        <button
                          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 transition-colors ml-auto"
                          style={{
                            borderRadius: "4px",
                            border: "1px solid rgb(220, 223, 230)",
                            backgroundColor: "rgb(255, 255, 255)",
                            color: "rgb(55, 65, 81)",
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = "rgb(185, 28, 28)"
                            e.currentTarget.style.color = "rgb(255, 255, 255)"
                            e.currentTarget.style.borderColor = "rgb(185, 28, 28)"
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = "rgb(255, 255, 255)"
                            e.currentTarget.style.color = "rgb(55, 65, 81)"
                            e.currentTarget.style.borderColor = "rgb(220, 223, 230)"
                          }}
                        >
                          View
                          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{
              borderTop: "1px solid rgb(240, 242, 245)",
              backgroundColor: "rgb(248, 249, 251)",
            }}
          >
            <p className="text-xs" style={{ color: "rgb(150, 158, 175)" }}>
              Page{" "}
              <span className="font-bold" style={{ color: "rgb(30, 35, 50)" }}>
                {page}
              </span>{" "}
              of{" "}
              <span className="font-bold" style={{ color: "rgb(30, 35, 50)" }}>
                {totalPages}
              </span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="text-xs font-bold px-3 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  borderRadius: "4px",
                  border: "1px solid rgb(220, 223, 230)",
                  color: "rgb(30, 35, 50)",
                  backgroundColor: "rgb(255, 255, 255)",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgb(243, 244, 246)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgb(255, 255, 255)")}
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="text-xs font-bold px-3 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  borderRadius: "4px",
                  border: "1px solid rgb(220, 223, 230)",
                  color: "rgb(30, 35, 50)",
                  backgroundColor: "rgb(255, 255, 255)",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgb(243, 244, 246)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgb(255, 255, 255)")}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
