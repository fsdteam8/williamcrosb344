"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Plus, Pencil, Trash2, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "react-toastify"
import { CategoryForm } from "./_components/category-form"


interface Category {
  id: number
  name: string
  created_at: string
  updated_at: string
}

interface ApiResponse {
  success: boolean
  data: {
    current_page: number
    data: Category[]
    total: number
    per_page: number
    last_page: number
  }
}

export default function ModelCategory() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)

  const itemsPerPage = 10

  const getAuthToken = () => {
    return localStorage.getItem("authToken"); // Must match the key used in setItem
  };

  // Log the token (either by storing it first or directly logging the function call)
  // const token = getAuthToken();
  // console.log(token)


  useEffect(() => {
    fetchCategories()
  }, [currentPage])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const token = getAuthToken()
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }

      const data: ApiResponse = await response.json()

      if (data.success) {
        setCategories(data.data.data)
        setTotalItems(data.data.total)
        setTotalPages(data.data.last_page)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to fetch categories")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === categories.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(categories.map((category) => category.id))
    }
  }

  const toggleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const handleAddCategory = async (formData: { name: string }) => {
    try {
      const token = getAuthToken()
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create category")
      }

      const data = await response.json()

      if (data.success) {
        toast.success("Category created successfully")
        fetchCategories()
        setIsAddModalOpen(false)
      }

      return data
    } catch (error) {
      console.error("Error creating category:", error)
      toast.error("Failed to create category")
      throw error
    }
  }

  const handleEditCategory = async (formData: { name: string }) => {
    if (!currentCategory) return

    try {
      const token = getAuthToken()
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories/${currentCategory.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update category")
      }

      const data = await response.json()

      if (data.success) {
        toast.success("Category updated successfully")
        fetchCategories()
        setIsEditModalOpen(false)
        setCurrentCategory(null)
      }

      return data
    } catch (error) {
      console.error("Error updating category:", error)
      toast.error("Failed to update category")
      throw error
    }
  }

  const handleDeleteCategory = async (id: number) => {

    try {
      const token = getAuthToken()
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete category")
      }

      toast.success("Category deleted successfully")
      fetchCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error("Failed to delete category")
    }
  }

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return

    if (!confirm(`Are you sure you want to delete ${selectedItems.length} categories?`)) return

    try {
      const token = getAuthToken()
      const deletePromises = selectedItems.map((id) =>
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
      )

      await Promise.all(deletePromises)

      toast.success(`${selectedItems.length} categories deleted successfully`)
      setSelectedItems([])
      fetchCategories()
    } catch (error) {
      console.error("Error deleting categories:", error)
      toast.error("Failed to delete categories")
    }
  }

  const openEditModal = (category: Category) => {
    setCurrentCategory(category)
    setIsEditModalOpen(true)
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <div className="text-sm text-muted-foreground">Dashboard / Categories</div>
        </div>
        <Button className="bg-red-500 hover:bg-red-600" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Category
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search categories..." className="pl-8" value={searchQuery} onChange={handleSearch} />
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
                  checked={selectedItems.length === categories.length && categories.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell colSpan={6} className="h-16 text-center">
                    <div className="h-6 w-full animate-pulse bg-muted rounded"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(category.id)}
                      onCheckedChange={() => toggleSelectItem(category.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{new Date(category.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(category.updated_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" className="cursor-pointer" size="icon" title="Edit" onClick={() => openEditModal(category)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        onClick={() => handleDeleteCategory(category.id)}
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
          {totalItems} categories
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

      {/* Add Category Modal */}
      <CategoryForm open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onSubmit={handleAddCategory} />

      {/* Edit Category Modal */}
      <CategoryForm
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={currentCategory || undefined}
        onSubmit={handleEditCategory}
      />
    </div>
  )
}
