

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Loader2, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "react-toastify"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Updated interfaces to match actual API response
interface OrderData {
  id: number
  vehicle_model_id: number
  theme_id: number
  customer_info_id: number
  base_price: string
  total_price: string
  status: string
  created_at: string
  updated_at: string
}

interface ApiResponse {
  success: boolean
  message: string
  data: OrderData[]
  current_page: number
  total_pages: number
  per_page: number
  total: number
}

// Detailed order interfaces
interface VehicleModel {
  id: number
  name: string
  sleep_person: string
  description: string
  inner_image: string
  outer_image: string
  category_id: number
  base_price: string
  price: string
  created_at: string
  updated_at: string
}

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
  seating_2_name: string
  seating_2_image: string
  cabinetry_2_name: string
  cabinetry_2_image: string
  table_top_2_name: string
  table_top_2_image: string
  created_at: string
  updated_at: string
}

interface CustomerInfo {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  postal_code: string
  created_at: string
  updated_at: string
}

interface Color {
  id: number
  name: string
  code: string | null
  image: string
  status: string
  type: string
  created_at: string
  updated_at: string
  pivot: {
    order_id: number
    color_id: number
  }
}

interface OrderDetail extends OrderData {
  vehicle_model: VehicleModel
  theme: Theme
  customer_info: CustomerInfo
  colors: Color[]
}

interface OrderDetailResponse {
  success: boolean
  message: string
  data: OrderDetail
}

const OrderSubmissionTable: React.FC = () => {
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null)
  const [orders, setOrders] = useState<OrderData[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // State for order details
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderDetail | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)

  // Fetch orders data
  const fetchOrders = async (page = 1) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders?page=${page}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()
      setApiResponse(data)
      setOrders(data.data)
      setCurrentPage(data.current_page)
      setItemsPerPage(data.per_page)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders data")
      console.error("Fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch order details
  const fetchOrderDetails = async (id: number) => {
    try {
      setIsLoadingDetails(true)
      setDetailsError(null)

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders?id=${id}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: OrderDetailResponse = await response.json()
      setSelectedOrderDetails(data.data)
      setIsDetailsModalOpen(true)
    } catch (err) {
      setDetailsError(err instanceof Error ? err.message : "Failed to fetch order details")
      console.error("Details fetch error:", err)
      toast.error("Failed to load order details. Please try again.")
    } finally {
      setIsLoadingDetails(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Handle delete order
  const handleDelete = async () => {
    if (!selectedOrderId) return

    try {
      setIsDeleting(true)

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${selectedOrderId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Remove deleted order from state
      setOrders(orders.filter((order) => order.id !== selectedOrderId))
      setIsModalOpen(false)
      setSelectedOrderId(null)

      // Show success toast
      toast.success(`Order #${selectedOrderId} deleted successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete order")
      console.error("Delete error:", err)

      // Show error toast
      toast.error(`Failed to delete order #${selectedOrderId}. Please try again.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Format currency
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number.parseFloat(amount))
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchOrders(page)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading orders...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-full mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-full mx-auto p-4">
        <Alert>
          <AlertDescription>No orders available</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="text-sm text-muted-foreground">
        
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead>Vehicle Model ID</TableHead>
              <TableHead>Theme ID</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.customer_info_id}</TableCell>
                <TableCell>{order.vehicle_model_id}</TableCell>
                <TableCell>{order.theme_id}</TableCell>
                <TableCell>{formatCurrency(order.base_price)}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(order.total_price)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fetchOrderDetails(order.id)}
                      className=""
                      disabled={isLoadingDetails}
                    >
                      {isLoadingDetails && order.id === selectedOrderId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedOrderId(order.id)
                        setIsModalOpen(true)
                      }}
                      className=""
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          {apiResponse && (
            <>
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, apiResponse.total)}{" "}
              from {apiResponse.total}
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {apiResponse &&
            Array.from({ length: Math.min(5, apiResponse.total_pages) }, (_, i) => {
              let pageNum = i + 1
              if (apiResponse.total_pages > 5 && currentPage > 3) {
                pageNum = currentPage - 3 + i
              }
              if (pageNum > apiResponse.total_pages) return null

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePageChange(pageNum)}
                  className="w-8 h-8"
                >
                  {pageNum}
                </Button>
              )
            })}

          {apiResponse && apiResponse.total_pages > 5 && currentPage < apiResponse.total_pages - 2 && (
            <>
              <span className="mx-1">...</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(apiResponse.total_pages)}
                className="w-8 h-8"
              >
                {apiResponse.total_pages}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(Math.min(apiResponse?.total_pages || 1, currentPage + 1))}
            disabled={currentPage === (apiResponse?.total_pages || 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Order Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="!w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details #{selectedOrderDetails?.id}</DialogTitle>
            <DialogDescription>
              Created on {selectedOrderDetails && formatDate(selectedOrderDetails.created_at)}
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading order details...</span>
            </div>
          ) : detailsError ? (
            <Alert variant="destructive">
              <AlertDescription>{detailsError}</AlertDescription>
            </Alert>
          ) : (
            selectedOrderDetails && (
              <Tabs defaultValue="order" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="order">Order Info</TabsTrigger>
                  <TabsTrigger value="customer">Customer</TabsTrigger>
                  <TabsTrigger value="vehicle">Vehicle Model</TabsTrigger>
                  <TabsTrigger value="theme">Theme & Colors</TabsTrigger>
                </TabsList>

                {/* Order Info Tab */}
                <TabsContent value="order" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Information</CardTitle>
                      <CardDescription>Basic order details and pricing</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                        <p className="text-lg font-semibold">#{selectedOrderDetails.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedOrderDetails.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {selectedOrderDetails.status.charAt(0).toUpperCase() + selectedOrderDetails.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Base Price</p>
                        <p className="text-lg">{formatCurrency(selectedOrderDetails.base_price)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Price</p>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(selectedOrderDetails.total_price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Created Date</p>
                        <p>{formatDate(selectedOrderDetails.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                        <p>{formatDate(selectedOrderDetails.updated_at)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Customer Tab */}
                <TabsContent value="customer" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Information</CardTitle>
                      <CardDescription>Contact details for the customer</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Customer ID</p>
                        <p className="text-lg font-semibold">#{selectedOrderDetails.customer_info.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                        <p className="text-lg">
                          {selectedOrderDetails.customer_info.first_name} {selectedOrderDetails.customer_info.last_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="text-lg">{selectedOrderDetails.customer_info.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Phone</p>
                        <p className="text-lg">{selectedOrderDetails.customer_info.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Postal Code</p>
                        <p className="text-lg">{selectedOrderDetails.customer_info.postal_code}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Customer Since</p>
                        <p>{formatDate(selectedOrderDetails.customer_info.created_at)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Vehicle Model Tab */}
                <TabsContent value="vehicle" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedOrderDetails.vehicle_model.name}</CardTitle>
                      <CardDescription>Vehicle model details and specifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Exterior View</p>
                          <div className="relative h-48 w-full rounded-md overflow-hidden border">
                            <img
                              src={`${import.meta.env.VITE_BACKEND_URL}/${selectedOrderDetails.vehicle_model.outer_image}`}
                              alt={`${selectedOrderDetails.vehicle_model.name} exterior`}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Interior View</p>
                          <div className="relative h-48 w-full rounded-md overflow-hidden border">
                            <img
                              src={`${import.meta.env.VITE_BACKEND_URL}/${selectedOrderDetails.vehicle_model.inner_image}`}
                              alt={`${selectedOrderDetails.vehicle_model.name} interior`}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Model ID</p>
                          <p className="text-lg font-semibold">#{selectedOrderDetails.vehicle_model.id}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Sleeps</p>
                          <p className="text-lg">{selectedOrderDetails.vehicle_model.sleep_person} people</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Base Price</p>
                          <p className="text-lg font-semibold">
                            {formatCurrency(selectedOrderDetails.vehicle_model.base_price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Price</p>
                          <p className="text-lg font-semibold">
                            {formatCurrency(selectedOrderDetails.vehicle_model.price)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Description</p>
                        <p className="mt-1 text-sm">{selectedOrderDetails.vehicle_model.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Theme & Colors Tab */}
                <TabsContent value="theme" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedOrderDetails.theme.name}</CardTitle>
                      <CardDescription>Theme details and color selections</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Theme Preview</p>
                        <div className="relative h-48 w-full rounded-md overflow-hidden border">
                          <img
                            src={`${import.meta.env.VITE_BACKEND_URL}/${selectedOrderDetails.theme.image}`}
                            alt={selectedOrderDetails.theme.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">Interior Selections</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Flooring</p>
                            <p className="text-sm">{selectedOrderDetails.theme.flooring_name}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Cabinetry</p>
                            <p className="text-sm">{selectedOrderDetails.theme.cabinetry_1_name}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Benchtops</p>
                            <p className="text-sm">{selectedOrderDetails.theme.table_top_1_name}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Seating Fabric</p>
                            <p className="text-sm">{selectedOrderDetails.theme.seating_1_name}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">Selected Colors</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {selectedOrderDetails.colors.map((color) => (
                            <div key={color.id} className="space-y-2">
                              <div className="relative h-20 w-full rounded-md overflow-hidden border">
                                <img
                                  src={`${import.meta.env.VITE_BACKEND_URL}/${color.image}`}
                                  alt={color.name}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{color.name}</p>
                                <p className="text-xs text-muted-foreground">{color.type}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Order Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete order #{selectedOrderId}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                <strong>Order:</strong> #{selectedOrderId}
                <br />
                <strong>Customer ID:</strong> {orders.find((o) => o.id === selectedOrderId)?.customer_info_id}
                <br />
                <strong>Total:</strong>{" "}
                {formatCurrency(orders.find((o) => o.id === selectedOrderId)?.total_price || "0")}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setSelectedOrderId(null)
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center space-x-2"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isDeleting ? "Deleting..." : "Delete Order"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OrderSubmissionTable
