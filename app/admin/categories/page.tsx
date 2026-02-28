"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FolderTree, X, AlertTriangle, Search } from "lucide-react";
import {
  useGetCategoryTreeQuery,
  useDeleteCategoryMutation,
  useCreateCategoryMutation,
} from "@/lib/services/api";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string;
  isActive: boolean;
  children?: Category[];
}

export default function AdminCategoriesPage() {
  const { data: categoriesData, isLoading, error } = useGetCategoryTreeQuery(undefined);
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", image: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    categoryId: string;
    categoryName: string;
  }>({ open: false, categoryId: "", categoryName: "" });

  const rawCategories: Category[] = categoriesData?.data || [];

  /* flatten tree for table */
  const flattenCategories = (cats: Category[], level = 0): Array<Category & { level: number }> => {
    return cats.flatMap(cat => [
      { ...cat, level },
      ...(cat.children ? flattenCategories(cat.children, level + 1) : []),
    ])
  }

  const allRows = flattenCategories(rawCategories)
  const filtered = search.trim()
    ? allRows.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : allRows

  useEffect(() => {
    if (error) toast.error("Failed to load categories");
  }, [error])

  const openConfirm = (id: string, name: string) =>
    setConfirmDialog({ open: true, categoryId: id, categoryName: name })

  const closeConfirm = () =>
    setConfirmDialog({ open: false, categoryId: "", categoryName: "" })

  const handleDelete = async () => {
    try {
      await deleteCategory(confirmDialog.categoryId).unwrap()
      toast.success("Category deleted successfully")
      closeConfirm()
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete category")
      closeConfirm()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!formData.name.trim()) errs.name = "Category name is required"
    if (Object.keys(errs).length) { setFormErrors(errs); return }

    try {
      await createCategory({
        name: formData.name,
        description: formData.description,
        image: formData.image || undefined,
        isActive: true,
      }).unwrap()
      toast.success("Category created successfully")
      setShowModal(false)
      setFormData({ name: "", description: "", image: "" })
      setFormErrors({})
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create category")
    }
  }

  /* ── shared styles ── */
  const inputBase: React.CSSProperties = {
    width: "100%",
    height: "38px",
    padding: "0 12px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid rgb(220, 223, 230)",
    backgroundColor: "rgb(255, 255, 255)",
    color: "rgb(15, 20, 35)",
    outline: "none",
    transition: "border-color 0.15s",
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "6px",
    color: "rgb(55, 65, 81)",
  }

  return (
    <div className="min-h-screen p-8 space-y-6" style={{ backgroundColor: "rgb(246, 247, 249)" }}>

      {/* ── Confirm Delete Dialog ── */}
      {confirmDialog.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
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
            {/* Header */}
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
                <AlertTriangle className="w-4 h-4" style={{ color: "rgb(185, 28, 28)", strokeWidth: 2.5 }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "rgb(15, 20, 35)" }}>
                  Delete Category
                </p>
                <p className="text-xs mt-0.5" style={{ color: "rgb(110, 118, 135)" }}>
                  This action cannot be undone
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
              <p className="text-sm" style={{ color: "rgb(55, 65, 81)" }}>
                Are you sure you want to delete{" "}
                <span className="font-bold" style={{ color: "rgb(15, 20, 35)" }}>
                  "{confirmDialog.categoryName}"
                </span>
                ? All subcategories may also be affected.
              </p>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-end gap-2 px-5 py-4"
              style={{
                borderTop: "1px solid rgb(240, 242, 245)",
                backgroundColor: "rgb(248, 249, 251)",
                borderRadius: "0 0 8px 8px",
              }}
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
                style={{ borderRadius: "6px", backgroundColor: "rgb(185, 28, 28)", color: "rgb(255, 255, 255)" }}
                onMouseEnter={e => { if (!isDeleting) e.currentTarget.style.backgroundColor = "rgb(153, 27, 27)" }}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgb(185, 28, 28)")}
              >
                {isDeleting ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Category Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
          onClick={() => { setShowModal(false); setFormErrors({}) }}
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
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgb(240, 242, 245)" }}
            >
              <div>
                <p className="text-sm font-bold" style={{ color: "rgb(15, 20, 35)" }}>
                  Create Category
                </p>
                <p className="text-xs mt-0.5" style={{ color: "rgb(110, 118, 135)" }}>
                  Add a new product category
                </p>
              </div>
              <button
                onClick={() => { setShowModal(false); setFormErrors({}) }}
                className="flex items-center justify-center w-7 h-7 transition-colors"
                style={{
                  borderRadius: "6px",
                  border: "1px solid rgb(220, 223, 230)",
                  backgroundColor: "rgb(255, 255, 255)",
                  color: "rgb(100, 108, 125)",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgb(246, 247, 249)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgb(255, 255, 255)")}
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit}>
              <div className="px-5 py-4 space-y-4">

                {/* Name */}
                <div>
                  <label style={labelStyle}>
                    Category Name <span style={{ color: "rgb(185, 28, 28)" }}>*</span>
                  </label>
                  <input
                    value={formData.name}
                    onChange={e => {
                      setFormData({ ...formData, name: e.target.value })
                      if (formErrors.name) setFormErrors({ ...formErrors, name: "" })
                    }}
                    placeholder="e.g., Popsicles"
                    style={
                      formErrors.name
                        ? { ...inputBase, border: "1px solid rgb(185, 28, 28)" }
                        : inputBase
                    }
                    onFocus={e => (e.currentTarget.style.borderColor = "rgb(100, 108, 125)")}
                    onBlur={e => {
                      if (!formErrors.name)
                        e.currentTarget.style.borderColor = "rgb(220, 223, 230)"
                    }}
                  />
                  {formErrors.name && (
                    <p style={{ fontSize: "12px", color: "rgb(185, 28, 28)", marginTop: "4px" }}>
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the category"
                    rows={3}
                    style={{
                      ...inputBase,
                      height: "auto",
                      padding: "10px 12px",
                      resize: "vertical",
                      lineHeight: "1.5",
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgb(100, 108, 125)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgb(220, 223, 230)")}
                  />
                </div>
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-end gap-2 px-5 py-4"
                style={{
                  borderTop: "1px solid rgb(240, 242, 245)",
                  backgroundColor: "rgb(248, 249, 251)",
                  borderRadius: "0 0 8px 8px",
                }}
              >
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setFormErrors({}) }}
                  className="text-xs font-semibold px-4 py-2 transition-colors"
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
                  type="submit"
                  disabled={isCreating}
                  className="text-xs font-bold px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ borderRadius: "6px", backgroundColor: "rgb(185, 28, 28)", color: "rgb(255, 255, 255)" }}
                  onMouseEnter={e => { if (!isCreating) e.currentTarget.style.backgroundColor = "rgb(153, 27, 27)" }}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgb(185, 28, 28)")}
                >
                  {isCreating ? "Creating..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div
        className="flex items-center justify-between pb-6"
        style={{ borderBottom: "1px solid rgb(220, 223, 230)" }}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "rgb(15, 20, 35)" }}>
            Categories
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "rgb(110, 118, 135)" }}>
            Manage product categories
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-md transition-all"
          style={{ backgroundColor: "rgb(185, 28, 28)", color: "rgb(255, 255, 255)" }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgb(153, 27, 27)")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgb(185, 28, 28)")}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Add Category
        </button>
      </div>

      {/* ── Search Bar ── */}
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
          placeholder="Search categories by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
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

      {/* ── Table ── */}
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
                {["#", "Category", "Slug", "Description", "Status", "Actions"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider ${i === 5 ? "text-right" : "text-left"}`}
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
                  <td colSpan={6} className="px-5 py-12 text-center text-sm" style={{ color: "rgb(156, 163, 175)" }}>
                    Loading categories...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center" style={{ color: "rgb(156, 163, 175)" }}>
                    <div className="flex flex-col items-center gap-2">
                      <FolderTree className="w-8 h-8" style={{ color: "rgb(209, 213, 219)" }} />
                      <p className="text-sm font-medium">
                        {search ? `No categories found for "${search}"` : "No categories yet"}
                      </p>
                      {!search && (
                        <button
                          onClick={() => setShowModal(true)}
                          className="text-xs font-bold mt-1"
                          style={{ color: "rgb(185, 28, 28)" }}
                        >
                          + Add your first category
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((category, index) => (
                  <tr
                    key={category._id}
                    style={{
                      borderBottom: index < filtered.length - 1 ? "1px solid rgb(240, 242, 245)" : "none",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgb(252, 252, 253)")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    {/* # */}
                    <td className="px-5 py-4 text-xs font-bold" style={{ color: "rgb(185, 28, 28)" }}>
                      {index + 1}
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3" style={{ paddingLeft: `${category.level * 16}px` }}>
                        {category.level > 0 && (
                          <span style={{ color: "rgb(209, 213, 219)", fontSize: "12px" }}>↳</span>
                        )}
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-9 h-9 object-cover shrink-0"
                            style={{ borderRadius: "4px", border: "1px solid rgb(220, 223, 230)" }}
                          />
                        ) : (
                          <div
                            className="w-9 h-9 shrink-0 flex items-center justify-center"
                            style={{
                              borderRadius: "4px",
                              backgroundColor: "rgb(243, 244, 246)",
                              border: "1px solid rgb(220, 223, 230)",
                            }}
                          >
                            <FolderTree className="w-4 h-4" style={{ color: "rgb(156, 163, 175)" }} />
                          </div>
                        )}
                        <span className="font-semibold" style={{ color: "rgb(15, 20, 35)" }}>
                          {category.name}
                        </span>
                      </div>
                    </td>

                    {/* Slug */}
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
                        /{category.slug}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="px-5 py-4 text-sm max-w-[200px] truncate" style={{ color: "rgb(110, 118, 135)" }}>
                      {category.description || "—"}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-bold px-2.5 py-1"
                        style={
                          category.isActive
                            ? {
                                borderRadius: "4px",
                                backgroundColor: "rgb(240, 253, 244)",
                                color: "rgb(21, 91, 48)",
                                border: "1px solid rgb(187, 247, 208)",
                              }
                            : {
                                borderRadius: "4px",
                                backgroundColor: "rgb(254, 242, 242)",
                                color: "rgb(185, 28, 28)",
                                border: "1px solid rgb(254, 202, 202)",
                              }
                        }
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
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
                          <Edit className="w-4 h-4 stroke-[2.5]" />
                        </button>
                        <button
                          onClick={() => openConfirm(category._id, category.name)}
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
      </div>
    </div>
  )
}
