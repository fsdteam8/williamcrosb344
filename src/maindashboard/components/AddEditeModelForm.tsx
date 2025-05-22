"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"

const modelFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  sleep_person: z.string().min(1, { message: "Sleep person is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  inner_image: z.string().optional(),
  category_id: z.string().min(1, { message: "Category is required." }),
  base_price: z.string().min(1, { message: "Base price is required." }),
  price: z.string().min(1, { message: "Price is required." }),
})

type ModelFormValues = z.infer<typeof modelFormSchema>

interface ModelFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: ModelFormValues & { id?: number }
  onSubmit: (values: ModelFormValues) => Promise<void>
}

export function ModelForm({ open, onOpenChange, initialData, onSubmit }: ModelFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!initialData?.id

  const defaultValues: Partial<ModelFormValues> = {
    name: "",
    sleep_person: "",
    description: "",
    inner_image: "",
    category_id: "1", // Default category
    base_price: "",
    price: "",
    ...initialData,
  }

  const form = useForm<ModelFormValues>({
    resolver: zodResolver(modelFormSchema),
    defaultValues,
  })

  async function handleSubmit(values: ModelFormValues) {
    setIsSubmitting(true)
    try {
      await onSubmit(values)
      form.reset()
      onOpenChange(false)
      toast.success(isEditing ? "Model updated successfully" : "Model created successfully")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to submit form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Model" : "Add New Model"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the details of your model here." : "Fill in the details to create a new model."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter model name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sleep_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sleep Person</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Number of people" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter model description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inner_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Image URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Category ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="base_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Base price" {...field} />
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
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="bg-red-500 hover:bg-red-600" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEditing ? "Update Model" : "Create Model"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
