"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ManufacturerOption {
  id: number
  name: string
  price: string
  vehicle_model_id: number | null
  category_name: string
  type: string
  created_at: string
  updated_at: string
}

interface ManufacturerFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
  initialData?: ManufacturerOption
}

export function ManufacturerForm({ open, onOpenChange, onSubmit, initialData }: ManufacturerFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    vehicle_model_id: "",
    category_name: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [colorTypes, setColorTypes] = useState<string[]>([])
  const [loadingTypes, setLoadingTypes] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
        vehicle_model_id: initialData.vehicle_model_id?.toString() || "",
        category_name: initialData.category_name,
      })
    } else {
      setFormData({
        name: "",
        price: "",
        vehicle_model_id: "",
        category_name: "",
      })
    }
    setErrors({})
  }, [initialData, open])

  // Fetch color types
  useEffect(() => {
    const fetchColorTypes = async () => {
      try {
        setLoadingTypes(true)
        const response = await fetch("https://ben10.scaleupdevagency.com/api/colors-types")
        const data = await response.json()

        if (data.success) {
          // Filter out null values and ensure we have strings
          const types = data.data.filter((type: any) => type !== null && type !== "")
          setColorTypes(types)
        }
      } catch (error) {
        console.error("Error fetching color types:", error)
      } finally {
        setLoadingTypes(false)
      }
    }

    if (open) {
      fetchColorTypes()
    }
  }, [open])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = "Price must be a valid positive number"
    }

    if (!formData.category_name.trim()) {
      newErrors.category_name = "Category name is required"
    }

    if (
      formData.vehicle_model_id &&
      (isNaN(Number(formData.vehicle_model_id)) || Number(formData.vehicle_model_id) < 1)
    ) {
      newErrors.vehicle_model_id = "Vehicle model ID must be a valid positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const submitData = {
      ...formData,
      price: Number(formData.price).toFixed(2),
      vehicle_model_id: formData.vehicle_model_id ? Number(formData.vehicle_model_id) : null,
    }

    onSubmit(submitData)
  }

  const handleClose = () => {
    onOpenChange(false)
    setFormData({
      name: "",
      price: "",
      vehicle_model_id: "",
      category_name: "",
    })
    setErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Manufacturer Option" : "Add New Manufacturer Option"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter option name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_name">Category Name *</Label>
            <select
              id="category_name"
              value={formData.category_name}
              onChange={(e) => handleSelectChange("category_name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category_name ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loadingTypes}
            >
              <option value="">Select Category</option>
              {colorTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.category_name && <p className="text-sm text-red-500">{errors.category_name}</p>}
            {loadingTypes && <p className="text-sm text-muted-foreground">Loading categories...</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicle_model_id">Vehicle Model ID</Label>
            <Input
              id="vehicle_model_id"
              name="vehicle_model_id"
              type="number"
              min="1"
              value={formData.vehicle_model_id}
              onChange={handleInputChange}
              placeholder="Enter vehicle model ID (optional)"
              className={errors.vehicle_model_id ? "border-red-500" : ""}
            />
            {errors.vehicle_model_id && <p className="text-sm text-red-500">{errors.vehicle_model_id}</p>}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-500 hover:bg-red-600">
              {initialData ? "Update" : "Add"} Option
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
