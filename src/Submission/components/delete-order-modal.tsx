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

interface OrderData {
  id?: number
  customer_info_id?: number
  total_price?: string
}

interface DeleteOrderModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: number | null
  orderData: OrderData | undefined
  isDeleting: boolean
  onDelete: () => Promise<void>
}

// Helper function to safely format currency
const formatCurrency = (amount: string | number | undefined | null): string => {
  if (!amount) return "$0.00"

  const numericAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount
  if (isNaN(numericAmount)) return "$0.00"

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericAmount)
}

export default function DeleteOrderModal({
  isOpen,
  onClose,
  orderId,
  orderData,
  isDeleting,
  onDelete,
}: DeleteOrderModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Order Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete order #{orderId}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              <strong>Order:</strong> #{orderId}
              <br />
              <strong>Customer ID:</strong> {orderData?.customer_info_id || "N/A"}
              <br />
              <strong>Total:</strong> {formatCurrency(orderData?.total_price)}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isDeleting}
            className="flex items-center space-x-2"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            <span>{isDeleting ? "Deleting..." : "Delete Order"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
