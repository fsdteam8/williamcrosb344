"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"

interface VehicleModel {
  id: number
  name: string
}

interface Color {
  id: number
  name: string
  image?: string
}

interface ModelColorWiseImage {
  id: number
  vehicle_model_id: number
  color_1_id: number
  color_2_id: number
  image: string
  created_at: string
  updated_at: string
  vehicle_model: VehicleModel
  color1: Color
  color2: Color
}

interface ModelColorWiseImageFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormData) => void
  initialData?: ModelColorWiseImage
}

export function ModelColorWiseImageForm({ open, onOpenChange, onSubmit, initialData }: ModelColorWiseImageFormProps) {
  const [formData, setFormData] = useState({
    vehicle_model_id: "",
    color_1_id: "",
    color_2_id: "",
    image: null as File | null,
  })

  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [externalBaseColours, setExternalBaseColours] = useState<Color[]>([])
  const [externalDecalsColours, setExternalDecalsColours] = useState<Color[]>([])

  const getAuthToken = () => {
    return localStorage.getItem("authToken") || ""
  }

  // Fetch vehicle models and colors by type
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const token = getAuthToken()

        const requestOptions: RequestInit = {
          method: "GET",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            "Content-Type": "application/json",
          },
        }

        const [modelsResponse, colorsResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/models`, requestOptions),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/colors?type_wise=type_wise`, requestOptions),
        ])

        if (modelsResponse.ok) {
          const modelsData = await modelsResponse.json()
          setVehicleModels(modelsData.data?.data || modelsData.data || [])
        } else {
          throw new Error("Failed to fetch vehicle models")
        }

        if (colorsResponse.ok) {
          const colorsData = await colorsResponse.json()
          // Extract colors by type from the grouped response
          setExternalBaseColours(colorsData["External Base Colours"] || [])
          setExternalDecalsColours(colorsData["External Decals Colours"] || [])
          // Also set the combined colors array for backward compatibility
          const allColors = [
            ...(colorsData["External Base Colours"] || []),
            ...(colorsData["External Decals Colours"] || []),
          ]
          setColors(allColors)
        } else {
          throw new Error("Failed to fetch colors")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to fetch data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (open) {
      fetchData()
    }
  }, [open])

  useEffect(() => {
    if (initialData) {
      setFormData({
        vehicle_model_id: initialData.vehicle_model_id.toString(),
        color_1_id: initialData.color_1_id.toString(),
        color_2_id: initialData.color_2_id.toString(),
        image: null,
      })
      // Set preview for existing image
      if (initialData.image) {
        setImagePreview(`${import.meta.env.VITE_BACKEND_URL}/${initialData.image}`)
      }
    } else {
      setFormData({
        vehicle_model_id: "",
        color_1_id: "",
        color_2_id: "",
        image: null,
      })
      setImagePreview(null)
    }
    setErrors({})
  }, [initialData, open])

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

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
      setImagePreview(initialData ? `${import.meta.env.VITE_BACKEND_URL}/${initialData.image}` : null)
    }

    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.vehicle_model_id) {
      newErrors.vehicle_model_id = "Vehicle model is required"
    }

    if (!formData.color_1_id) {
      newErrors.color_1_id = "External Base Colour is required"
    }

    if (!formData.color_2_id) {
      newErrors.color_2_id = "External Decals Colour is required"
    }

    if (!initialData && !formData.image) {
      newErrors.image = "Image is required"
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
    submitData.append("vehicle_model_id", formData.vehicle_model_id)
    submitData.append("color_1_id", formData.color_1_id)
    submitData.append("color_2_id", formData.color_2_id)
    if (formData.image) {
      submitData.append("image", formData.image)
    }

    onSubmit(submitData)

    // Reset form
    setFormData({
      vehicle_model_id: "",
      color_1_id: "",
      color_2_id: "",
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

  const selectedVehicleModel = vehicleModels.find((model) => model.id.toString() === formData.vehicle_model_id)
  const selectedColor1 = externalBaseColours.find((color) => color.id.toString() === formData.color_1_id)
  const selectedColor2 = externalDecalsColours.find((color) => color.id.toString() === formData.color_2_id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Model Color Wise Image" : "Add New Model Color Wise Image"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle_model_id">Vehicle Model *</Label>
              <Select
                value={formData.vehicle_model_id}
                onValueChange={(value) => handleSelectChange("vehicle_model_id", value)}
                disabled={loading}
              >
                <SelectTrigger className={errors.vehicle_model_id ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Vehicle Model" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleModels.map((model) => (
                    <SelectItem key={model.id} value={model.id.toString()}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vehicle_model_id && <p className="text-sm text-red-500">{errors.vehicle_model_id}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color_1_id">External Base Colours *</Label>
              <Select
                value={formData.color_1_id}
                onValueChange={(value) => handleSelectChange("color_1_id", value)}
                disabled={loading}
              >
                <SelectTrigger className={errors.color_1_id ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select External Base Colour" />
                </SelectTrigger>
                <SelectContent>
                  {externalBaseColours.map((color) => (
                    <SelectItem key={color.id} value={color.id.toString()}>
                      <div className="flex items-center gap-2">
                        {color.image && (
                          <img
                            src={`${import.meta.env.VITE_BACKEND_URL}/${color.image}`}
                            alt={color.name}
                            className="w-4 h-4 rounded object-cover border"
                          />
                        )}
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.color_1_id && <p className="text-sm text-red-500">{errors.color_1_id}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color_2_id">External Decals Colours *</Label>
            <Select
              value={formData.color_2_id}
              onValueChange={(value) => handleSelectChange("color_2_id", value)}
              disabled={loading}
            >
              <SelectTrigger className={errors.color_2_id ? "border-red-500" : ""}>
                <SelectValue placeholder="Select External Decals Colour" />
              </SelectTrigger>
              <SelectContent>
                {externalDecalsColours.map((color) => (
                  <SelectItem key={color.id} value={color.id.toString()}>
                    <div className="flex items-center gap-2">
                      {color.image && (
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}/${color.image}`}
                          alt={color.name}
                          className="w-4 h-4 rounded object-cover border"
                        />
                      )}
                      {color.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.color_2_id && <p className="text-sm text-red-500">{errors.color_2_id}</p>}
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
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-32 h-24 rounded object-cover border"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-500 hover:bg-red-600" disabled={loading}>
              {loading ? "Loading..." : initialData ? "Update" : "Add"} Image
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
