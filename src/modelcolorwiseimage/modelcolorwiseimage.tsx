"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { ModelColorWiseImageForm } from "./components/model-color-wise-image-form"
import { toast } from "react-toastify"

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

interface ApiResponse {
  success: boolean
  message: string
  data: {
    current_page: number
    data: ModelColorWiseImage[]
    total: number
    per_page: number
    last_page: number
    first_page_url: string
    last_page_url: string
    next_page_url: string | null
    prev_page_url: string | null
    path: string
    from: number
    to: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
  }
  current_page: number
  total_pages: number
  per_page: number
  total: number
}

export default function ModelColorWiseImage() {
  const [modelColorImages, setModelColorImages] = useState<ModelColorWiseImage[]>([])
  const [filteredImages, setFilteredImages] = useState<ModelColorWiseImage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage] = useState(10)

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState<ModelColorWiseImage | null>(null)

  const getAuthToken = () => {
    return localStorage.getItem("authToken") || ""
  }

  // Fetch model color wise images
  const fetchModelColorImages = async (page = 1) => {
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

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/model-color-wise-image?page=${page}`,
        requestOptions,
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      if (data.success) {
        setModelColorImages(data.data.data)
        setFilteredImages(data.data.data)
        setTotalPages(data.total_pages)
        setTotalItems(data.total)
        setCurrentPage(data.current_page)
      } else {
        throw new Error(data.message || "Failed to fetch model color wise images")
      }
    } catch (error) {
      console.error("Error fetching model color wise images:", error)
      toast.error("Failed to fetch model color wise images. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchModelColorImages(currentPage)
  }, [currentPage])

  // Search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    const filtered = modelColorImages.filter(
      (item) =>
        item.vehicle_model.name.toLowerCase().includes(query) ||
        item.color1.name.toLowerCase().includes(query) ||
        item.color2.name.toLowerCase().includes(query) ||
        item.id.toString().includes(query),
    )
    setFilteredImages(filtered)
  }

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredImages.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredImages.map((item) => item.id))
    }
  }

  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  // Add new model color wise image
  const handleAddImage = async (formData: FormData) => {
    try {
      const token = getAuthToken()
      const isFormData = formData instanceof FormData

      const requestOptions: RequestInit = {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          ...(!isFormData && { "Content-Type": "application/json" }),
        },
        body: isFormData ? formData : JSON.stringify(formData),
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/model-color-wise-image`, requestOptions)

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError)
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()

      if (result && result.success) {
        setIsAddModalOpen(false)
        fetchModelColorImages(currentPage)
        toast.success("Model color wise image added successfully")
      } else {
        throw new Error((result && result.message) || "Failed to add model color wise image")
      }
    } catch (error) {
      console.error("Error adding model color wise image:", error)
      toast.error("Failed to add model color wise image. Please try again later.")
    }
  }

  // Edit model color wise image
  const openEditModal = (item: ModelColorWiseImage) => {
    setCurrentImage(item)
    setIsEditModalOpen(true)
  }

  const handleEditImage = async (formData: FormData) => {
    if (!currentImage) return

    try {
      const token = getAuthToken()
      const isFormData = formData instanceof FormData

      // Add _method=PUT for Laravel method spoofing
      if (isFormData) {
        formData.append("_method", "PUT")
      }

      const requestOptions: RequestInit = {
        method: "POST", // Laravel requires POST with _method=PUT for file uploads
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          ...(!isFormData && { "Content-Type": "application/json" }),
        },
        body: isFormData
          ? formData
          : JSON.stringify({
              ...(Object.fromEntries((formData as any).entries())),
              _method: "PUT",
            }),
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/model-color-wise-image/${currentImage.id}?_method=PUT`,
        requestOptions,
      )

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError)
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()

      if (result && result.success) {
        setIsEditModalOpen(false)
        setCurrentImage(null)
        fetchModelColorImages(currentPage)
        toast.success("Model color wise image updated successfully")
      } else {
        throw new Error((result && result.message) || "Failed to update model color wise image")
      }
    } catch (error) {
      console.error("Error editing model color wise image:", error)
      toast.success("Failed to update model color wise image. Please try again later.")
    }
  }

  // Delete single model color wise image
  const handleDeleteImage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this model color wise image?")) {
      return
    }

    try {
      const token = getAuthToken()

      const requestOptions: RequestInit = {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "application/json",
        },
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/model-color-wise-image/${id}`,
        requestOptions,
      )

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError)
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()

      if (result && result.success) {
        fetchModelColorImages(currentPage)
        setSelectedItems((prev) => prev.filter((item) => item !== id))
        toast.success("Model color wise image deleted successfully")
      } else {
        throw new Error((result && result.message) || "Failed to delete model color wise image")
      }
    } catch (error) {
      console.error("Error deleting model color wise image:", error)
      toast.error("Failed to delete model color wise image. Please try again later.") 
    }
  }

  // Bulk delete
  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} model color wise images?`)) {
      return
    }

    try {
      const token = getAuthToken()

      const deletePromises = selectedItems.map(async (id) => {
        const requestOptions: RequestInit = {
          method: "DELETE",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            "Content-Type": "application/json",
          },
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/model-color-wise-image/${id}`,
          requestOptions,
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Failed to delete image ${id}: ${errorData.message}`)
        }

        return response.json()
      })

      await Promise.all(deletePromises)

      setSelectedItems([])
      fetchModelColorImages(currentPage)
      toast.success("Model color wise images deleted successfully")
    } catch (error) {
      console.error("Error bulk deleting model color wise images:", error)
      toast.error("Failed to delete model color wise images. Please try again later.")
      // Refresh the list even if some deletions failed
      fetchModelColorImages(currentPage)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Model Color Wise Images</h1>
          <div className="text-sm text-muted-foreground">Dashboard / Model Color Wise Images</div>
        </div>
        <Button className="bg-red-500 hover:bg-red-600" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Image
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search model color images..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        {selectedItems.length > 0 && (
          <Button variant="destructive" onClick={handleBulkDelete}>
            Delete Selected ({selectedItems.length})
          </Button>
        )}
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedItems.length === filteredImages.length && filteredImages.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Vehicle Model</TableHead>
              <TableHead>Color 1</TableHead>
              <TableHead>Color 2</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell colSpan={8} className="h-16 text-center">
                    <div className="h-6 w-full animate-pulse bg-muted rounded"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredImages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No model color wise images found.
                </TableCell>
              </TableRow>
            ) : (
              filteredImages.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => toggleSelectItem(item.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.vehicle_model.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {item.vehicle_model.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium">{item.color1.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {item.color1.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium">{item.color2.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {item.color2.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.image ? (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/${item.image}`}
                        alt="Model Color Image"
                        className="w-16 h-12 rounded object-cover border"
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm">No image</span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" title="Edit" onClick={() => openEditModal(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        onClick={() => handleDeleteImage(item.id)}
                        className="hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
          {totalItems} model color wise images
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = i + 1
            if (totalPages > 5 && currentPage > 3) {
              pageNum = currentPage - 3 + i
            }
            if (pageNum > totalPages) return null

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentPage(pageNum)}
                className="w-8 h-8"
              >
                {pageNum}
              </Button>
            )
          })}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="mx-1">...</span>
              <Button variant="outline" size="icon" onClick={() => setCurrentPage(totalPages)} className="w-8 h-8">
                {totalPages}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add Model Color Wise Image Modal */}
      <ModelColorWiseImageForm open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onSubmit={handleAddImage} />

      {/* Edit Model Color Wise Image Modal */}
      <ModelColorWiseImageForm
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={currentImage || undefined}
        onSubmit={handleEditImage}
      />
    </div>
  )
}
