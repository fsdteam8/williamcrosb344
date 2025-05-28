"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface VehicleModel {
  id: number
  name: string
}

interface Color {
  id: number
  name: string
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

  // Fetch vehicle models and colors
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [modelsResponse, colorsResponse] = await Promise.all([
          fetch("https://ben10.scaleupdevagency.com/api/models"),
          fetch("https://ben10.scaleupdevagency.com/api/colors"),
        ])

        if (modelsResponse.ok) {
          const modelsData = await modelsResponse.json()
          setVehicleModels(modelsData.data?.data || modelsData.data || [])
        }

        if (colorsResponse.ok) {
          const colorsData = await colorsResponse.json()
          setColors(colorsData.data?.data || colorsData.data || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
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
    } else {
      setFormData({
        vehicle_model_id: "",
        color_1_id: "",
        color_2_id: "",
        image: null,
      })
    }
    setErrors({})
  }, [initialData, open])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, image: file }))

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
      newErrors.color_1_id = "Color 1 is required"
    }

    if (!formData.color_2_id) {
      newErrors.color_2_id = "Color 2 is required"
    }

    if (formData.color_1_id === formData.color_2_id && formData.color_1_id) {
      newErrors.color_2_id = "Color 2 must be different from Color 1"
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
  }

  const handleClose = () => {
    onOpenChange(false)
    setFormData({
      vehicle_model_id: "",
      color_1_id: "",
      color_2_id: "",
      image: null,
    })
    setErrors({})
  }

  const selectedVehicleModel = vehicleModels.find((model) => model.id.toString() === formData.vehicle_model_id)
  const selectedColor1 = colors.find((color) => color.id.toString() === formData.color_1_id)
  const selectedColor2 = colors.find((color) => color.id.toString() === formData.color_2_id)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Model Color Wise Image" : "Add New Model Color Wise Image"}</DialogTitle>
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
            <Label htmlFor="color_1_id">Color 1 *</Label>
            <select
              id="color_1_id"
              value={formData.color_1_id}
              onChange={(e) => handleSelectChange("color_1_id", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.color_1_id ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
            >
              <option value="">Select Color 1</option>
              {colors.map((color) => (
                <option key={color.id} value={color.id}>
                  {color.name}
                </option>
              ))}
            </select>
            {errors.color_1_id && <p className="text-sm text-red-500">{errors.color_1_id}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="color_2_id">Color 2 *</Label>
            <select
              id="color_2_id"
              value={formData.color_2_id}
              onChange={(e) => handleSelectChange("color_2_id", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.color_2_id ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
            >
              <option value="">Select Color 2</option>
              {colors
                .filter((color) => color.id.toString() !== formData.color_1_id)
                .map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                  </option>
                ))}
            </select>
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
          </div>

          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="p-4 border rounded-md bg-gray-50">
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Vehicle Model:</span> {selectedVehicleModel?.name || "Not selected"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Color 1:</span> {selectedColor1?.name || "Not selected"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Color 2:</span> {selectedColor2?.name || "Not selected"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Image:</span>{" "}
                  {formData.image ? formData.image.name : initialData ? "Current image" : "No image selected"}
                </p>
              </div>
              {initialData && !formData.image && (
                <div className="mt-3">
                  <img
                    src={`https://ben10.scaleupdevagency.com/${initialData.image}`}
                    alt="Current"
                    className="w-32 h-24 rounded object-cover border"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-500 hover:bg-red-600" disabled={loading}>
              {initialData ? "Update" : "Add"} Image
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
