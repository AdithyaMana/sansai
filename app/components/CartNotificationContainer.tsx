"use client"

import { useCart } from "../context/CartContext"
import CartNotification from "./CartNotification"

export default function CartNotificationContainer() {
  const { notification, hideNotification } = useCart()

  return (
    <CartNotification message={notification.message} isVisible={notification.isVisible} onClose={hideNotification} />
  )
}
