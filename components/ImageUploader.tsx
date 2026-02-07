"use client"

import { useState, useCallback } from "react"
import { Upload, X, Loader2 } from "lucide-react"

interface ImageUploaderProps {
  images: string[]
  onImagesChange: (updater: string[] | ((prev: string[]) => string[])) => void
  imageFiles: Array<{ data: string; name: string }>
  onImageFilesChange: (updater: Array<{ data: string; name: string }> | ((prev: Array<{ data: string; name: string }>) => Array<{ data: string; name: string }>)) => void
  maxImages?: number
}

export default function ImageUploader({ 
  images, 
  onImagesChange, 
  imageFiles,
  onImageFilesChange,
  maxImages = 10 
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleFiles = useCallback(async (files: FileList) => {
    setError("")

    const file = files[0]
    
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload only image files")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    try {
      setIsProcessing(true)
      const base64 = await convertToBase64(file)
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      
      // Add to images for preview (with functional update)
      onImagesChange((prevImages: string[]) => {
        if (prevImages.length >= maxImages) {
          setError(`Maximum ${maxImages} images allowed`)
          return prevImages
        }
        return [...prevImages, previewUrl]
      })
      
      // Add to imageFiles for upload (with functional update)
      onImageFilesChange((prevFiles: Array<{ data: string; name: string }>) => {
        if (prevFiles.length >= maxImages) {
          return prevFiles
        }
        return [...prevFiles, { data: base64, name: file.name }]
      })
    } catch (err: any) {
      setError("Failed to process image")
    } finally {
      setIsProcessing(false)
    }
  }, [onImagesChange, onImageFilesChange, maxImages])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        await handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles]
  )

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFiles(e.target.files)
    }
  }, [handleFiles])

  const removeImage = useCallback((index: number) => {
    // Clean up blob URL if it's a blob
    onImagesChange((prevImages: string[]) => {
      if (prevImages[index]?.startsWith('blob:')) {
        URL.revokeObjectURL(prevImages[index])
      }
      return prevImages.filter((_, i) => i !== index)
    })
    onImageFilesChange((prevFiles: Array<{ data: string; name: string }>) => 
      prevFiles.filter((_, i) => i !== index)
    )
  }, [onImagesChange, onImageFilesChange])

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 dark:border-gray-600"
        } ${images.length >= maxImages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={isProcessing || images.length >= maxImages}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {isProcessing ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Processing image...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-12 h-12 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Drag and drop an image here, or click to select
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG up to 5MB ({images.length}/{maxImages} images)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-2 left-2 px-2 py-1 text-xs font-semibold bg-primary text-white rounded">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
