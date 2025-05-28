"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Color {
  id: number
  name: string
  image: string | null
  type: string | null
  created_at: string
  updated_at: string
}

interface ColorFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormData) => void
  initialData?: Color
}

export function ColorForm({ open, onOpenChange, onSubmit, initialData }: ColorFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "#000000",
    status: "1",
    type: "",
    image: null as File | null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [colorTypes, setColorTypes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const fetchColorTypes = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("authToken") || ""
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/colors-types`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      // Handle array of strings directly
      setColorTypes(data.data || data || [])
    } catch (error) {
      console.error("Failed to fetch color types:", error)
      // Fallback to default types
      setColorTypes(["Primary", "Secondary", "Accent"])
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    if (open) {
      fetchColorTypes()
    }
  }, [open])

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        code: "#000000",
        status: "1",
        type: initialData.type || "",
        image: null,
      })
      // Set preview for existing image
      if (initialData.image) {
        setImagePreview(initialData.image)
      }
    } else {
      setFormData({
        name: "",
        code: "#000000",
        status: "1",
        type: "",
        image: null,
      })
      setImagePreview(null)
    }
    setErrors({})
  }, [initialData, open])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, image: file }))

    // Create preview URL for new file
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    } else {
      setImagePreview(null)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Color name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const submitData = new FormData()
    submitData.append("name", formData.name)
    if (formData.type) {
      submitData.append("type", formData.type)
    }
    if (formData.image) {
      submitData.append("image", formData.image)
    }

    onSubmit(submitData)

    // Reset form
    setFormData({
      name: "",
      code: "#000000",
      status: "1",
      type: "",
      image: null,
    })
    setImagePreview(null)
    setErrors({})
  }

  const handleClose = () => {
    onOpenChange(false)
    // Clean up preview URL
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Color" : "Add New Color"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Color Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter color name (e.g., Red, Blue, etc.)"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, type: value }))
                if (errors.type) {
                  setErrors((prev) => ({ ...prev, type: "" }))
                }
              }}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a color type" />
              </SelectTrigger>
              <SelectContent>
                {colorTypes.map((type, index) => (
                  <SelectItem key={index} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {loading && <p className="text-sm text-muted-foreground">Loading color types...</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Color Image</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer" />
            <p className="text-sm text-muted-foreground">Upload an image for this color (optional)</p>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={
                    imagePreview.startsWith("blob:")
                      ? imagePreview
                      : `${import.meta.env.VITE_BACKEND_URL}/${imagePreview}`
                  }
                  alt="Color preview"
                  className="w-20 h-20 object-cover rounded-md border"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-500 hover:bg-red-600">
              {initialData ? "Update" : "Add"} Color
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
