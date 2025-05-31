"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Upload, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

interface Theme {
  id?: number
  name: string
  image: string
  flooring_name: string
  flooring_image: string
  cabinetry_1_name: string
  cabinetry_1_image: string
  cabinetry_2_name?: string
  cabinetry_2_image?: string
  table_top_1_name: string
  table_top_1_image: string
  table_top_2_name?: string
  table_top_2_image?: string
  seating_1_name: string
  seating_1_image: string
  seating_2_name?: string
  seating_2_image?: string
}

interface ThemeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Theme
  onSubmit: (data: FormData) => Promise<void>
}

interface ImagePreview {
  file: File | null
  preview: string
  existing?: string
}

export function ThemeForm({ open, onOpenChange, initialData, onSubmit }: ThemeFormProps) {
  const [formData, setFormData] = useState<Theme>({
    name: "",
    image: "",
    flooring_name: "",
    flooring_image: "",
    cabinetry_1_name: "",
    cabinetry_1_image: "",
    cabinetry_2_name: "",
    cabinetry_2_image: "",
    table_top_1_name: "",
    table_top_1_image: "",
    table_top_2_name: "",
    table_top_2_image: "",
    seating_1_name: "",
    seating_1_image: "",
    seating_2_name: "",
    seating_2_image: "",
  })

  const [images, setImages] = useState<Record<string, ImagePreview>>({
    image: { file: null, preview: "" },
    flooring_image: { file: null, preview: "" },
    cabinetry_1_image: { file: null, preview: "" },
    cabinetry_2_image: { file: null, preview: "" },
    table_top_1_image: { file: null, preview: "" },
    table_top_2_image: { file: null, preview: "" },
    seating_1_image: { file: null, preview: "" },
    seating_2_image: { file: null, preview: "" },
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      // Set existing image previews
      const newImages = { ...images }
      Object.keys(images).forEach((key) => {
        const imagePath = initialData[key as keyof Theme] as string
        if (imagePath) {
          newImages[key] = {
            file: null,
            preview: `${import.meta.env.VITE_BACKEND_URL}/${imagePath}`,
            existing: imagePath,
          }
        }
      })
      setImages(newImages)
    } else {
      // Reset form for new theme
      setFormData({
        name: "",
        image: "",
        flooring_name: "",
        flooring_image: "",
        cabinetry_1_name: "",
        cabinetry_1_image: "",
        cabinetry_2_name: "",
        cabinetry_2_image: "",
        table_top_1_name: "",
        table_top_1_image: "",
        table_top_2_name: "",
        table_top_2_image: "",
        seating_1_name: "",
        seating_1_image: "",
        seating_2_name: "",
        seating_2_image: "",
      })
      setImages({
        image: { file: null, preview: "" },
        flooring_image: { file: null, preview: "" },
        cabinetry_1_image: { file: null, preview: "" },
        cabinetry_2_image: { file: null, preview: "" },
        table_top_1_image: { file: null, preview: "" },
        table_top_2_image: { file: null, preview: "" },
        seating_1_image: { file: null, preview: "" },
        seating_2_image: { file: null, preview: "" },
      })
    }
  }, [initialData, open, images])

  const handleInputChange = (field: keyof Theme, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (field: string, file: File | null) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages((prev) => ({
          ...prev,
          [field]: {
            file,
            preview: reader.result as string,
            existing: prev[field]?.existing,
          },
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (field: string) => {
    setImages((prev) => ({
      ...prev,
      [field]: { file: null, preview: "", existing: undefined },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = new FormData()

      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "string" && !key.includes("_image") && key !== "image") {
          submitData.append(key, value)
        }
      })

      // Add image files
      Object.entries(images).forEach(([key, imageData]) => {
        if (imageData.file) {
          submitData.append(key, imageData.file)
        } else if (imageData.existing && !imageData.file) {
          // Keep existing image if no new file is selected
          submitData.append(key, imageData.existing)
        }
      })

      await onSubmit(submitData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting form:", error)
      
    } finally {
      setLoading(false)
    }
  }

  const ImageUploadField = ({
    label,
    field
  }: {
    label: string
    field: string
  }) => (
    <div className="space-y-2">
      <Label htmlFor={field}>
        {label} { <span className="text-red-500">*</span>}
      </Label>
      <div className="space-y-2">
        {images[field]?.preview ? (
          <div className="relative">
            <img
              src={images[field].preview || "/placeholder.svg"}
              alt={label}
              className="w-full h-32 object-cover rounded-md border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => removeImage(field)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-4">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Click to upload image</p>
            </div>
          </div>
        )}
        <Input
          id={field}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(field, e.target.files?.[0] || null)}
          className="cursor-pointer"
        />
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Theme" : "Add New Theme"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <div className="p-4 space-y-4">
              <h3 className="font-semibold">Basic Information</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Theme Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter theme name"
                    
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Flooring */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Flooring</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="flooring_name">
                    Flooring Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="flooring_name"
                    value={formData.flooring_name}
                    onChange={(e) => handleInputChange("flooring_name", e.target.value)}
                    placeholder="Enter flooring name"
                    
                  />
                </div>
                <ImageUploadField label="Flooring Image" field="flooring_image" />
              </div>
            </CardContent>
          </Card>

          {/* Cabinetry */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Cabinetry Options</h3>
              <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cabinetry 1 */}
                <div>
                  <h4 className="font-medium mb-3">Cabinetry Option 1</h4>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="cabinetry_1_name">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="cabinetry_1_name"
                        value={formData.cabinetry_1_name}
                        onChange={(e) => handleInputChange("cabinetry_1_name", e.target.value)}
                        placeholder="Enter cabinetry name"
                        
                      />
                    </div>
                    <ImageUploadField label="Image" field="cabinetry_1_image"  />
                  </div>
                </div>

                {/* Cabinetry 2 */}
                <div>
                  <h4 className="font-medium mb-3">Cabinetry Option 2</h4>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="cabinetry_2_name">Name</Label>
                      <Input
                        id="cabinetry_2_name"
                        value={formData.cabinetry_2_name || ""}
                        onChange={(e) => handleInputChange("cabinetry_2_name", e.target.value)}
                        placeholder="Enter cabinetry name"
                      />
                    </div>
                    <ImageUploadField label="Image" field="cabinetry_2_image" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table Tops */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Table Top Options</h3>
              <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Table Top 1 */}
                <div>
                  <h4 className="font-medium mb-3">Table Top Option 1</h4>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="table_top_1_name">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="table_top_1_name"
                        value={formData.table_top_1_name}
                        onChange={(e) => handleInputChange("table_top_1_name", e.target.value)}
                        placeholder="Enter table top name"
                        
                      />
                    </div>
                    <ImageUploadField label="Image" field="table_top_1_image" />
                  </div>
                </div>

                {/* Table Top 2 */}
                <div>
                  <h4 className="font-medium mb-3">Table Top Option 2</h4>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="table_top_2_name">Name</Label>
                      <Input
                        id="table_top_2_name"
                        value={formData.table_top_2_name || ""}
                        onChange={(e) => handleInputChange("table_top_2_name", e.target.value)}
                        placeholder="Enter table top name"
                      />
                    </div>
                    <ImageUploadField label="Image" field="table_top_2_image" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seating */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Seating Options</h3>
              <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Seating 1 */}
                <div>
                  <h4 className="font-medium mb-3">Seating Option 1</h4>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="seating_1_name">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="seating_1_name"
                        value={formData.seating_1_name}
                        onChange={(e) => handleInputChange("seating_1_name", e.target.value)}
                        placeholder="Enter seating name"
                      />
                    </div>
                    <ImageUploadField label="Image" field="seating_1_image" />
                  </div>
                </div>

                {/* Seating 2 */}
                <div>
                  <h4 className="font-medium mb-3">Seating Option 2</h4>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="seating_2_name">Name</Label>
                      <Input
                        id="seating_2_name"
                        value={formData.seating_2_name || ""}
                        onChange={(e) => handleInputChange("seating_2_name", e.target.value)}
                        placeholder="Enter seating name"
                      />
                    </div>
                    <ImageUploadField label="Image" field="seating_2_image" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update Theme" : "Create Theme"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
