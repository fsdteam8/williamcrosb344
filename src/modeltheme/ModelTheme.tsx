"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Search, Filter, Plus, Eye, Pencil, Trash2, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "react-hot-toast"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeForm } from "./compolents/AddEditeThemeForm"

interface Theme {
  id: number
  name: string
  image: string
  flooring_name: string
  flooring_image: string
  cabinetry_1_name: string
  cabinetry_1_image: string
  table_top_1_name: string
  table_top_1_image: string
  seating_1_name: string
  seating_1_image: string
  created_at: string
  updated_at: string
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-muted-foreground">We're having trouble loading the themes.</p>
          <Button className="mt-4" onClick={() => this.setState({ hasError: false })}>
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

function ModelTheme() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

  const itemsPerPage = 10

  useEffect(() => {
    fetchThemes()
  }, [currentPage])

  const fetchThemes = async () => {
    setLoading(true)
    try {
      const response = await fetch(`https://ben10.scaleupdevagency.com/api/themes`)

      if (!response.ok) {
        throw new Error("Failed to fetch themes")
      }

      const data = await response.json()

      // Ensure we're working with the correct data structure
      const themesData = data.data.data
      setThemes(Array.isArray(themesData) ? themesData : [])
      setTotalItems(Array.isArray(themesData) ? themesData.length : 0)
    } catch (error) {
      console.error("Error fetching themes:", error)
      setThemes([])
      setTotalItems(0)
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

  const handleAddTheme = async (formData: any) => {
    try {
      const response = await fetch("https://ben10.scaleupdevagency.com/api/themes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create theme")
      }

      const data = await response.json()

      // Refresh the themes list
      fetchThemes()
      setIsAddModalOpen(false)

      toast.success("Theme created successfully")
      return data
    } catch (error) {
      console.error("Error creating theme:", error)
      toast.error("Failed to create theme")
      throw error
    }
  }

  const handleEditTheme = async (formData: any) => {
    if (!currentTheme) return

    try {
      const response = await fetch(`https://ben10.scaleupdevagency.com/api/themes/${currentTheme.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update theme")
      }

      const data = await response.json()

      // Refresh the themes list
      fetchThemes()
      setIsEditModalOpen(false)

      toast.success("Theme updated successfully")
      return data
    } catch (error) {
      console.error("Error updating theme:", error)
      toast.error("Failed to update theme")
      throw error
    }
  }

  const handleDeleteTheme = async (id: number) => {
    if (!confirm("Are you sure you want to delete this theme?")) return

    try {
      const response = await fetch(`https://ben10.scaleupdevagency.com/api/themes/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete theme")
      }

      // Refresh the themes list
      fetchThemes()

      toast.success("Theme deleted successfully")
    } catch (error) {
      console.error("Error deleting theme:", error)
      toast.error("Failed to delete theme")
    }
  }

  const openEditModal = (theme: Theme) => {
    setCurrentTheme(theme)
    setIsEditModalOpen(true)
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const filteredThemes = Array.isArray(themes)
    ? themes.filter((theme) => theme.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Themes</h1>
          <div className="text-sm text-muted-foreground">Dashboard / Themes</div>
        </div>
        <Button className="bg-red-500 hover:bg-red-600" onClick={() => setIsAddModalOpen(true)}>
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
                          src={theme.image || `/placeholder.svg?height=60&width=60&query=${theme.name}`}
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
                        <Button variant="ghost" size="icon" title="View">
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
                      src={theme.image || `/placeholder.svg?height=200&width=400&query=${theme.name}`}
                      alt={theme.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
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

      {/* Add Theme Modal */}
      <ThemeForm open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onSubmit={handleAddTheme} />

      {/* Edit Theme Modal */}
      <ThemeForm
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={currentTheme || undefined}
        onSubmit={handleEditTheme}
      />
    </div>
  )
}

function ModelThemeWithBoundary() {
  return (
    <ErrorBoundary>
      <ModelTheme />
    </ErrorBoundary>
  )
}

export default ModelThemeWithBoundary
