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
  maxImages = 10,
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }, [])

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (err) => reject(err)
    })

  const handleFiles = useCallback(
    async (files: FileList) => {
      setError("")
      const file = files[0]
      if (!file) return

      if (!file.type.startsWith("image/")) {
        setError("Please upload only image files")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB")
        return
      }

      try {
        setIsProcessing(true)
        const base64 = await convertToBase64(file)
        const previewUrl = URL.createObjectURL(file)

        onImagesChange((prev: string[]) => {
          if (prev.length >= maxImages) {
            setError(`Maximum ${maxImages} images allowed`)
            return prev
          }
          return [...prev, previewUrl]
        })

        onImageFilesChange((prev: Array<{ data: string; name: string }>) => {
          if (prev.length >= maxImages) return prev
          return [...prev, { data: base64, name: file.name }]
        })
      } catch {
        setError("Failed to process image")
      } finally {
        setIsProcessing(false)
      }
    },
    [onImagesChange, onImageFilesChange, maxImages]
  )

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      if (e.dataTransfer.files?.[0]) await handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) await handleFiles(e.target.files)
    },
    [handleFiles]
  )

  const removeImage = useCallback(
    (index: number) => {
      onImagesChange((prev: string[]) => {
        if (prev[index]?.startsWith("blob:")) URL.revokeObjectURL(prev[index])
        return prev.filter((_, i) => i !== index)
      })
      onImageFilesChange((prev: Array<{ data: string; name: string }>) =>
        prev.filter((_, i) => i !== index)
      )
    },
    [onImagesChange, onImageFilesChange]
  )

  const isMaxed = images.length >= maxImages

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          position: "relative",
          border: dragActive
            ? "1.5px dashed rgb(185, 28, 28)"
            : "1.5px dashed rgb(210, 214, 220)",
          borderRadius: "6px",
          padding: "28px 20px",
          textAlign: "center",
          backgroundColor: dragActive
            ? "rgb(254, 248, 248)"
            : isMaxed
            ? "rgb(250, 250, 250)"
            : "rgb(252, 252, 253)",
          cursor: isMaxed ? "not-allowed" : "pointer",
          opacity: isMaxed ? 0.5 : 1,
          transition: "all 0.15s",
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={isProcessing || isMaxed}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: isMaxed ? "not-allowed" : "pointer",
          }}
        />

        {isProcessing ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <Loader2
              className="animate-spin"
              style={{ width: "22px", height: "22px", color: "rgb(185, 28, 28)" }}
            />
            <p style={{ fontSize: "13px", color: "rgb(110, 118, 135)" }}>
              Processing image...
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "6px",
                backgroundColor: dragActive ? "rgb(254, 242, 242)" : "rgb(243, 244, 246)",
                border: `1px solid ${dragActive ? "rgb(254, 202, 202)" : "rgb(229, 231, 235)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Upload
                style={{
                  width: "16px",
                  height: "16px",
                  color: dragActive ? "rgb(185, 28, 28)" : "rgb(100, 108, 125)",
                  strokeWidth: 2.5,
                }}
              />
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "rgb(55, 65, 81)" }}>
                {dragActive ? "Drop image here" : "Click or drag image to upload"}
              </p>
              <p style={{ fontSize: "12px", color: "rgb(150, 158, 175)", marginTop: "2px" }}>
                PNG, JPG up to 5MB &nbsp;·&nbsp;
                <span style={{ color: images.length > 0 ? "rgb(185, 28, 28)" : "rgb(150, 158, 175)", fontWeight: 600 }}>
                  {images.length}/{maxImages}
                </span>{" "}
                uploaded
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p style={{ fontSize: "12px", color: "rgb(185, 28, 28)", marginTop: "-4px" }}>
          {error}
        </p>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
            gap: "10px",
          }}
        >
          {images.map((url, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                borderRadius: "6px",
                overflow: "hidden",
                border: index === 0
                  ? "1.5px solid rgb(185, 28, 28)"
                  : "1px solid rgb(220, 223, 230)",
                backgroundColor: "rgb(248, 249, 251)",
              }}
            >
              <img
                src={url}
                alt={`Product ${index + 1}`}
                style={{
                  width: "100%",
                  height: "90px",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "20px",
                  height: "20px",
                  borderRadius: "4px",
                  backgroundColor: "rgb(17, 24, 39)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  opacity: 0.85,
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "0.85")}
              >
                <X style={{ width: "11px", height: "11px", color: "rgb(255,255,255)", strokeWidth: 3 }} />
              </button>

              {/* Main Badge */}
              {index === 0 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "4px",
                    left: "4px",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "3px",
                    backgroundColor: "rgb(185, 28, 28)",
                    color: "rgb(255, 255, 255)",
                    letterSpacing: "0.04em",
                  }}
                >
                  MAIN
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
