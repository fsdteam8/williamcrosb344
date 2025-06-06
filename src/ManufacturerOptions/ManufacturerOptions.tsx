"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { ManufacturerForm } from "./components/manufacturer-form"
import { toast } from "react-toastify"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ManufacturerOption {
  id: number
  name: string
  price: string
  vehicle_model_id: number | null
  category_name: string
  type: string
  created_at: string
  updated_at: string
}

interface ApiResponse {
  success: boolean
  message: string
  data: {
    current_page: number
    data: ManufacturerOption[]
    total: number
    per_page: number
    last_page: number
  }
  current_page: number
  total_pages: number
  per_page: number
  total: number
}

export default function Manufacturer() {
  const [manufacturerOptions, setManufacturerOptions] = useState<ManufacturerOption[]>([])
  const [filteredOptions, setFilteredOptions] = useState<ManufacturerOption[]>([])
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
  const [currentOption, setCurrentOption] = useState<ManufacturerOption | null>(null)

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false)

  const getAuthToken = () => {
    return localStorage.getItem("authToken") || ""
  }

  // Fetch manufacturer options
  const fetchManufacturerOptions = async (page = 1) => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/addtional-options?page=${page}`)
      const data: ApiResponse = await response.json()

      if (data.success) {
        // Filter only manufacturer options
        const manufacturerData = data.data.data
        console.log("Manufacturer Options:", manufacturerData)
        setManufacturerOptions(manufacturerData)
        setFilteredOptions(manufacturerData)
        setTotalPages(data.total_pages)
        setTotalItems(manufacturerData.length)
        setCurrentPage(data.current_page)
      }
    } catch (error) {
      console.error("Error fetching manufacturer options:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchManufacturerOptions(currentPage)
  }, [currentPage])

  // Search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    const filtered = manufacturerOptions.filter(
      (option) =>
        option.name.toLowerCase().includes(query) ||
        option.category_name.toLowerCase().includes(query) ||
        option.price.includes(query),
    )
    setFilteredOptions(filtered)
  }

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredOptions.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredOptions.map((option) => option.id))
    }
  }

  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  // Add new manufacturer option
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddOption = async (formData: any) => {
    try {
      const response = await fetch(`${process.env.VITE_BACKEND_URL}/api/addtional-options`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          type: "Manufacturer Options",
        }),
      })

      if (response.ok) {
        setIsAddModalOpen(false)
        fetchManufacturerOptions(currentPage)
      }
    } catch (error) {
      console.error("Error adding manufacturer option:", error)
    }
  }

  // Edit manufacturer option
  const openEditModal = (option: ManufacturerOption) => {
    setCurrentOption(option)
    setIsEditModalOpen(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditOption = async (formData: any) => {
    if (!currentOption) return

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/addtional-options/${currentOption.id}?_method=PUT`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({
            ...formData,
            type: "Manufacturer Options",
          }),
        },
      )

      if (response.ok) {
        setIsEditModalOpen(false)
        setCurrentOption(null)
        fetchManufacturerOptions(currentPage)
      }
    } catch (error) {
      console.error("Error editing manufacturer option:", error)
    }
  }

  // Delete single manufacturer option
  const handleDeleteOption = async (id: number) => {
    setItemToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const confirmDeleteOption = async () => {
    if (!itemToDelete) return

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/addtional-options/${itemToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })

      if (response.ok) {
         toast.success(`Manufacturer Option  deleted successfully!`, {
               position: "top-right",
               autoClose: 3000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
             })
        fetchManufacturerOptions(currentPage)
        setSelectedItems((prev) => prev.filter((item) => item !== itemToDelete))
      } else {
        toast.error("Failed to delete manufacturer option")
      }
    } catch (error) {
      console.error("Error deleting manufacturer option:", error)
      toast.error("Error deleting manufacturer option")
    } finally {
      setDeleteConfirmOpen(false)
      setItemToDelete(null)
    }
  }

  // Bulk delete
  const handleBulkDelete = async () => {
    setBulkDeleteConfirmOpen(true)
  }

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedItems.map((id) =>
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/addtional-options/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }),
        ),
      )
      toast.success(`${selectedItems.length} manufacturer options deleted successfully!`)
      setSelectedItems([])
      fetchManufacturerOptions(currentPage)
    } catch (error) {
      console.error("Error bulk deleting manufacturer options:", error)
      toast.error("Error deleting manufacturer options")
    } finally {
      setBulkDeleteConfirmOpen(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manufacturer Options</h1>
          <div className="text-sm text-muted-foreground">Dashboard / Manufacturer Options</div>
        </div>
        <Button className="cuirsor-pointer" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Option
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search manufacturer options..."
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
                  checked={selectedItems.length === filteredOptions.length && filteredOptions.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Vehicle Model ID</TableHead>
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
            ) : filteredOptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No manufacturer options found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOptions.map((option) => (
                <TableRow key={option.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(option.id)}
                      onCheckedChange={() => toggleSelectItem(option.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{option.id}</TableCell>
                  <TableCell>{option.name}</TableCell>
                  <TableCell>${option.price}</TableCell>
                  <TableCell>{option.category_name}</TableCell>
                  <TableCell>{option.vehicle_model_id || "N/A"}</TableCell>
                  <TableCell>{option.type}</TableCell>
                  <TableCell>{new Date(option.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        className="cursor-pointer"
                        size="icon"
                        title="Edit"
                        onClick={() => openEditModal(option)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        onClick={() => handleDeleteOption(option.id)}
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
          {totalItems} manufacturer options
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

      {/* Add Manufacturer Option Modal */}
      <ManufacturerForm open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onSubmit={handleAddOption} />

      {/* Edit Manufacturer Option Modal */}
      <ManufacturerForm
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={currentOption || undefined}
        onSubmit={handleEditOption}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this manufacturer option? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteOption} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteConfirmOpen} onOpenChange={setBulkDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bulk Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedItems.length} manufacturer options? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-red-500 hover:bg-red-600">
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
