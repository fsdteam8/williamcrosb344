"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { ModelColorWiseImageForm } from "./components/model-color-wise-image-form"

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

  // Fetch model color wise images
  const fetchModelColorImages = async (page = 1) => {
    try {
      setLoading(true)
      const response = await fetch(`https://ben10.scaleupdevagency.com/api/model-color-wise-image?page=${page}`)
      const data: ApiResponse = await response.json()

      if (data.success) {
        setModelColorImages(data.data.data)
        setFilteredImages(data.data.data)
        setTotalPages(data.total_pages)
        setTotalItems(data.total)
        setCurrentPage(data.current_page)
      }
    } catch (error) {
      console.error("Error fetching model color wise images:", error)
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
      const response = await fetch("https://ben10.scaleupdevagency.com/api/model-color-wise-image", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setIsAddModalOpen(false)
        fetchModelColorImages(currentPage)
      }
    } catch (error) {
      console.error("Error adding model color wise image:", error)
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
      const response = await fetch(
        `https://ben10.scaleupdevagency.com/api/model-color-wise-image/${currentImage.id}?_method=PUT`,
        {
          method: "POST",
          body: formData,
        },
      )

      if (response.ok) {
        setIsEditModalOpen(false)
        setCurrentImage(null)
        fetchModelColorImages(currentPage)
      }
    } catch (error) {
      console.error("Error editing model color wise image:", error)
    }
  }

  // Delete single model color wise image
  const handleDeleteImage = async (id: number) => {
    if (confirm("Are you sure you want to delete this model color wise image?")) {
      try {
        const response = await fetch(`https://ben10.scaleupdevagency.com/api/model-color-wise-image/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          fetchModelColorImages(currentPage)
          setSelectedItems((prev) => prev.filter((item) => item !== id))
        }
      } catch (error) {
        console.error("Error deleting model color wise image:", error)
      }
    }
  }

  // Bulk delete
  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedItems.length} model color wise images?`)) {
      try {
        await Promise.all(
          selectedItems.map((id) =>
            fetch(`https://ben10.scaleupdevagency.com/api/model-color-wise-image/${id}`, {
              method: "DELETE",
            }),
          ),
        )
        setSelectedItems([])
        fetchModelColorImages(currentPage)
      } catch (error) {
        console.error("Error bulk deleting model color wise images:", error)
      }
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
              <TableHead>Updated At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell colSpan={9} className="h-16 text-center">
                    <div className="h-6 w-full animate-pulse bg-muted rounded"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredImages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
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
                    <div>
                      <p className="font-medium">{item.color1.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {item.color1.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.color2.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {item.color2.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.image ? (
                      <img
                        src={`https://ben10.scaleupdevagency.com/${item.image}`}
                        alt="Model Color Image"
                        className="w-16 h-12 rounded object-cover border"
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm">No image</span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(item.updated_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        className="cursor-pointer"
                        size="icon"
                        title="Edit"
                        onClick={() => openEditModal(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        onClick={() => handleDeleteImage(item.id)}
                        className="hover:text-red-600 cursor-pointer"
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
