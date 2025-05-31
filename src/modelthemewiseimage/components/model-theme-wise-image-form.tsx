"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "react-hot-toast"

interface VehicleModel {
  id: number
  name: string
}

interface Theme {
  id: number
  name: string
}

interface ModelThemeWiseImage {
  id: number
  vehicle_model_id: number
  theme_id: number
  image: string
  created_at: string
  updated_at: string
  vehicle_model: VehicleModel
  theme: Theme
}

interface ModelThemeWiseImageFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormData) => Promise<void>
  initialData?: ModelThemeWiseImage
}

export function ModelThemeWiseImageForm({ open, onOpenChange, onSubmit, initialData }: ModelThemeWiseImageFormProps) {
  const [formData, setFormData] = useState({
    vehicle_model_id: "",
    theme_id: "",
    image: null as File | null,
  })

  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Fetch vehicle models and themes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [modelsResponse, themesResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/models`),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/themes`),
        ])

        if (!modelsResponse.ok) throw new Error("Failed to fetch vehicle models")
        if (!themesResponse.ok) throw new Error("Failed to fetch themes")

        const modelsData = await modelsResponse.json()
        const themesData = await themesResponse.json()

        setVehicleModels(modelsData.data?.data || modelsData.data || [])
        setThemes(themesData.data?.data || themesData.data || [])
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load form data")
      } finally {
        setLoading(false)
      }
    }

    if (open) fetchData()
  }, [open])

  // Initialize form data and image preview
  useEffect(() => {
    if (initialData) {
      setFormData({
        vehicle_model_id: initialData.vehicle_model_id.toString(),
        theme_id: initialData.theme_id.toString(),
        image: null,
      })
      setImagePreview(initialData.image 
        ? `${import.meta.env.VITE_BACKEND_URL}/${initialData.image}`
        : null)
    } else {
      setFormData({
        vehicle_model_id: "",
        theme_id: "",
        image: null,
      })
      setImagePreview(null)
    }
    setErrors({})
  }, [initialData, open])

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, image: file }))

    // Create preview for new image
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else if (initialData?.image) {
      // Revert to original image if file selection is cleared
      setImagePreview(`${import.meta.env.VITE_BACKEND_URL}/${initialData.image}`)
    } else {
      setImagePreview(null)
    }

    if (errors.image) setErrors(prev => ({ ...prev, image: "" }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.vehicle_model_id) newErrors.vehicle_model_id = "Vehicle model is required"
    if (!formData.theme_id) newErrors.theme_id = "Theme is required"
    if (!initialData && !formData.image) newErrors.image = "Image is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      const submitData = new FormData()
      submitData.append("vehicle_model_id", formData.vehicle_model_id)
      submitData.append("theme_id", formData.theme_id)
      if (formData.image) submitData.append("image", formData.image)

      await onSubmit(submitData)
      toast.success(initialData ? "Image updated successfully" : "Image added successfully")
      handleClose()
    } catch (error) {
      console.error("Form submission error:", error)
      toast.error("Failed to submit form. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setFormData({
      vehicle_model_id: "",
      theme_id: "",
      image: null,
    })
    setErrors({})
    setImagePreview(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Image" : "Add New theme"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicle_model_id">Vehicle Model *</Label>
            <select
              id="vehicle_model_id"
              value={formData.vehicle_model_id}
              onChange={(e) => handleSelectChange("vehicle_model_id", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.vehicle_model_id ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
            >
              <option value="">Select Vehicle Model</option>
              {vehicleModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            {errors.vehicle_model_id && <p className="text-sm text-red-500">{errors.vehicle_model_id}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme_id">Theme *</Label>
            <select
              id="theme_id"
              value={formData.theme_id}
              onChange={(e) => handleSelectChange("theme_id", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.theme_id ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
            >
              <option value="">Select Theme</option>
              {themes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
            {errors.theme_id && <p className="text-sm text-red-500">{errors.theme_id}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image {!initialData && "*"}</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={`cursor-pointer ${errors.image ? "border-red-500" : ""}`}
            />
            {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
            {initialData && <p className="text-sm text-muted-foreground">Leave empty to keep current image</p>}
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-2">
                <Label>Preview</Label>
                <div className="relative w-full h-48 mt-1 border rounded-md overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : initialData ? "Update" : "Add"} Image
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}