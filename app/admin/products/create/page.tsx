"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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
    setFormData({
      ...formData,
      [name]: value,
    })
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
    validateField(field)
  }

  const validateField = (field: string) => {
    const newErrors = { ...errors }

    switch (field) {
      case "name":
        if (!formData.name.trim()) {
          newErrors.name = "Product name is required"
        } else if (formData.name.length < 3) {
          newErrors.name = "Product name must be at least 3 characters"
        } else {
          delete newErrors.name
        }
        break
      case "category":
        if (!formData.category.trim()) {
          newErrors.category = "Category is required"
        } else {
          delete newErrors.category
        }
        break
      case "price":
        if (!formData.price) {
          newErrors.price = "Price is required"
        } else {
          const price = parseFloat(formData.price)
          if (isNaN(price) || price <= 0) {
            newErrors.price = "Price must be greater than 0"
          } else {
            delete newErrors.price
          }
        }
        break
      case "description":
        if (!formData.description.trim()) {
          newErrors.description = "Description is required"
        } else if (formData.description.length < 10) {
          newErrors.description = "Description must be at least 10 characters"
        } else {
          delete newErrors.description
        }
        break
    }

    setErrors(newErrors)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required"
    } else if (formData.name.length < 3) {
      newErrors.name = "Product name must be at least 3 characters"
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required"
    }

    if (!formData.price) {
      newErrors.price = "Price is required"
    } else {
      const price = parseFloat(formData.price)
      if (isNaN(price) || price <= 0) {
        newErrors.price = "Price must be greater than 0"
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    setErrors(newErrors)
    setTouched({
      name: true,
      category: true,
      price: true,
      description: true,
    })

    return Object.keys(newErrors).length === 0
  }

  const handleImagesChange = useCallback((updater: string[] | ((prev: string[]) => string[])) => {
    setFormData(prev => ({
      ...prev,
      images: typeof updater === 'function' ? updater(prev.images) : updater,
    }))
  }, [])

  const handleImageFilesChange = useCallback((updater: Array<{ data: string; name: string }> | ((prev: Array<{ data: string; name: string }>) => Array<{ data: string; name: string }>)) => {
    setImageFiles(prev => typeof updater === 'function' ? updater(prev) : updater)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    const price = parseFloat(formData.price)
    const stock = parseInt(formData.stock) || 0

    try {
      const result = await createProduct({
        name: formData.name,
        description: formData.description,
        price,
        category: formData.category,
        stock,
        imageFiles,
      }).unwrap()

      toast.success("Product created successfully!", {
        description: `${formData.name} has been added to your inventory`,
      })
      
      router.push("/admin/products")
    } catch (err: any) {
      console.error('Product creation error:', err)
      toast.error("Failed to create product", {
        description: err.data?.message || "An error occurred while creating the product",
      })
    }
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Product
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Add a new product to your inventory
          </p>
        </div>
      </div>

      <Card className="p-8 w-full border-gray-200 dark:border-gray-800">
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur("name")}
                  placeholder="Enter product name"
                  className={`transition-all ${
                    touched.name && errors.name
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                />
                {touched.name && errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">
                  Category <span className="text-red-500">*</span>
                </Label>
                {categoriesLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    onBlur={() => handleBlur("category")}
                    className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${
                      touched.category && errors.category
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "border-gray-300 dark:border-gray-700"
                    }`}
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
                  <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                )}
                {categories.length === 0 && !categoriesLoading && (
                  <p className="text-sm text-amber-600 mt-1">
                    No categories available. Please{" "}
                    <Link href="/admin/categories" className="underline font-medium">
                      create a category
                    </Link>{" "}
                    first.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-700 dark:text-gray-300">
                  Price ($) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  onBlur={() => handleBlur("price")}
                  placeholder="0.00"
                  className={`transition-all ${
                    touched.price && errors.price
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                />
                {touched.price && errors.price && (
                  <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-gray-700 dark:text-gray-300">
                  Stock Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  onBlur={() => handleBlur("stock")}
                  placeholder="0"
                  className="transition-all border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={() => handleBlur("description")}
                placeholder="Enter product description"
                rows={4}
                className={`transition-all ${
                  touched.description && errors.description
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              />
              {touched.description && errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Product Images <span className="text-gray-500 text-xs">(up to 10)</span>
              </Label>
              <ImageUploader
                images={formData.images}
                onImagesChange={handleImagesChange}
                imageFiles={imageFiles}
                onImageFilesChange={handleImageFilesChange}
                maxImages={10}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Link href="/admin/products">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 dark:border-gray-700"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 shadow-sm"
              >
                Create Product
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}
