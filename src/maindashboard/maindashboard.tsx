"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Plus, Eye, Pencil, Trash2, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "react-toastify"
import { ModelForm } from "./components/AddEditeModelForm"

interface Model {
  id: number
  name: string
  sleep_person: string
  description: string
  inner_image: string
  outer_image: string
  category_id: string
  base_price: string
  price: string
  created_at: string
  updated_at: string
  category?: { name: string } | string
  status?: string
}

export default function MainDashboard() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentModel, setCurrentModel] = useState<Model | null>(null)

  const itemsPerPage = 10

  const getAuthToken = () => {
    return localStorage.getItem("authToken") || "" // Return empty string if token not found
  }


  useEffect(() => {
    fetchModels()
  }, [currentPage])

  const fetchModels = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/models`, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch models")
      }

      const data = await response.json()

      // Make sure the data structure matches what you expect
      const modelsData = data.data?.data || data.data || data
      setModels(modelsData)

      // Set total items based on the response
      setTotalItems(data.data?.total || modelsData.length)
    } catch (error) {
      console.error("Error fetching models:", error)
      toast.error("Failed to fetch models")
    } finally {
      setLoading(false)
    }
  }




  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === models.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(models.map((model) => model.id))
    }
  }

  const toggleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const handleAddModel = async (data: FormData) => {
    try {
      const token = getAuthToken()

      const requestOptions: RequestInit = {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // Do not set Content-Type for FormData, browser will set it
        },
        body: data,
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/models`, requestOptions)

      if (!response.ok) {
        const errorData = await response.text()
        console.error("API Error:", errorData)
        throw new Error(`Failed to create model: ${response.status}`)
      }

      const responseData = await response.json()
      fetchModels()
      setIsAddModalOpen(false)
      toast.success("Model created successfully")
      return responseData
    } catch (error) {
      console.error("Error creating model:", error)
      toast.error("Failed to create model")
      throw error
    }
  }

  const handleEditModel = async (formData: FormData) => {
    if (!currentModel) return

    try {
      const token = getAuthToken()

      // Create a new FormData and add all text fields
      const submitData = new FormData()

      // Always send all text fields (required fields with fallbacks to current values)
      submitData.append("name", formData.get("name") || currentModel.name)
      submitData.append("sleep_person", formData.get("sleep_person") || currentModel.sleep_person)
      submitData.append("description", formData.get("description") || currentModel.description)
      submitData.append("category_id", formData.get("category_id") || currentModel.category_id)
      submitData.append("base_price", formData.get("base_price") || currentModel.base_price)
      submitData.append("price", formData.get("price") || currentModel.price)

      // Optional text fields - always send (empty string if not provided)
      submitData.append("status", formData.get("status") || currentModel.status || "")

      // Handle image fields - only send if new file is uploaded
      const imageFields = [
        "inner_image",
        "outer_image", // Assuming you have an outer_image field
        // Add other image fields if you have them, like:
        // "outer_image",
        // "gallery_images",
      ]

      imageFields.forEach((field) => {
        const file = formData.get(field)
        // Only append image field if a new file was actually uploaded
        if (file instanceof File && file.size > 0) {
          submitData.append(field, file)
        }
        // Don't send anything for this field if no new file was uploaded
      })

      // Add _method for Laravel PUT request
      submitData.append("_method", "PUT")

      // Debug: Log what's being sent
      console.log("Submitting text fields and new images only:", Object.fromEntries(submitData.entries()))

      const requestOptions: RequestInit = {
        method: "POST", // Laravel requires POST with _method=PUT for file uploads
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: submitData,
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/models/${currentModel.id}?_method=PUT`, requestOptions)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error:", errorData)
        throw new Error(`Failed to update model: ${response.status}`)
      }

      const responseData = await response.json()
      console.log("API Response:", responseData)

      fetchModels()
      setIsEditModalOpen(false)
      setCurrentModel(null)
      toast.success("Model updated successfully")
      return responseData
    } catch (error) {
      console.error("Error updating model:", error)
      toast.error("Failed to update model")
      throw error
    }
  }

  const handleDeleteModel = async (id: number) => {

    try {
      const token = getAuthToken()
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/models/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete model")
      }

      fetchModels()
      toast.success("Model deleted successfully")
    } catch (error) {
      console.error("Error deleting model:", error)
      toast.error("Failed to delete model")
    }
  }

  const openEditModal = (model: Model) => {
    setCurrentModel(model)
    setIsEditModalOpen(true)
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof model.category === "string"
        ? model.category.toLowerCase().includes(searchQuery.toLowerCase())
        : typeof model.category === "object" && model.category !== null && "name" in model.category
        ? model.category.name.toLowerCase().includes(searchQuery.toLowerCase())
        : false),
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Model</h1>
          <div className="text-sm text-muted-foreground">Dashboard / Model</div>
        </div>
        <Button className="cursor-pointer" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Model
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search models..." className="pl-8" value={searchQuery} onChange={handleSearch} />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedItems.length === models.length && models.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sleep person</TableHead>
              <TableHead>Added</TableHead>
              <TableHead>Base_price</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Auction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell colSpan={7} className="h-16 text-center">
                    <div className="h-6 w-full animate-pulse bg-muted rounded"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredModels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No models found.
                </TableCell>
              </TableRow>
            ) : (
              filteredModels.map((model) => (
                <TableRow key={model.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(model.id)}
                      onCheckedChange={() => toggleSelectItem(model.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="h-12 w-12 rounded overflow-hidden border">
                      <img
                        src={
                          model.outer_image
                            ? `${import.meta.env.VITE_BACKEND_URL}/${model.outer_image}`
                            : `/placeholder.svg?height=60&width=60&query=${model.name}`
                        }
                        alt={model.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{model.name}</TableCell>
                  <TableCell>
                    {typeof model.category === "object" && model.category !== null
                      ? model.category.name
                      : model.category_id}
                  </TableCell>
                  <TableCell>{model.sleep_person}</TableCell>
                  <TableCell>{new Date(model.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>${model.base_price}</TableCell>
                  <TableCell>${model.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Edit" onClick={() => openEditModal(model)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDeleteModel(model.id)}>
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
          {totalItems}
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
            // Show pages around current page
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

      {/* Add Model Modal */}
      <ModelForm open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onSubmit={handleAddModel} />

      {/* Edit Model Modal */}
      {currentModel && (
        <ModelForm
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          initialData={currentModel}
          onSubmit={handleEditModel}
        />
      )}
    </div>
  )
}
