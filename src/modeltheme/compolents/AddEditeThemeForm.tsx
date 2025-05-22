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
import { toast } from "react-hot-toast"

const themeFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  image: z.string().min(1, { message: "Image URL is required." }),
  flooring_name: z.string().min(1, { message: "Flooring name is required." }),
  flooring_image: z.string().min(1, { message: "Flooring image URL is required." }),
  cabinetry_1_name: z.string().min(1, { message: "Cabinetry name is required." }),
  cabinetry_1_image: z.string().min(1, { message: "Cabinetry image URL is required." }),
  table_top_1_name: z.string().min(1, { message: "Table top name is required." }),
  table_top_1_image: z.string().min(1, { message: "Table top image URL is required." }),
  seating_1_name: z.string().min(1, { message: "Seating name is required." }),
  seating_1_image: z.string().min(1, { message: "Seating image URL is required." }),
})

type ThemeFormValues = z.infer<typeof themeFormSchema>

interface ThemeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: ThemeFormValues & { id?: number }
  onSubmit: (values: ThemeFormValues) => Promise<void>
}

export function ThemeForm({ open, onOpenChange, initialData, onSubmit }: ThemeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!initialData?.id

  const defaultValues: Partial<ThemeFormValues> = {
    name: "",
    image: "",
    flooring_name: "",
    flooring_image: "",
    cabinetry_1_name: "",
    cabinetry_1_image: "",
    table_top_1_name: "",
    table_top_1_image: "",
    seating_1_name: "",
    seating_1_image: "",
    ...initialData,
  }

  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(themeFormSchema),
    defaultValues,
  })

  async function handleSubmit(values: ThemeFormValues) {
    setIsSubmitting(true)
    try {
      await onSubmit(values)
      form.reset()
      onOpenChange(false)
      toast.success(isEditing ? "Theme updated successfully" : "Theme created successfully")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to submit form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Theme" : "Add New Theme"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the details of your theme here." : "Fill in the details to create a new theme."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter theme name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter theme image URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="flooring_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flooring Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter flooring name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="flooring_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flooring Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter flooring image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cabinetry_1_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cabinetry Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter cabinetry name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cabinetry_1_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cabinetry Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter cabinetry image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="table_top_1_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Table Top Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter table top name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="table_top_1_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Table Top Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter table top image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="seating_1_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seating Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter seating name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seating_1_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seating Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter seating image URL" {...field} />
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
                {isSubmitting ? "Saving..." : isEditing ? "Update Theme" : "Create Theme"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
