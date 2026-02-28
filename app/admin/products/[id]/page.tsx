"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useGetProductByIdQuery, useUpdateProductMutation, useGetAllCategoriesQuery } from "@/lib/services/api"
import ImageUploader from "@/components/ImageUploader"
import { toast } from "sonner"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: productResponse, isLoading: isLoadingProduct } = useGetProductByIdQuery(params.id)
  const product = (productResponse as any)?.data
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()
  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery(false)
  const categories = categoriesData?.data || []

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [] as string[],
  })
  const [imageFiles, setImageFiles] = useState<Array<{ data: string; name: string }>>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price != null ? product.price.toString() : "",
        stock: product.stock != null ? product.stock.toString() : "",
        category: typeof product.category === "object" ? product.category?._id : product.category || "",
        images: product.images || [],
      })
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: "" })
  }

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
  }

  const handleImagesChange = useCallback((updater: string[] | ((prev: string[]) => string[])) => {
    setFormData(prev => ({
      ...prev,
      images: typeof updater === "function" ? updater(prev.images) : updater,
    }))
  }, [])

  const handleImageFilesChange = useCallback(
    (updater: Array<{ data: string; name: string }> | ((prev: Array<{ data: string; name: string }>) => Array<{ data: string; name: string }>)) => {
      setImageFiles(prev => (typeof updater === "function" ? updater(prev) : updater))
    },
    []
  )

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Product name is required"
    else if (formData.name.length < 3) newErrors.name = "Must be at least 3 characters"
    if (!formData.category.trim()) newErrors.category = "Category is required"
    if (!formData.price) newErrors.price = "Price is required"
    else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0)
      newErrors.price = "Price must be greater than 0"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    else if (formData.description.length < 10) newErrors.description = "Must be at least 10 characters"
    setErrors(newErrors)
    setTouched({ name: true, category: true, price: true, description: true })
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }
    try {
      await updateProduct({
        id: params.id,
        data: {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock) || 0,
          category: formData.category,
          images: formData.images.filter(img => img.startsWith("http")),
          imageFiles,
        },
      }).unwrap()
      toast.success("Product updated successfully!")
      router.push("/admin/products")
    } catch (err: any) {
      toast.error("Failed to update product", {
        description: err.data?.message || "An error occurred",
      })
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

  const inputError: React.CSSProperties = {
    ...inputBase,
    border: "1px solid rgb(185, 28, 28)",
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "6px",
    color: "rgb(55, 65, 81)",
  }

  const errorStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "rgb(185, 28, 28)",
    marginTop: "4px",
  }

  /* ── Loading state ── */
  if (isLoadingProduct) {
    return (
      <div
        className="min-h-screen p-8 flex items-center justify-center"
        style={{ backgroundColor: "rgb(246, 247, 249)" }}
      >
        <p style={{ fontSize: "14px", color: "rgb(110, 118, 135)" }}>Loading product...</p>
      </div>
    )
  }

  /* ── Not found state ── */
  if (!product) {
    return (
      <div
        className="min-h-screen p-8 flex items-center justify-center"
        style={{ backgroundColor: "rgb(246, 247, 249)" }}
      >
        <p style={{ fontSize: "14px", color: "rgb(185, 28, 28)" }}>Product not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 space-y-6" style={{ backgroundColor: "rgb(246, 247, 249)" }}>

      {/* Header */}
      <div
        className="flex items-center justify-between pb-6"
        style={{ borderBottom: "1px solid rgb(220, 223, 230)" }}
      >
        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <button
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
          </Link>
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "rgb(15, 20, 35)" }}
            >
              Edit Product
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "rgb(110, 118, 135)" }}>
              Update product information
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div
        className="rounded-md overflow-hidden"
        style={{
          backgroundColor: "rgb(255, 255, 255)",
          border: "1px solid rgb(220, 223, 230)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">

            {/* Row 1 — Name & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Name */}
              <div>
                <label htmlFor="name" style={labelStyle}>
                  Product Name <span style={{ color: "rgb(185, 28, 28)" }}>*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur("name")}
                  placeholder="Enter product name"
                  disabled={isUpdating}
                  style={touched.name && errors.name ? inputError : inputBase}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgb(100, 108, 125)")}
                  onBlurCapture={e => {
                    if (!(touched.name && errors.name))
                      e.currentTarget.style.borderColor = "rgb(220, 223, 230)"
                  }}
                />
                {touched.name && errors.name && <p style={errorStyle}>{errors.name}</p>}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" style={labelStyle}>
                  Category <span style={{ color: "rgb(185, 28, 28)" }}>*</span>
                </label>
                {categoriesLoading ? (
                  <div
                    className="animate-pulse"
                    style={{
                      height: "38px",
                      borderRadius: "6px",
                      backgroundColor: "rgb(243, 244, 246)",
                    }}
                  />
                ) : (
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    onBlur={() => handleBlur("category")}
                    disabled={isUpdating}
                    style={touched.category && errors.category ? inputError : inputBase}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat: any) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
                {touched.category && errors.category && (
                  <p style={errorStyle}>{errors.category}</p>
                )}
              </div>
            </div>

            {/* Row 2 — Price & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Price */}
              <div>
                <label htmlFor="price" style={labelStyle}>
                  Price (₹) <span style={{ color: "rgb(185, 28, 28)" }}>*</span>
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  onBlur={() => handleBlur("price")}
                  placeholder="0.00"
                  disabled={isUpdating}
                  style={touched.price && errors.price ? inputError : inputBase}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgb(100, 108, 125)")}
                  onBlurCapture={e => {
                    if (!(touched.price && errors.price))
                      e.currentTarget.style.borderColor = "rgb(220, 223, 230)"
                  }}
                />
                {touched.price && errors.price && <p style={errorStyle}>{errors.price}</p>}
              </div>

              {/* Stock */}
              <div>
                <label htmlFor="stock" style={labelStyle}>
                  Stock Quantity
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={isUpdating}
                  style={inputBase}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgb(100, 108, 125)")}
                  onBlurCapture={e =>
                    (e.currentTarget.style.borderColor = "rgb(220, 223, 230)")
                  }
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" style={labelStyle}>
                Description <span style={{ color: "rgb(185, 28, 28)" }}>*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={() => handleBlur("description")}
                placeholder="Enter product description"
                rows={4}
                disabled={isUpdating}
                style={{
                  ...(touched.description && errors.description ? inputError : inputBase),
                  height: "auto",
                  padding: "10px 12px",
                  resize: "vertical",
                  lineHeight: "1.5",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "rgb(100, 108, 125)")}
                onBlurCapture={e => {
                  if (!(touched.description && errors.description))
                    e.currentTarget.style.borderColor = "rgb(220, 223, 230)"
                }}
              />
              {touched.description && errors.description && (
                <p style={errorStyle}>{errors.description}</p>
              )}
            </div>

            {/* Images */}
            <div>
              <label style={labelStyle}>
                Product Images{" "}
                <span style={{ fontSize: "12px", fontWeight: 400, color: "rgb(150, 158, 175)" }}>
                  (up to 10)
                </span>
              </label>
              <ImageUploader
                images={formData.images}
                onImagesChange={handleImagesChange}
                imageFiles={imageFiles}
                onImageFilesChange={handleImageFilesChange}
                maxImages={10}
              />
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-3 px-6 py-4"
            style={{
              borderTop: "1px solid rgb(220, 223, 230)",
              backgroundColor: "rgb(248, 249, 251)",
            }}
          >
            <Link href="/admin/products">
              <button
                type="button"
                className="text-sm font-semibold px-4 py-2 transition-colors"
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
            </Link>
            <button
              type="submit"
              disabled={isUpdating}
              className="text-sm font-bold px-5 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderRadius: "6px",
                backgroundColor: "rgb(185, 28, 28)",
                color: "rgb(255, 255, 255)",
              }}
              onMouseEnter={e => {
                if (!isUpdating) e.currentTarget.style.backgroundColor = "rgb(153, 27, 27)"
              }}
              onMouseLeave={e =>
                (e.currentTarget.style.backgroundColor = "rgb(185, 28, 28)")
              }
            >
              {isUpdating ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
