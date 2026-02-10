"use client"

import { useEffect } from "react"
import { ShoppingCart, X } from "lucide-react"
import styles from "./CartNotification.module.css"

interface CartNotificationProps {
  message: string
  isVisible: boolean
  onClose: () => void
}

const CartNotification = ({ message, isVisible, onClose }: CartNotificationProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className={styles.notification}>
      <div className={styles.icon}>
        <ShoppingCart size={18} />
      </div>
      <p className={styles.message}>{message}</p>
      <button className={styles.closeButton} onClick={onClose} aria-label="Close notification">
        <X size={16} />
      </button>
    </div>
  )
}

export default CartNotification
