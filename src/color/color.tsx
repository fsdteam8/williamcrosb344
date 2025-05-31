"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { ColorForm } from "./components/color-form"
import { toast } from "react-toastify"

interface Color {
  id: number
  name: string
  code: string | null
  image: string | null
  status: string
  type: string | null
  created_at: string
  updated_at: string
}

interface ApiResponse {
  success: boolean
  message: string
  data: {
    current_page: number
    data: Color[]
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

export default function Color() {
  const [colors, setColors] = useState<Color[]>([])
  const [filteredColors, setFilteredColors] = useState<Color[]>([])
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
  const [currentColor, setCurrentColor] = useState<Color | null>(null)

  const getAuthToken = useCallback(() => {
    return localStorage.getItem("authToken") || ""
  }, [])


  // Fetch colors
  // Memoize fetchColors with useCallback
  const fetchColors = useCallback(async (page = 1) => {
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

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/colors?page=${page}`, requestOptions)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      if (data.success) {
        setColors(data.data.data)
        setFilteredColors(data.data.data)
        setTotalPages(data.total_pages)
        setTotalItems(data.total)
        setCurrentPage(data.current_page)
      } else {
        throw new Error(data.message || "Failed to fetch colors")
      }
    } catch (error) {
      console.error("Error fetching colors:", error)
      toast.error("Failed to fetch colors")
      setCurrentPage(1)
    } finally {
      setLoading(false)
    }
  }, [getAuthToken]) // Empty dependency array since we only use setState functions

  // Then update the useEffect
  useEffect(() => {
    fetchColors(currentPage)
  }, [currentPage, fetchColors]) // Now includes fetchColors in dependencies

  // Search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    const filtered = colors.filter(
      (color) =>
        color.name.toLowerCase().includes(query) ||
        (color.code && color.code.toLowerCase().includes(query)) ||
        (color.type && color.type.toLowerCase().includes(query)) ||
        color.status.toLowerCase().includes(query),
    )
    setFilteredColors(filtered)
  }

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredColors.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredColors.map((color) => color.id))
    }
  }

  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  // Add new color
  const handleAddColor = async (formData: FormData) => {
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

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/colors`, requestOptions)

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to parse as JSON, but handle non-JSON responses
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
          } else {
            // If not JSON, get text instead
            const errorText = await response.text()
            console.error("Non-JSON error response:", errorText.substring(0, 100) + "...")
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError)
        }
        throw new Error(errorMessage)
      }

      // Parse successful response
      let result
      try {
        result = await response.json()
      } catch (parseError) {
        console.error("Error parsing success response:", parseError)
        throw new Error("Invalid response format from server")
      }

      if (result && result.success) {
        setIsAddModalOpen(false)
        fetchColors(currentPage)
        toast.success("Color added successfully")
      } else {
        throw new Error((result && result.message) || "Failed to add color")
      }
    } catch (error) {
      console.error("Error adding color:", error)
      toast.error(error instanceof Error ? error.message : "Failed to add color")
    }
  }

  // Edit color
  const openEditModal = (color: Color) => {
    setCurrentColor(color)
    setIsEditModalOpen(true)
  }

  // Edit color
  const handleEditColor = async (formData: FormData) => {
    if (!currentColor) return

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
            ...(Object.fromEntries((formData as FormData).entries())),
            _method: "PUT",
          }),
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/colors/${currentColor.id}?_method=PUT`,
        requestOptions,
      )

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to parse as JSON, but handle non-JSON responses
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
          } else {
            // If not JSON, get text instead
            const errorText = await response.text()
            console.error("Non-JSON error response:", errorText.substring(0, 100) + "...")
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError)
        }
        throw new Error(errorMessage)
      }

      // Parse successful response
      let result
      try {
        result = await response.json()
      } catch (parseError) {
        console.error("Error parsing success response:", parseError)
        throw new Error("Invalid response format from server")
      }

      if (result && result.success) {
        setIsEditModalOpen(false)
        setCurrentColor(null)
        fetchColors(currentPage)
        toast.success("Color updated successfully")
      } else {
        throw new Error((result && result.message) || "Failed to update color")
      }
    } catch (error) {
      console.error("Error editing color:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update color")
    }
  }

  // Delete single color
  const handleDeleteColor = async (id: number) => {
    try {
      const token = getAuthToken()

      const requestOptions: RequestInit = {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "application/json",
        },
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/colors/${id}`, requestOptions)

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to parse as JSON, but handle non-JSON responses
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
          } else {
            // If not JSON, get text instead
            const errorText = await response.text()
            console.error("Non-JSON error response:", errorText.substring(0, 100) + "...")
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError)
        }
        throw new Error(errorMessage)
      }

      // Parse successful response
      let result
      try {
        result = await response.json()
      } catch (parseError) {
        console.error("Error parsing success response:", parseError)
        throw new Error("Invalid response format from server")
      }

      if (result && result.success) {
        fetchColors(currentPage)
        setSelectedItems((prev) => prev.filter((item) => item !== id))
        toast.success("Color deleted successfully")
      } else {
        throw new Error((result && result.message) || "Failed to delete color")
      }
    } catch (error) {
      console.error("Error deleting color:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete color")
    }
  }

  // Bulk delete
  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} colors?`)) {
      return
    }

    try {
      const token = getAuthToken()

      // Delete colors one by one
      const deletePromises = selectedItems.map(async (id) => {
        const response = await fetch(`{{url}}/api/colors/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Failed to delete color ${id}: ${errorData.message}`)
        }

        return response.json()
      })

      await Promise.all(deletePromises)

      setSelectedItems([])
      fetchColors(currentPage)
      toast.success("Colors deleted successfully")
    } catch (error) {
      console.error("Error bulk deleting colors:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete some colors")
      // Refresh the list even if some deletions failed
      fetchColors(currentPage)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Colors</h1>
          <div className="text-sm text-muted-foreground">Dashboard / Colors</div>
        </div>
        <Button className="cursor-pointer" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Color
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search colors..." className="pl-8" value={searchQuery} onChange={handleSearch} />
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
                  checked={selectedItems.length === filteredColors.length && filteredColors.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created At</TableHead>
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
            ) : filteredColors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No colors found.
                </TableCell>
              </TableRow>
            ) : (
              filteredColors.map((color) => (
                <TableRow key={color.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(color.id)}
                      onCheckedChange={() => toggleSelectItem(color.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{color.id}</TableCell>
                  <TableCell className="font-medium">{color.name}</TableCell>
                  <TableCell>
                    {color.image ? (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/${color.image}`}
                        alt={color.name}
                        className="w-8 h-8 rounded object-cover border"
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm">No image</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {color.type || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(color.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" title="Edit" onClick={() => openEditModal(color)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        onClick={() => handleDeleteColor(color.id)}
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
          {totalItems} colors
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

      {/* Add Color Modal */}
      <ColorForm open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onSubmit={handleAddColor} />

      {/* Edit Color Modal */}
      <ColorForm
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={currentColor || undefined}
        onSubmit={handleEditColor}
      />
    </div>
  )
}
