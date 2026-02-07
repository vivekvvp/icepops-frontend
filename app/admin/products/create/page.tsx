"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useCreateProductMutation } from "@/lib/services/product.api"
import ImageUploader from "@/components/ImageUploader"

export default function CreateProductPage() {
  const router = useRouter()
  const [createProduct, { isLoading }] = useCreateProductMutation()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    images: [] as string[],
  })
  const [imageFiles, setImageFiles] = useState<Array<{ data: string; name: string }>>([])
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
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
    setError("")

    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      setError("Please fill in all required fields")
      return
    }

    const price = parseFloat(formData.price)
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price")
      return
    }

    console.log('Submitting product with imageFiles:', imageFiles.length)

    try {
      const result = await createProduct({
        name: formData.name,
        description: formData.description,
        price,
        category: formData.category,
        imageFiles,
      }).unwrap()

      console.log('Product created successfully:', result)
      router.push("/admin/products")
    } catch (err: any) {
      console.error('Product creation error:', err)
      setError(err.data?.message || "Failed to create product")
    }
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
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

      <Card className="p-6 w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Ice Pops, Cream Rolls"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price ($) *
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={4}
              required
              disabled={isLoading}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Images (up to 10)
            </label>
            <ImageUploader
              images={formData.images}
              onImagesChange={handleImagesChange}
              imageFiles={imageFiles}
              onImageFilesChange={handleImageFilesChange}
              maxImages={10}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link href="/admin/products">
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
