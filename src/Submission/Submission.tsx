"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Loader2, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import OrderDetailsModal from "./components/order-details"
import DeleteOrderModal from "./components/delete-order-modal"

// Interfaces
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

// Replace the OrderDetail interface with this one that matches your lib/types.ts
interface OrderDetail {
  id: number
  uniq_id?: string
  vehicle_model_id: number
  theme_id: number
  customer_info_id: number
  base_price: string
  total_price: string
  status: string
  created_at: string
  updated_at: string
  vehicle_model: {
    id: number
    name: string
    sleep_person: string
    description: string
    inner_image: string
    outer_image?: string | null
    category_id: number
    base_price: string
    price: string
    created_at: string
    updated_at: string
  }
  theme: {
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
  customer_info: {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string
    postal_code: string
    created_at: string
    updated_at: string
  }
  colors: {
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
  }[]
  additional_options: {
    id: number
    name: string
    price: string
    type: string
  }[]
}

// Helper functions
const formatStatus = (status: string | undefined | null): string => {
  if (!status || typeof status !== "string") {
    return "Unknown"
  }
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const formatCurrency = (amount: string | number | undefined | null): string => {
  if (!amount) return "$0.00"

  const numericAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount
  if (isNaN(numericAmount)) return "$0.00"

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericAmount)
}

const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "N/A"

  try {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (error) {
    console.error("Date formatting error:", error)
    return "Invalid Date"
  }
}

const getStatusBadgeClasses = (status: string | undefined | null): string => {
  const normalizedStatus = status?.toLowerCase() || "unknown"

  switch (normalizedStatus) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "delivered":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function OrderTable() {
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null)
  const [orders, setOrders] = useState<OrderData[]>([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
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

  const backendUrl = import.meta.env.VITE_BACKEND_URL || ""

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken") || ""
    }
    return ""
  }

  // Fetch orders data with error handling
  const fetchOrders = async (page = 1) => {
    const token = getAuthToken()
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${backendUrl}/api/orders?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      // Validate the response data
      if (!data || !Array.isArray(data.data)) {
        throw new Error("Invalid response format")
      }

      setApiResponse(data)
      setOrders(data.data)
      setCurrentPage(data.current_page || 1)
      setItemsPerPage(data.per_page || 10)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch orders data"
      setError(errorMessage)
      console.error("Fetch error:", err)

      // Set empty state on error
      setOrders([])
      setApiResponse(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Update the fetchOrderDetails function to handle the nested order structure
  const fetchOrderDetails = async (id: number) => {
    try {
      const token = getAuthToken()
      setIsLoadingDetails(true)
      setDetailsError(null)
      setSelectedOrderId(id)

      const response = await fetch(`${backendUrl}/api/orders?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Updated to handle the new API structure where order data is under data.order
      if (!data || !data.data || !data.data.order) {
        throw new Error("Invalid order details response")
      }

      setSelectedOrderDetails(data.data.order)
      setIsDetailsModalOpen(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch order details"
      setDetailsError(errorMessage)
      console.error("Details fetch error:", err)

      // Show user-friendly error message
      alert("Failed to load order details. Please try again.")
    } finally {
      setIsLoadingDetails(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Handle delete order with error handling
  const handleDelete = async () => {
    if (!selectedOrderId) return

    try {
      setIsDeleting(true)
      const token = getAuthToken()

      const response = await fetch(`${backendUrl}/api/orders/${selectedOrderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Remove deleted order from state
      setOrders(orders.filter((order) => order.id !== selectedOrderId))
      setIsDeleteModalOpen(false)
      setSelectedOrderId(null)

      // Show success message
      alert(`Order #${selectedOrderId} deleted successfully!`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete order"
      setError(errorMessage)
      console.error("Delete error:", err)
      alert(`Failed to delete order #${selectedOrderId}. Please try again.`)
    } finally {
      setIsDeleting(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchOrders(page)
  }

  // Function to update order status with error handling
  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    const token = getAuthToken()
    try {
      const response = await fetch(`${backendUrl}/api/orders/${orderId}/status`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Update the order in the local state
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

      // If the details modal is open and showing this order, update its status too
      if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
        setSelectedOrderDetails({
          ...selectedOrderDetails,
          status: newStatus,
        })
      }

      alert(`Order #${orderId} status updated to ${newStatus}!`)

      return data
    } catch (err) {
      console.error("Status update error:", err)
      alert(`Failed to update order status. Please try again.`)
      throw err
    }
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
        <Button onClick={() => fetchOrders()} className="mt-4" variant="outline">
          Try Again
        </Button>
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
        <div className="text-sm text-muted-foreground">{apiResponse && `Total: ${apiResponse.total} orders`}</div>
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
                <TableCell className="font-medium">#{order.id || "N/A"}</TableCell>
                <TableCell>{order.customer_info_id || "N/A"}</TableCell>
                <TableCell>{order.vehicle_model_id || "N/A"}</TableCell>
                <TableCell>{order.theme_id || "N/A"}</TableCell>
                <TableCell>{formatCurrency(order.base_price)}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(order.total_price)}</TableCell>
                <TableCell>
                  <Select
                    value={order.status || "unknown"}
                    onValueChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(order.status)}`}
                        >
                          {formatStatus(order.status)}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </SelectItem>
                      <SelectItem value="delivered">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Delivered
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fetchOrderDetails(order.id)}
                      disabled={isLoadingDetails && selectedOrderId === order.id}
                    >
                      {isLoadingDetails && selectedOrderId === order.id ? (
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
                        setIsDeleteModalOpen(true)
                      }}
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
      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        orderId={selectedOrderId}
        orderDetails={selectedOrderDetails}
        isLoading={isLoadingDetails}
        error={detailsError}
        onStatusChange={updateOrderStatus}
        backendUrl={backendUrl}
      />

      {/* Delete Confirmation Modal */}
      <DeleteOrderModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        orderId={selectedOrderId}
        orderData={orders.find((o) => o.id === selectedOrderId)}
        isDeleting={isDeleting}
        onDelete={handleDelete}
      />
    </div>
  )
}
