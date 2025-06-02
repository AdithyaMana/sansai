import { formatDateTime, formatDate, addDays } from "./dateUtils"

export interface Order {
  id: string
  items: any[]
  total: number
  createdAt: Date
  estimatedDelivery: Date
  status: "pending" | "processing" | "shipped" | "delivered"
}

export const createOrder = (items: any[], total: number): Order => {
  const now = new Date()
  const estimatedDelivery = addDays(now, 7) // 7 days from now

  return {
    id: generateOrderId(),
    items,
    total,
    createdAt: now,
    estimatedDelivery,
    status: "pending",
  }
}

export const formatOrderDate = (date: Date): string => {
  return formatDate(date)
}

export const formatOrderDateTime = (date: Date): string => {
  return formatDateTime(date)
}

export const getEstimatedDeliveryText = (date: Date): string => {
  const formatted = formatDate(date)
  return `Estimated delivery: ${formatted}`
}

const generateOrderId = (): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `ORD-${timestamp}-${random}`.toUpperCase()
}

export const getOrderStatusText = (status: Order["status"]): string => {
  const statusMap = {
    pending: "Order Pending",
    processing: "Processing Order",
    shipped: "Order Shipped",
    delivered: "Order Delivered",
  }
  return statusMap[status]
}
