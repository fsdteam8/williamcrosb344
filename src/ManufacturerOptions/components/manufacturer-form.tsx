"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check, ChevronsUpDown, Loader2, Plus, Search, X } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

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

interface VehicleModel {
  id: number
  name: string
  sleep_person: string
  description: string
  inner_image: string | null
  outer_image: string | null
  category_id: number
  base_price: string
  price: string
  created_at: string
  updated_at: string
  category: {
    id: number
    name: string
    created_at: string
    updated_at: string
  }
}

interface ManufacturerFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void
  initialData?: ManufacturerOption
}

export function ManufacturerForm({ open, onOpenChange, onSubmit, initialData }: ManufacturerFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    vehicle_model_id: "",
    category_name: "",
    type: "Manufacturer Options",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Category states
  const [categories, setCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [categoryOpen, setCategoryOpen] = useState(false)

  // Vehicle states
  const [vehicles, setVehicles] = useState<VehicleModel[]>([])
  const [loadingVehicles, setLoadingVehicles] = useState(false)
  const [vehicleSearch, setVehicleSearch] = useState("")
  const [vehicleOpen, setVehicleOpen] = useState(false)

  // Type states
  const [typeOpen, setTypeOpen] = useState(false)
  const optionTypes = ["Vanari Options", "Manufacturer Options"]

  // Get token from localStorage
  const getToken = useCallback(() => {
    return localStorage.getItem("authToken");
  }, []);

  const getHeaders = useCallback(() => {
    return {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }, [getToken]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
        vehicle_model_id: initialData.vehicle_model_id?.toString() || "",
        category_name: initialData.category_name,
        type: initialData.type || "Manufacturer Options",
      })
    } else {
      setFormData({
        name: "",
        price: "",
        vehicle_model_id: "",
        category_name: "",
        type: "Manufacturer Options",
      })
    }
    setErrors({})
  }, [initialData, open])

  // Fetch categories
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/addtional-options-category`, {
          headers: getHeaders(),
        })
        const data = await response.json()

        if (data.success) {
          setCategories(data.data)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoadingCategories(false)
      }
    }

    if (open) {
      fetchCategories()
    }
  }, [open, getHeaders]) // Added getHeaders to dependencies

  // Fetch vehicles when search changes
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoadingVehicles(true)
        // If no search term, fetch all vehicles, otherwise search with the term
        const searchParam = vehicleSearch.trim() ? `?search=${vehicleSearch}` : ""
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/models${searchParam}`, {
          headers: getHeaders(),
        })
        const data = await response.json()

        if (data.success && data.data) {
          setVehicles(data.data)
        } else {
          setVehicles([])
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error)
        setVehicles([])
      } finally {
        setLoadingVehicles(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchVehicles()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [vehicleSearch, getHeaders]) // Added getHeaders to dependencies

  // Also add an initial fetch when the vehicle dropdown opens
  useEffect(() => {
    if (vehicleOpen && vehicles.length === 0 && !vehicleSearch) {
      const fetchAllVehicles = async () => {
        try {
          setLoadingVehicles(true)
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/models`, {
            headers: getHeaders(),
          })
          const data = await response.json()

          if (data.success && data.data) {
            setVehicles(data.data)
          }
        } catch (error) {
          console.error("Error fetching vehicles:", error)
        } finally {
          setLoadingVehicles(false)
        }
      }

      fetchAllVehicles()
    }
  }, [vehicleOpen, vehicles.length, vehicleSearch, getHeaders]) // Added all missing dependencies

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectCategory = (category: string) => {
    setFormData((prev) => ({ ...prev, category_name: category }))
    setCategoryOpen(false)

    if (errors.category_name) {
      setErrors((prev) => ({ ...prev, category_name: "" }))
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return

    try {
      // Send the new category to the API
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ name: newCategory }),
      })

      const data = await response.json()

      if (data.success) {
        // Add the new category to the list
        setCategories((prev) => [...prev, newCategory])

        // Select the newly created category
        setFormData((prev) => ({ ...prev, category_name: newCategory }))

        // Reset the new category input
        setNewCategory("")
        setCategoryOpen(false)

        if (errors.category_name) {
          setErrors((prev) => ({ ...prev, category_name: "" }))
        }
      } else {
        console.error("Error creating category:", data.message || "Unknown error")
      }
    } catch (error) {
      console.error("Error creating category:", error)
    }
  }

  const handleSelectVehicle = (vehicle: VehicleModel) => {
    setFormData((prev) => ({ ...prev, vehicle_model_id: vehicle.id.toString() }))
    setVehicleOpen(false)
    setVehicleSearch(vehicle.name) // Set search to selected vehicle name

    if (errors.vehicle_model_id) {
      setErrors((prev) => ({ ...prev, vehicle_model_id: "" }))
    }
  }

  const handleSelectType = (type: string) => {
    setFormData((prev) => ({ ...prev, type }))
    setTypeOpen(false)
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

    if (!formData.type.trim()) {
      newErrors.type = "Option type is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const submitData = {
      ...formData,
      price: Number(formData.price).toFixed(2),
      vehicle_model_id: formData.vehicle_model_id ? Number(formData.vehicle_model_id) : null,
    }

    try {
      setIsSubmitting(true)
      // If we have initialData, it's an update operation
      if (initialData) {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/addtional-options/${initialData.id}`, {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(submitData),
        })
      } else {
        // Otherwise it's a create operation
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/addtional-options`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(submitData),
        })
      }

      // Call the onSubmit callback to handle UI updates
      onSubmit(submitData)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
      onOpenChange(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setFormData({
      name: "",
      price: "",
      vehicle_model_id: "",
      category_name: "",
      type: "Manufacturer Options",
    })
    setErrors({})
    setVehicleSearch("")
    setNewCategory("")
  }

  // Find the selected vehicle name
  const selectedVehicle = vehicles.find((v) => v.id.toString() === formData.vehicle_model_id)?.name || ""

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
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
            <Label htmlFor="category_name">Category *</Label>
            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={categoryOpen}
                  className={cn("w-full justify-between", errors.category_name ? "border-red-500" : "")}
                >
                  {formData.category_name || "Select category"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search category..." />
                  <CommandList>
                    <CommandEmpty>
                      <div className="p-2">
                        <p className="text-sm text-muted-foreground">No category found.</p>
                        <div className="flex items-center mt-2">
                          <Input
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Create new category"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            size="sm"
                            className="ml-2"
                            onClick={handleCreateCategory}
                            disabled={!newCategory.trim()}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CommandEmpty>
                    <CommandGroup>
                      {loadingCategories ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Loading categories...</span>
                        </div>
                      ) : (
                        categories.map((category) => (
                          <CommandItem key={category} value={category} onSelect={() => handleSelectCategory(category)}>
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.category_name === category ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {category}
                          </CommandItem>
                        ))
                      )}
                    </CommandGroup>
                    <div className="p-2 border-t">
                      <div className="flex items-center">
                        <Input
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="Create new category"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          size="sm"
                          className="ml-2"
                          onClick={handleCreateCategory}
                          disabled={!newCategory.trim()}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.category_name && <p className="text-sm text-red-500">{errors.category_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicle_model_id">Vehicle Model</Label>
            <Popover open={vehicleOpen} onOpenChange={setVehicleOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={vehicleOpen}
                  className="w-full justify-between"
                >
                  {selectedVehicle || "Search and select vehicle"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <div className="flex items-center border-b px-3">
                    <Search className="h-4 w-4 shrink-0 opacity-50 mr-2" />
                    <CommandInput
                      placeholder="Search vehicles by name..."
                      value={vehicleSearch}
                      onValueChange={setVehicleSearch}
                      className="border-0 focus:ring-0"
                    />
                    {vehicleSearch && (
                      <Button variant="ghost" size="sm" onClick={() => setVehicleSearch("")} className="h-6 w-6 p-0">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <CommandList>
                    <CommandEmpty>
                      {loadingVehicles ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Loading vehicles...</span>
                        </div>
                      ) : vehicleSearch ? (
                        <p className="p-2 text-sm text-muted-foreground">No vehicles found for "{vehicleSearch}"</p>
                      ) : (
                        <p className="p-2 text-sm text-muted-foreground">No vehicles available</p>
                      )}
                    </CommandEmpty>
                    <CommandGroup>
                      {vehicles.map((vehicle) => (
                        <CommandItem
                          key={vehicle.id}
                          value={vehicle.name}
                          onSelect={() => handleSelectVehicle(vehicle)}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.vehicle_model_id === vehicle.id.toString() ? "opacity-100" : "opacity-0",
                            )}
                          />
                          <div className="flex-1">
                            <p className="font-medium">{vehicle.name}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Category: {vehicle.category?.name || "N/A"}</span>
                              <span>Price: ${vehicle.price}</span>
                              <span>Sleep: {vehicle.sleep_person} person(s)</span>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.vehicle_model_id && <p className="text-sm text-red-500">{errors.vehicle_model_id}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Option Type *</Label>
            <Popover open={typeOpen} onOpenChange={setTypeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={typeOpen}
                  className={cn("w-full justify-between", errors.type ? "border-red-500" : "")}
                >
                  {formData.type || "Select option type"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {optionTypes.map((type) => (
                        <CommandItem key={type} value={type} onSelect={() => handleSelectType(type)}>
                          <Check className={cn("mr-2 h-4 w-4", formData.type === type ? "opacity-100" : "opacity-0")} />
                          {type}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {initialData ? "Updating..." : "Adding..."}
                </>
              ) : (
                `${initialData ? "Update" : "Add"} Option`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
