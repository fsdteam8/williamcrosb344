"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Plus, Eye, Pencil, Trash2, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "react-toastify"
import { Card, CardContent } from "@/components/ui/card"
import axios from "axios"
import { ThemeForm } from "./compolents/AddEditeThemeForm"
import { ThemeDetails } from "./compolents/ThemeDetails"

interface Theme {
  id: number
  name: string
  image: string
  flooring_name: string
  flooring_image: string
  cabinetry_1_name: string
  cabinetry_1_image: string
  cabinetry_2_name?: string
  cabinetry_2_image?: string
  table_top_1_name: string
  table_top_1_image: string
  table_top_2_name?: string
  table_top_2_image?: string
  seating_1_name: string
  seating_1_image: string
  seating_2_name?: string
  seating_2_image?: string
  created_at: string
  updated_at: string
}

// Create an Axios instance with default config
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
})

function ModelTheme() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

  console.log(setViewMode)

  const itemsPerPage = 10

  const getAuthToken = () => {
    return localStorage.getItem("authToken") || ""
  }

  // Add a request interceptor to include the token
  api.interceptors.request.use((config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  useEffect(() => {
    fetchThemes()
  }, [currentPage])

  const fetchThemes = async () => {
    setLoading(true)
    try {
      const response = await api.get("/themes")

      // Ensure we're working with the correct data structure
      const themesData = response.data.data.data
      setThemes(Array.isArray(themesData) ? themesData : [])
      setTotalItems(themesData.length || 0)
    } catch (error) {
      console.error("Error fetching themes:", error)
      setThemes([])
      setTotalItems(0)
      toast.error("Failed to load themes")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === themes.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(themes.map((theme) => theme.id))
    }
  }

  const toggleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const handleAddTheme = async (data: FormData) => {
    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      }

      const response = await api.post("/themes", data, config)

      fetchThemes()
      setIsAddModalOpen(false)
      toast.success("Theme created successfully")
      return response.data
    } catch (error) {
      console.error("Error creating theme:", error)
      toast.error("Failed to create theme")
      throw error
    }
  }

  const handleEditTheme = async (formData: FormData) => {
    if (!currentTheme) return

    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      }

      // Create a new FormData and add all text fields
      const submitData = new FormData()

      // Always send all text fields (required and optional)
      submitData.append("name", formData.get("name") || currentTheme.name)
      submitData.append("flooring_name", formData.get("flooring_name") || currentTheme.flooring_name)
      submitData.append("cabinetry_1_name", formData.get("cabinetry_1_name") || currentTheme.cabinetry_1_name)
      submitData.append("table_top_1_name", formData.get("table_top_1_name") || currentTheme.table_top_1_name)
      submitData.append("seating_1_name", formData.get("seating_1_name") || currentTheme.seating_1_name)

      // Optional text fields - always send (empty string if not provided)
      submitData.append("cabinetry_2_name", formData.get("cabinetry_2_name") || currentTheme.cabinetry_2_name || "")
      submitData.append("table_top_2_name", formData.get("table_top_2_name") || currentTheme.table_top_2_name || "")
      submitData.append("seating_2_name", formData.get("seating_2_name") || currentTheme.seating_2_name || "")

      // Handle image fields - only send if new file is uploaded
      const imageFields = [
        "image",
        "flooring_image",
        "cabinetry_1_image",
        "cabinetry_2_image",
        "table_top_1_image",
        "table_top_2_image",
        "seating_1_image",
        "seating_2_image",
      ]

      imageFields.forEach((field) => {
        const file = formData.get(field)
        // Only append image field if a new file was actually uploaded
        if (file instanceof File && file.size > 0) {
          submitData.append(field, file)
        }
        // Don't send anything for this field if no new file was uploaded
      })

      // Debug: Log what's being sent
      console.log("Submitting text fields and new images only:", Object.fromEntries(submitData.entries()))

      const response = await api.post(`/themes/${currentTheme.id}?_method=PUT`, submitData, config)
      fetchThemes()
      setIsEditModalOpen(false)
      toast.success("Theme updated successfully")
      return response.data
    } catch (error) {
      console.error("Error updating theme:", error)
      toast.error("Failed to update theme")
      throw error
    }
  }

  const handleDeleteTheme = async (id: number) => {
    // if (!confirm("Are you sure you want to delete this theme?")) return

    try {
      await api.delete(`/themes/${id}`)

      fetchThemes()
      toast.success("Theme deleted successfully")
    } catch (error) {
      console.error("Error deleting theme:", error)
      toast.error("Failed to delete theme")
    }
  }

  const openViewModal = (theme: Theme) => {
    setCurrentTheme(theme)
    setIsViewModalOpen(true)
  }

  const openEditModal = (theme: Theme) => {
    setCurrentTheme(theme)
    setIsEditModalOpen(true)
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const filteredThemes = Array.isArray(themes)
    ? themes.filter((theme) => theme.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  const getImageUrl = (imagePath: string, fallbackText = "theme") => {
    if (!imagePath) return `/placeholder.svg?height=60&width=60&query=${fallbackText}`
    return `${import.meta.env.VITE_BACKEND_URL}/${imagePath}`
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Themes</h1>
          <div className="text-sm text-muted-foreground">Dashboard / Themes</div>
        </div>
        <Button className="cursor-pointer" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Theme
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search themes..." className="pl-8" value={searchQuery} onChange={handleSearch} />
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedItems.length === themes.length && themes.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Theme Name</TableHead>
                <TableHead>Flooring</TableHead>
                <TableHead>Cabinetry</TableHead>
                <TableHead>Table Top</TableHead>
                <TableHead>Seating</TableHead>
                <TableHead>Action</TableHead>
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
              ) : filteredThemes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No themes found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredThemes.map((theme) => (
                  <TableRow key={theme.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(theme.id)}
                        onCheckedChange={() => toggleSelectItem(theme.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="h-12 w-12 rounded overflow-hidden border">
                        <img
                          src={getImageUrl(theme.image, theme.name) || "/placeholder.svg"}
                          alt={theme.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{theme.name}</TableCell>
                    <TableCell>{theme.flooring_name}</TableCell>
                    <TableCell>{theme.cabinetry_1_name}</TableCell>
                    <TableCell>{theme.table_top_1_name}</TableCell>
                    <TableCell>{theme.seating_1_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" title="View" onClick={() => openViewModal(theme)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit" onClick={() => openEditModal(theme)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDeleteTheme(theme.id)}>
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={`loading-${index}`} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-40 bg-muted rounded mb-4"></div>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))
          ) : filteredThemes.length === 0 ? (
            <div className="col-span-full text-center py-10">No themes found.</div>
          ) : (
            filteredThemes.map((theme) => (
              <Card key={theme.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={getImageUrl(theme.image, theme.name) || "/placeholder.svg"}
                      alt={theme.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => openViewModal(theme)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => openEditModal(theme)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteTheme(theme.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{theme.name}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Flooring:</span> {theme.flooring_name}
                      </div>
                      <div>
                        <span className="font-medium">Cabinetry:</span> {theme.cabinetry_1_name}
                      </div>
                      <div>
                        <span className="font-medium">Table Top:</span> {theme.table_top_1_name}
                      </div>
                      <div>
                        <span className="font-medium">Seating:</span> {theme.seating_1_name}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

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

      {/* Add Theme Modal */}
      <ThemeForm open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onSubmit={handleAddTheme} />

      {/* Edit Theme Modal */}
      <ThemeForm
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={currentTheme || undefined}
        onSubmit={handleEditTheme}
      />

      {/* View Theme Modal */}
      <ThemeDetails open={isViewModalOpen} onOpenChange={setIsViewModalOpen} themeId={currentTheme?.id} />
    </div>
  )
}

export default ModelTheme
