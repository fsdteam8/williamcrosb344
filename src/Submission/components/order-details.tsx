"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Interfaces for order data
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

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: number | null
  orderDetails: OrderDetail | null
  isLoading: boolean
  error: string | null
  onStatusChange: (orderId: number, newStatus: string) => Promise<void>
  backendUrl: string
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

export default function OrderDetailsModal({
  isOpen,
  onClose,
  orderDetails,
  isLoading,
  error,
  onStatusChange,
  backendUrl,
}: OrderDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details #{orderDetails?.id}</DialogTitle>
          <DialogDescription>Created on {orderDetails && formatDate(orderDetails.created_at)}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading order details...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          orderDetails && (
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
                      <p className="text-lg font-semibold">#{orderDetails.id}</p>
                    </div>
                    {orderDetails.uniq_id && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Unique ID</p>
                        <p className="text-lg font-semibold">{orderDetails.uniq_id}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(orderDetails.status)}`}
                        >
                          {formatStatus(orderDetails.status)}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newStatus = orderDetails.status === "pending" ? "delivered" : "pending"
                            onStatusChange(orderDetails.id, newStatus)
                          }}
                        >
                          Mark as {orderDetails.status === "pending" ? "Delivered" : "Pending"}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Base Price</p>
                      <p className="text-lg">{formatCurrency(orderDetails.base_price)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Price</p>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(orderDetails.total_price)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created Date</p>
                      <p>{formatDate(orderDetails.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                      <p>{formatDate(orderDetails.updated_at)}</p>
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
                      <p className="text-lg font-semibold">#{orderDetails.customer_info?.id || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                      <p className="text-lg">
                        {orderDetails.customer_info?.first_name || ""} {orderDetails.customer_info?.last_name || ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-lg">{orderDetails.customer_info?.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="text-lg">{orderDetails.customer_info?.phone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Postal Code</p>
                      <p className="text-lg">{orderDetails.customer_info?.postal_code || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Customer Since</p>
                      <p>{formatDate(orderDetails.customer_info?.created_at)}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Vehicle Model Tab */}
              <TabsContent value="vehicle" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{orderDetails.vehicle_model?.name || "Unknown Vehicle"}</CardTitle>
                    <CardDescription>Vehicle model details and specifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Exterior View</p>
                        <div className="relative h-48 w-full rounded-md overflow-hidden border">
                          {orderDetails.vehicle_model?.outer_image ? (
                            <img
                              src={`${backendUrl}/${orderDetails.vehicle_model.outer_image}`}
                              alt={`${orderDetails.vehicle_model.name} exterior`}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg?height=192&width=300&text=No+Image"
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gray-100">
                              <span className="text-gray-500">No image available</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Interior View</p>
                        <div className="relative h-48 w-full rounded-md overflow-hidden border">
                          {orderDetails.vehicle_model?.inner_image ? (
                            <img
                              src={`${backendUrl}/${orderDetails.vehicle_model.inner_image}`}
                              alt={`${orderDetails.vehicle_model.name} interior`}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg?height=192&width=300&text=No+Image"
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gray-100">
                              <span className="text-gray-500">No image available</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Model ID</p>
                        <p className="text-lg font-semibold">#{orderDetails.vehicle_model?.id || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Sleeps</p>
                        <p className="text-lg">{orderDetails.vehicle_model?.sleep_person || "N/A"} people</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Base Price</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(orderDetails.vehicle_model?.base_price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Price</p>
                        <p className="text-lg font-semibold">{formatCurrency(orderDetails.vehicle_model?.price)}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p className="mt-1 text-sm">
                        {orderDetails.vehicle_model?.description || "No description available"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Theme & Colors Tab */}
              <TabsContent value="theme" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{orderDetails.theme?.name || "Unknown Theme"}</CardTitle>
                    <CardDescription>Theme details and color selections</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Theme Preview</p>
                      <div className="relative h-48 w-full rounded-md overflow-hidden border">
                        {orderDetails.theme?.image ? (
                          <img
                            src={`${backendUrl}/${orderDetails.theme.image}`}
                            alt={orderDetails.theme.name}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg?height=192&width=400&text=No+Image"
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-100">
                            <span className="text-gray-500">No image available</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Interior Selections</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Flooring</p>
                          <p className="text-sm">{orderDetails.theme?.flooring_name || "N/A"}</p>
                          {orderDetails.theme?.flooring_image && (
                            <div className="relative h-20 w-full rounded-md overflow-hidden border">
                              <img
                                src={`${backendUrl}/${orderDetails.theme.flooring_image}`}
                                alt="Flooring"
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg?height=80&width=120&text=No+Image"
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Cabinetry</p>
                          <p className="text-sm">{orderDetails.theme?.cabinetry_1_name || "N/A"}</p>
                          {orderDetails.theme?.cabinetry_1_image && (
                            <div className="relative h-20 w-full rounded-md overflow-hidden border">
                              <img
                                src={`${backendUrl}/${orderDetails.theme.cabinetry_1_image}`}
                                alt="Cabinetry"
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg?height=80&width=120&text=No+Image"
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Benchtops</p>
                          <p className="text-sm">{orderDetails.theme?.table_top_1_name || "N/A"}</p>
                          {orderDetails.theme?.table_top_1_image && (
                            <div className="relative h-20 w-full rounded-md overflow-hidden border">
                              <img
                                src={`${backendUrl}/${orderDetails.theme.table_top_1_image}`}
                                alt="Benchtops"
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg?height=80&width=120&text=No+Image"
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Seating Fabric</p>
                          <p className="text-sm">{orderDetails.theme?.seating_1_name || "N/A"}</p>
                          {orderDetails.theme?.seating_1_image && (
                            <div className="relative h-20 w-full rounded-md overflow-hidden border">
                              <img
                                src={`${backendUrl}/${orderDetails.theme.seating_1_image}`}
                                alt="Seating Fabric"
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg?height=80&width=120&text=No+Image"
                                }}
                              />
                            </div>
                          )}
                        </div>
                        {orderDetails.theme?.seating_2_name && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Seating Leather</p>
                            <p className="text-sm">{orderDetails.theme.seating_2_name}</p>
                            {orderDetails.theme?.seating_2_image && (
                              <div className="relative h-20 w-full rounded-md overflow-hidden border">
                                <img
                                  src={`${backendUrl}/${orderDetails.theme.seating_2_image}`}
                                  alt="Seating Leather"
                                  className="object-cover w-full h-full"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg?height=80&width=120&text=No+Image"
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                        {orderDetails.theme?.table_top_2_name && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Splashback</p>
                            <p className="text-sm">{orderDetails.theme.table_top_2_name}</p>
                            {orderDetails.theme?.table_top_2_image && (
                              <div className="relative h-20 w-full rounded-md overflow-hidden border">
                                <img
                                  src={`${backendUrl}/${orderDetails.theme.table_top_2_image}`}
                                  alt="Splashback"
                                  className="object-cover w-full h-full"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg?height=80&width=120&text=No+Image"
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Selected Colors</h3>
                      {orderDetails.colors && orderDetails.colors.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {orderDetails.colors.map((color) => (
                            <div key={color.id} className="space-y-2">
                              <div className="relative h-20 w-full rounded-md overflow-hidden border">
                                {color.image ? (
                                  <img
                                    src={`${backendUrl}/${color.image}`}
                                    alt={color.name}
                                    className="object-cover w-full h-full"
                                    onError={(e) => {
                                      e.currentTarget.src = "/placeholder.svg?height=80&width=120&text=No+Image"
                                    }}
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full bg-gray-100">
                                    <span className="text-xs text-gray-500">No image</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{color.name || "Unknown Color"}</p>
                                <p className="text-xs text-muted-foreground">{color.type || "N/A"}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No colors selected</p>
                      )}
                    </div>

                    {/* Additional Options Section */}
                    {orderDetails.additional_options && orderDetails.additional_options.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Additional Options</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {orderDetails.additional_options.map((option, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <p className="text-sm font-medium">{option.name || "Unknown Option"}</p>
                              {option.price && (
                                <p className="text-xs text-muted-foreground">{formatCurrency(option.price)}</p>
                              )}
                              {option.type && <p className="text-xs text-muted-foreground mt-1">{option.type}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
