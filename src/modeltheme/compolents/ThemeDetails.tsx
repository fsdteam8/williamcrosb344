"use client"

import { useState, useEffect } from "react"
import { Download, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import axios from "axios"

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

interface ThemeDetailsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  themeId?: number
  onEdit?: (theme: Theme) => void
}

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
})

export function ThemeDetails({ open, onOpenChange, themeId }: ThemeDetailsProps) {
  const [theme, setTheme] = useState<Theme | null>(null)
  const [loading, setLoading] = useState(false)

  const getAuthToken = () => {
    return localStorage.getItem("authToken") || ""
  }

  api.interceptors.request.use((config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  useEffect(() => {
    if (open && themeId) {
      fetchThemeDetails()
    }
  }, [open, themeId])

  const fetchThemeDetails = async () => {
    if (!themeId) return

    setLoading(true)
    try {
      const response = await api.get(`/themes?id=${themeId}`)
      setTheme(response.data)
    } catch (error) {
      console.error("Error fetching theme details:", error)
    } finally {
      setLoading(false)
    }
  }


  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return `/placeholder.svg?height=200&width=200&query=theme-image`
    return `${import.meta.env.VITE_BACKEND_URL}/${imagePath}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const ImageCard = ({ title, name, image }: { title: string; name: string; image: string }) => (
    <div className="space-y-2">
      <h4 className="font-medium text-sm text-muted-foreground">{title}</h4>
      <div className="border rounded-lg overflow-hidden">
        <img src={getImageUrl(image) || "/placeholder.svg"} alt={name} className="w-full h-32 object-cover" />
        <div className="p-2">
          <p className="text-sm font-medium">{name}</p>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!theme) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Theme not found</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-2xl">{theme.name}</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">Created: {formatDate(theme.created_at)}</p>
            {theme.updated_at !== theme.created_at && (
              <p className="text-sm text-muted-foreground">Updated: {formatDate(theme.updated_at)}</p>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Theme Image */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Theme Preview</h3>
            <div className="border rounded-lg overflow-hidden">
              <img
                src={getImageUrl(theme.image) || "/placeholder.svg"}
                alt={theme.name}
                className="w-full h-64 object-cover"
              />
            </div>
          </div>

          <Separator />

          {/* Flooring */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Flooring</h3>
            <ImageCard title="Flooring Option" name={theme.flooring_name} image={theme.flooring_image} />
          </div>

          <Separator />

          {/* Cabinetry */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cabinetry Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageCard title="Cabinetry Option 1" name={theme.cabinetry_1_name} image={theme.cabinetry_1_image} />
              {theme.cabinetry_2_name && theme.cabinetry_2_image && (
                <ImageCard title="Cabinetry Option 2" name={theme.cabinetry_2_name} image={theme.cabinetry_2_image} />
              )}
            </div>
          </div>

          <Separator />

          {/* Table Tops */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Table Top Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageCard title="Table Top Option 1" name={theme.table_top_1_name} image={theme.table_top_1_image} />
              {theme.table_top_2_name && theme.table_top_2_image && (
                <ImageCard title="Table Top Option 2" name={theme.table_top_2_name} image={theme.table_top_2_image} />
              )}
            </div>
          </div>

          <Separator />

          {/* Seating */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Seating Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageCard title="Seating Option 1" name={theme.seating_1_name} image={theme.seating_1_image} />
              {theme.seating_2_name && theme.seating_2_image && (
                <ImageCard title="Seating Option 2" name={theme.seating_2_name} image={theme.seating_2_image} />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
