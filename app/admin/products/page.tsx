"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Search, AlertTriangle } from "lucide-react"
import { useGetProductsQuery, useDeleteProductMutation } from "@/lib/services/api"
import { toast } from "sonner"

export default function AdminProductsPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useGetProductsQuery({ page, limit: 10, search })
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    productId: string
    productName: string
  }>({ open: false, productId: "", productName: "" })

  const openConfirm = (id: string, name: string) => {
    setConfirmDialog({ open: true, productId: id, productName: name })
  }

  const closeConfirm = () => {
    setConfirmDialog({ open: false, productId: "", productName: "" })
  }

  const handleDelete = async () => {
    try {
      await deleteProduct(confirmDialog.productId).unwrap()
      toast.success("Product deleted successfully")
      closeConfirm()
    } catch {
      toast.error("Failed to delete product")
      closeConfirm()
    }
  }

  const products = data?.data?.products || []
  const pagination = data?.data?.pagination || data?.pagination

  return (
    <div className="min-h-screen p-8 space-y-6" style={{ backgroundColor: "rgb(246, 247, 249)" }}>

      {/* ── Confirm Delete Dialog ── */}
      {confirmDialog.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.35)" }}
          onClick={closeConfirm}
        >
          <div
            className="w-full max-w-sm mx-4"
            style={{
              backgroundColor: "rgb(255, 255, 255)",
              borderRadius: "8px",
              border: "1px solid rgb(220, 223, 230)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Dialog Header */}
            <div
              className="flex items-start gap-3 p-5"
              style={{ borderBottom: "1px solid rgb(240, 242, 245)" }}
            >
              <div
                className="flex items-center justify-center w-9 h-9 shrink-0"
                style={{
                  borderRadius: "6px",
                  backgroundColor: "rgb(254, 242, 242)",
                  border: "1px solid rgb(254, 202, 202)",
                }}
              >
                <AlertTriangle
                  className="w-4 h-4"
                  style={{ color: "rgb(185, 28, 28)", strokeWidth: 2.5 }}
                />
              </div>
              <div>
                <p
                  className="text-sm font-bold"
                  style={{ color: "rgb(15, 20, 35)" }}
                >
                  Delete Product
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "rgb(110, 118, 135)" }}
                >
                  This action cannot be undone
                </p>
              </div>
            </div>

            {/* Dialog Body */}
            <div className="px-5 py-4">
              <p className="text-sm" style={{ color: "rgb(55, 65, 81)" }}>
                Are you sure you want to delete{" "}
                <span className="font-bold" style={{ color: "rgb(15, 20, 35)" }}>
                  "{confirmDialog.productName}"
                </span>
                ? This will permanently remove the product from your inventory.
              </p>
            </div>

            {/* Dialog Footer */}
            <div
              className="flex items-center justify-end gap-2 px-5 py-4"
              style={{ borderTop: "1px solid rgb(240, 242, 245)", backgroundColor: "rgb(248, 249, 251)", borderRadius: "0 0 8px 8px" }}
            >
              <button
                onClick={closeConfirm}
                disabled={isDeleting}
                className="text-xs font-semibold px-4 py-2 transition-colors disabled:opacity-50"
                style={{
                  borderRadius: "6px",
                  border: "1px solid rgb(220, 223, 230)",
                  backgroundColor: "rgb(255, 255, 255)",
                  color: "rgb(55, 65, 81)",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgb(246, 247, 249)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgb(255, 255, 255)")}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs font-bold px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderRadius: "6px",
                  backgroundColor: "rgb(185, 28, 28)",
                  color: "rgb(255, 255, 255)",
                }}
                onMouseEnter={e => {
                  if (!isDeleting) e.currentTarget.style.backgroundColor = "rgb(153, 27, 27)"
                }}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgb(185, 28, 28)")}
              >
                {isDeleting ? "Deleting..." : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div
        className="flex items-center justify-between pb-6"
        style={{ borderBottom: "1px solid rgb(220, 223, 230)" }}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "rgb(15, 20, 35)" }}>
            Products
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "rgb(110, 118, 135)" }}>
            Manage your product inventory
          </p>
        </div>
        <Link href="/admin/products/create">
          <button
            className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-md transition-all"
            style={{ backgroundColor: "rgb(185, 28, 28)", color: "rgb(255, 255, 255)" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgb(153, 27, 27)")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgb(185, 28, 28)")}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Add Product
          </button>
        </Link>
      </div>

      {/* Search Bar */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-md"
        style={{
          backgroundColor: "rgb(255, 255, 255)",
          border: "1px solid rgb(220, 223, 230)",
        }}
      >
        <Search className="w-4 h-4 shrink-0 stroke-[2.5]" style={{ color: "rgb(185, 28, 28)" }} />
        <input
          type="text"
          placeholder="Search products by name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 text-sm outline-none bg-transparent"
          style={{ color: "rgb(30, 35, 50)" }}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-xs font-semibold transition-colors"
            style={{ color: "rgb(156, 163, 175)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgb(75, 85, 99)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgb(156, 163, 175)")}
          >
            Clear
          </button>
        )}
      </div>

      {/* Products Table */}
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
                <th
                  className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider"
                  style={{ color: "rgb(100, 108, 125)" }}
                >
                  #
                </th>
                <th
                  className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider"
                  style={{ color: "rgb(100, 108, 125)" }}
                >
                  Product
                </th>
                <th
                  className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider"
                  style={{ color: "rgb(100, 108, 125)" }}
                >
                  Category
                </th>
                <th
                  className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider"
                  style={{ color: "rgb(100, 108, 125)" }}
                >
                  Price
                </th>
                <th
                  className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider"
                  style={{ color: "rgb(100, 108, 125)" }}
                >
                  Stock
                </th>
                <th
                  className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider"
                  style={{ color: "rgb(100, 108, 125)" }}
                >
                  Created
                </th>
                <th
                  className="text-right px-5 py-3.5 text-xs font-bold uppercase tracking-wider"
                  style={{ color: "rgb(100, 108, 125)" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm"
                    style={{ color: "rgb(156, 163, 175)" }}
                  >
                    Loading products...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm"
                    style={{ color: "rgb(185, 28, 28)" }}
                  >
                    Failed to load products. Please try again.
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm"
                    style={{ color: "rgb(156, 163, 175)" }}
                  >
                    {search ? `No products found for "${search}"` : "No products yet."}
                  </td>
                </tr>
              ) : (
                products.map((product: any, index: number) => (
                  <tr
                    key={product._id}
                    className="transition-colors"
                    style={{
                      borderBottom:
                        index < products.length - 1
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
                    {/* Row Number */}
                    <td
                      className="px-5 py-4 text-xs font-bold"
                      style={{ color: "rgb(185, 28, 28)" }}
                    >
                      {(page - 1) * 10 + index + 1}
                    </td>

                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] || product.productImage ? (
                          <img
                            src={product.images?.[0] || product.productImage}
                            alt={product.name}
                            className="w-9 h-9 object-cover shrink-0"
                            style={{
                              borderRadius: "4px",
                              border: "1px solid rgb(220, 223, 230)",
                            }}
                          />
                        ) : (
                          <div
                            className="w-9 h-9 shrink-0"
                            style={{
                              borderRadius: "4px",
                              backgroundColor: "rgb(243, 244, 246)",
                              border: "1px solid rgb(220, 223, 230)",
                            }}
                          />
                        )}
                        <div className="min-w-0">
                          <p
                            className="font-semibold truncate max-w-[180px]"
                            style={{ color: "rgb(15, 20, 35)" }}
                          >
                            {product.name}
                          </p>
                          <p
                            className="text-xs truncate max-w-[180px] mt-0.5"
                            style={{ color: "rgb(156, 163, 175)" }}
                          >
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-bold px-2.5 py-1"
                        style={{
                          borderRadius: "4px",
                          backgroundColor: "rgb(239, 246, 255)",
                          color: "rgb(29, 78, 216)",
                          border: "1px solid rgb(219, 234, 254)",
                        }}
                      >
                        {product.category?.name || product.category || "—"}
                      </span>
                    </td>

                    {/* Price */}
                    <td
                      className="px-5 py-4 font-bold"
                      style={{ color: "rgb(15, 20, 35)" }}
                    >
                      ₹{(product.price ?? 0).toFixed(2)}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-bold px-2.5 py-1"
                        style={
                          product.stock === 0
                            ? {
                                borderRadius: "4px",
                                backgroundColor: "rgb(254, 242, 242)",
                                color: "rgb(185, 28, 28)",
                                border: "1px solid rgb(254, 202, 202)",
                              }
                            : product.stock <= 10
                            ? {
                                borderRadius: "4px",
                                backgroundColor: "rgb(255, 251, 235)",
                                color: "rgb(161, 72, 10)",
                                border: "1px solid rgb(253, 230, 138)",
                              }
                            : {
                                borderRadius: "4px",
                                backgroundColor: "rgb(240, 253, 244)",
                                color: "rgb(21, 91, 48)",
                                border: "1px solid rgb(187, 247, 208)",
                              }
                        }
                      >
                        {product.stock === 0
                          ? "Out of Stock"
                          : product.stock <= 10
                          ? `Low — ${product.stock}`
                          : product.stock}
                      </span>
                    </td>

                    {/* Created */}
                    <td
                      className="px-5 py-4 text-sm"
                      style={{ color: "rgb(150, 158, 175)" }}
                    >
                      {new Date(product.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit */}
                        <button
                          onClick={() => router.push(`/admin/products/${product._id}`)}
                          className="p-1.5 transition-colors"
                          style={{ borderRadius: "4px", color: "rgb(100, 108, 125)" }}
                          onMouseEnter={e => {
                            e.currentTarget.style.color = "rgb(29, 78, 216)"
                            e.currentTarget.style.backgroundColor = "rgb(239, 246, 255)"
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.color = "rgb(100, 108, 125)"
                            e.currentTarget.style.backgroundColor = "transparent"
                          }}
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4 stroke-[2.5]" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => openConfirm(product._id, product.name)}
                          disabled={isDeleting}
                          className="p-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{ borderRadius: "4px", color: "rgb(150, 158, 175)" }}
                          onMouseEnter={e => {
                            e.currentTarget.style.color = "rgb(185, 28, 28)"
                            e.currentTarget.style.backgroundColor = "rgb(254, 242, 242)"
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.color = "rgb(150, 158, 175)"
                            e.currentTarget.style.backgroundColor = "transparent"
                          }}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{
              borderTop: "1px solid rgb(240, 242, 245)",
              backgroundColor: "rgb(248, 249, 251)",
            }}
          >
            <p className="text-xs" style={{ color: "rgb(150, 158, 175)" }}>
              Showing{" "}
              <span className="font-bold" style={{ color: "rgb(30, 35, 50)" }}>
                {(page - 1) * pagination.limit + 1}–
                {Math.min(page * pagination.limit, pagination.total)}
              </span>{" "}
              of{" "}
              <span className="font-bold" style={{ color: "rgb(30, 35, 50)" }}>
                {pagination.total}
              </span>{" "}
              products
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
                onMouseEnter={e =>
                  (e.currentTarget.style.backgroundColor = "rgb(243, 244, 246)")
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.backgroundColor = "rgb(255, 255, 255)")
                }
              >
                ← Prev
              </button>
              <span
                className="text-xs font-bold px-2"
                style={{ color: "rgb(100, 108, 125)" }}
              >
                {page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.totalPages}
                className="text-xs font-bold px-3 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  borderRadius: "4px",
                  border: "1px solid rgb(220, 223, 230)",
                  color: "rgb(30, 35, 50)",
                  backgroundColor: "rgb(255, 255, 255)",
                }}
                onMouseEnter={e =>
                  (e.currentTarget.style.backgroundColor = "rgb(243, 244, 246)")
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.backgroundColor = "rgb(255, 255, 255)")
                }
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
