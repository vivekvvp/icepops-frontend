"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useCreateProductMutation, useGetAllCategoriesQuery } from "@/lib/services/api"
import ImageUploader from "@/components/ImageUploader"
import { toast } from "sonner"

export default function CreateProductPage() {
  const router = useRouter()
  const [createProduct, { isLoading }] = useCreateProductMutation()
  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "0",
    images: [] as string[],
  })
  const [imageFiles, setImageFiles] = useState<Array<{ data: string; name: string }>>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const categories = categoriesData?.data || []

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: "" })
  }

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
    validateField(field)
  }

  const validateField = (field: string) => {
    const newErrors = { ...errors }
    switch (field) {
      case "name":
        if (!formData.name.trim()) newErrors.name = "Product name is required"
        else if (formData.name.length < 3) newErrors.name = "Product name must be at least 3 characters"
        else delete newErrors.name
        break
      case "category":
        if (!formData.category.trim()) newErrors.category = "Category is required"
        else delete newErrors.category
        break
      case "price":
        if (!formData.price) newErrors.price = "Price is required"
        else {
          const price = parseFloat(formData.price)
          if (isNaN(price) || price <= 0) newErrors.price = "Price must be greater than 0"
          else delete newErrors.price
        }
        break
      case "description":
        if (!formData.description.trim()) newErrors.description = "Description is required"
        else if (formData.description.length < 10) newErrors.description = "Description must be at least 10 characters"
        else delete newErrors.description
        break
    }
    setErrors(newErrors)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Product name is required"
    else if (formData.name.length < 3) newErrors.name = "Product name must be at least 3 characters"
    if (!formData.category.trim()) newErrors.category = "Category is required"
    if (!formData.price) newErrors.price = "Price is required"
    else {
      const price = parseFloat(formData.price)
      if (isNaN(price) || price <= 0) newErrors.price = "Price must be greater than 0"
    }
    if (!formData.description.trim()) newErrors.description = "Description is required"
    else if (formData.description.length < 10) newErrors.description = "Description must be at least 10 characters"
    setErrors(newErrors)
    setTouched({ name: true, category: true, price: true, description: true })
    return Object.keys(newErrors).length === 0
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }
    try {
      await createProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
        imageFiles,
      }).unwrap()
      toast.success("Product created successfully!", {
        description: `${formData.name} has been added to your inventory`,
      })
      router.push("/admin/products")
    } catch (err: any) {
      toast.error("Failed to create product", {
        description: err.data?.message || "An error occurred while creating the product",
      })
    }
  }

  /* ── shared input style ── */
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
              Create Product
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "rgb(110, 118, 135)" }}>
              Add a new product to your inventory
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

          {/* Form Body */}
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
                  style={touched.name && errors.name ? inputError : inputBase}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgb(100, 108, 125)")}
                  onBlurCapture={e => {
                    if (!(touched.name && errors.name))
                      e.currentTarget.style.borderColor = "rgb(220, 223, 230)"
                  }}
                />
                {touched.name && errors.name && (
                  <p style={errorStyle}>{errors.name}</p>
                )}
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
                    style={touched.category && errors.category ? inputError : inputBase}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category: any) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
                {touched.category && errors.category && (
                  <p style={errorStyle}>{errors.category}</p>
                )}
                {categories.length === 0 && !categoriesLoading && (
                  <p style={{ fontSize: "12px", color: "rgb(161, 72, 10)", marginTop: "4px" }}>
                    No categories available.{" "}
                    <Link
                      href="/admin/categories"
                      style={{ textDecoration: "underline", fontWeight: 600 }}
                    >
                      Create a category
                    </Link>{" "}
                    first.
                  </p>
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
                  style={touched.price && errors.price ? inputError : inputBase}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgb(100, 108, 125)")}
                  onBlurCapture={e => {
                    if (!(touched.price && errors.price))
                      e.currentTarget.style.borderColor = "rgb(220, 223, 230)"
                  }}
                />
                {touched.price && errors.price && (
                  <p style={errorStyle}>{errors.price}</p>
                )}
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
              disabled={isLoading}
              className="text-sm font-bold px-5 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderRadius: "6px",
                backgroundColor: "rgb(185, 28, 28)",
                color: "rgb(255, 255, 255)",
              }}
              onMouseEnter={e => {
                if (!isLoading) e.currentTarget.style.backgroundColor = "rgb(153, 27, 27)"
              }}
              onMouseLeave={e =>
                (e.currentTarget.style.backgroundColor = "rgb(185, 28, 28)")
              }
            >
              {isLoading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
