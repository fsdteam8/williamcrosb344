"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-hot-toast"

// UI Components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { VehicleModel } from "@/lib/types"

// Form Schema - Made images completely optional
const modelFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  sleep_person: z.string().min(1, { message: "Sleep person is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  inner_image: z.any().optional(),
  outer_image: z.any().optional(),
  category_id: z.string().min(1, { message: "Category is required." }),
  base_price: z.string().min(1, { message: "Base price is required." }),
  price: z.string().min(1, { message: "Price is required." }),
})

type ModelFormValues = z.infer<typeof modelFormSchema>

interface Category {
  id: number
  name: string
}

interface ModelFormProps {
  initialData?: VehicleModel | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormData) => Promise<void>
  isEditing?: boolean
}

export const ModelForm = ({ initialData, open, onOpenChange, onSubmit, isEditing = false }: ModelFormProps) => {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedInnerFile, setSelectedInnerFile] = useState<File | null>(null)
  const [selectedOuterFile, setSelectedOuterFile] = useState<File | null>(null)

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`)
        if (!response.ok) throw new Error("Failed to fetch categories")
        const data = await response.json()

        // Extract categories from the nested response
        const categoriesArray = data?.data?.data || []
        setCategories(categoriesArray)
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast.error("Failed to fetch categories")
        setCategories([])
      }
    }

    if (open) fetchCategories()
  }, [open])

  // Initialize form
  const form = useForm<ModelFormValues>({
    resolver: zodResolver(modelFormSchema),
    defaultValues: {
      name: "",
      sleep_person: "",
      description: "",
      inner_image: undefined,
      outer_image: undefined,
      category_id: "",
      base_price: "",
      price: "",
    },
  })

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        sleep_person: initialData.sleep_person.toString(),
        description: initialData.description,
        inner_image: initialData.inner_image,
        outer_image: initialData.outer_image,
        category_id: initialData.category_id?.toString() || "",
        base_price: initialData.base_price.toString(),
        price: initialData.price.toString(),
      })
    } else {
      form.reset({
        name: "",
        sleep_person: "",
        description: "",
        inner_image: undefined,
        outer_image: undefined,
        category_id: "",
        base_price: "",
        price: "",
      })
      setSelectedInnerFile(null)
      setSelectedOuterFile(null)
    }
  }, [initialData, form, open])

  // Handle form submission
  const handleSubmit = async (values: ModelFormValues) => {
    setLoading(true)
    try {
      const formData = new FormData()

      // Add all non-file fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined && !key.includes('_image')) {
          formData.append(key, String(value))
        }
      })

      // Handle inner image upload
      if (selectedInnerFile) {
        formData.append('inner_image', selectedInnerFile)
      } else if (initialData?.inner_image) {
        // Keep existing image if no new file is selected
        formData.append('inner_image', initialData.inner_image)
      }

      // Handle outer image upload
      if (selectedOuterFile) {
        formData.append('outer_image', selectedOuterFile)
      } else if (initialData?.outer_image) {
        // Keep existing image if no new file is selected
        formData.append('outer_image', initialData.outer_image)
      }

      await onSubmit(formData)

      // Reset form and state on success
      form.reset()
      setSelectedInnerFile(null)
      setSelectedOuterFile(null)
      onOpenChange(false)

      // Show success message
      toast.success(isEditing ? "Model updated successfully" : "Model created successfully")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to submit form. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInnerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedInnerFile(file)
      form.setValue("inner_image", file)
    } else {
      setSelectedInnerFile(null)
      form.setValue("inner_image", undefined)
    }
  }

  const handleOuterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedOuterFile(file)
      form.setValue("outer_image", file)
    } else {
      setSelectedOuterFile(null)
      form.setValue("outer_image", undefined)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="max-h-[80vh] overflow-y-auto pr-2">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Model" : "Create Model"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Edit your model details." : "Add a new model to your store."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Model name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sleep Person Field */}
              <FormField
                control={form.control}
                name="sleep_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sleep Capacity</FormLabel>
                    <FormControl>
                      <Input placeholder="Number of sleepers" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Detailed description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category Field */}
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price Fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="base_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale Price</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Inner Image Upload Field */}
              <FormField
                control={form.control}
                name="inner_image"
                render={() => (
                  <FormItem>
                    <FormLabel>Outer Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleInnerFileChange}
                          className="cursor-pointer"
                        />

                        <div className="flex flex-col items-center gap-2">
                          {selectedInnerFile ? (
                            <div className="relative">
                              <img
                                src={URL.createObjectURL(selectedInnerFile)}
                                alt="Selected inner preview"
                                className="h-40 w-40 rounded-md object-cover"
                              />
                              <p className="text-sm text-muted-foreground mt-2">Selected: {selectedInnerFile.name}</p>
                            </div>
                          ) : initialData?.inner_image ? (
                            <div className="relative">
                              <img
                                src={`${import.meta.env.VITE_BACKEND_URL}/${initialData.inner_image}`}
                                alt="Current inner model"
                                className="h-40 w-40 rounded-md object-cover"
                              />
                              <p className="text-sm text-muted-foreground mt-2">Current Inner Image</p>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Outer Image Upload Field */}
              <FormField
                control={form.control}
                name="outer_image"
                render={() => (
                  <FormItem>
                    <FormLabel>Model Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleOuterFileChange}
                          className="cursor-pointer"
                        />

                        <div className="flex flex-col items-center gap-2">
                          {selectedOuterFile ? (
                            <div className="relative">
                              <img
                                src={URL.createObjectURL(selectedOuterFile)}
                                alt="Selected outer preview"
                                className="h-40 w-40 rounded-md object-cover"
                              />
                              <p className="text-sm text-muted-foreground mt-2">Selected: {selectedOuterFile.name}</p>
                            </div>
                          ) : initialData?.outer_image ? (
                            <div className="relative">
                              <img
                                src={`${import.meta.env.VITE_BACKEND_URL}/${initialData.outer_image}`}
                                alt="Current outer model"
                                className="h-40 w-40 rounded-md object-cover"
                              />
                              <p className="text-sm text-muted-foreground mt-2">Current Outer Image</p>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer"
                >
                  {loading ? "Saving..." : isEditing ? "Update Model" : "Create Model"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}