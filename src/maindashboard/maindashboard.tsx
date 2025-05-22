"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Filter, Plus, Eye, Pencil, Trash2, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ModelForm } from "./components/AddEditeModelForm"
import toast from "react-hot-toast"

interface Model {
  id: number
  name: string
  sleep_person: string
  description: string
  inner_image: string
  category_id: string
  base_price: string
  price: string
  created_at: string
  updated_at: string
  category?: string
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

  useEffect(() => {
    fetchModels()
  }, [currentPage])

  const fetchModels = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://ben10.scaleupdevagency.com/api/models`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch models")
      }

      const data = await response.json()
      setModels(data.data.data)

      // Assuming the API returns data in a standard format
      // If not, you'll need to adjust this based on the actual response structure
    

    } catch (error) {
      console.error("Error fetching models:", error)
      // Use placeholder 
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // In a real app, you might want to debounce this and fetch filtered results
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

  const handleAddModel = async (formData: any) => {
    try {
      const response = await fetch("https://ben10.scaleupdevagency.com/api/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create model")
      }

      const data = await response.json()

      // Refresh the models list
      fetchModels()

      return data
    } catch (error) {
      console.error("Error creating model:", error)
      throw error
    }
  }

  const handleEditModel = async (formData: any) => {
    if (!currentModel) return

    try {
      const response = await fetch(`https://ben10.scaleupdevagency.com/api/models/${currentModel.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update model")
      }

      const data = await response.json()

      // Refresh the models list
      fetchModels()

      return data
    } catch (error) {
      console.error("Error updating model:", error)
      throw error
    }
  }

  const handleDeleteModel = async (id: number) => {
    if (!confirm("Are you sure you want to delete this model?")) return

    try {
      const response = await fetch(`https://ben10.scaleupdevagency.com/api/models/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete model")
      }

      // Refresh the models list
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
      model.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Model</h1>
          <div className="text-sm text-muted-foreground">Dashboard / Model</div>
        </div>
        <Button className="bg-red-500 hover:bg-red-600" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Model
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search models..." className="pl-8" value={searchQuery} onChange={handleSearch} />
        </div>
        <DropdownMenu>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>All Categories</DropdownMenuItem>
            <DropdownMenuItem>Pattern Collection</DropdownMenuItem>
            <DropdownMenuItem>Published</DropdownMenuItem>
            <DropdownMenuItem>Draft</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
              <TableHead>Tiles</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Added</TableHead>
              <TableHead>Action</TableHead>
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
                        src={model.inner_image || `/placeholder.svg?height=60&width=60&query=${model.name}`}
                        alt={model.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{model.name}</TableCell>
                  <TableCell>{model.category || "Pattern Collection"}</TableCell>
                  <TableCell>
                    <Badge variant={model.status === "Published" ? "outline" : "secondary"}>
                      {model.status || "Published"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(model.created_at).toLocaleDateString()}</TableCell>
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
          Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} from{" "}
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
      <ModelForm
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={currentModel || undefined}
        onSubmit={handleEditModel}
      />
    </div>
  )
}
