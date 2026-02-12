"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react"
import { useCart } from "../context/CartContext"
import { PhoneNumberModal } from "../components/PhoneNumberModal"
import styles from "./cart.module.css"

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleQuantityChange = (id: string, currentQuantity: number, change: number) => {
    const newQuantity = Math.max(1, currentQuantity + change)
    updateQuantity(id, newQuantity)
  }

  const handlePlaceOrderClick = () => {
    setIsModalOpen(true)
  }

  const handlePhoneSubmit = async (phoneNumber: string) => {
    try {
      setIsCheckingOut(true)

      // Prepare cart items data
      const cartData = cart.map((item) => ({
        productId: item.productId || item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price || 0,
        image: item.image,
        unit: item.unit,
      }))

      const cartTotal = cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0)

      // Submit order with phone number and cart items
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          cartItems: cartData,
          cartTotal,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to place order")
      }

      const data = await response.json()

      // Show success message and clear cart
      setSuccessMessage(data.message || "Order placed successfully! Our team will contact you shortly.")
      setIsModalOpen(false)
      setTimeout(() => {
        clearCart()
        setSuccessMessage("")
      }, 2000)
    } catch (error) {
      console.error("[v0] Enquiry submission error:", error)
      alert(error instanceof Error ? error.message : "Failed to submit enquiry")
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="container">
      {successMessage && (
        <div className={styles.successMessage}>
          <p>{successMessage}</p>
        </div>
      )}

      <h1 className={`section-title ${styles.pageTitle}`}>Your Shopping Cart</h1>

      <PhoneNumberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePhoneSubmit}
        isLoading={isCheckingOut}
      />

      {cart.length === 0 ? (
        <div className={styles.emptyCart}>
          <ShoppingBag size={64} className={styles.emptyCartIcon} />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any products to your cart yet.</p>
          <Link href="/products" className={`btn ${styles.continueShoppingBtn}`}>
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className={styles.cartLayout}>
          <div className={styles.cartItems}>
            <div className={styles.cartHeader}>
              <span className={styles.productColumn}>Product</span>
              <span className={styles.quantityColumn}>Quantity</span>
              <span className={styles.actionColumn}></span>
            </div>

            {cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.productColumn}>
                  <div className={styles.productInfo}>
                    <div className={styles.productImage}>
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} width={80} height={80} />
                    </div>
                    <div>
                      <h3 className={styles.productName}>{item.name}</h3>
                      <p className={styles.productUnit}>{item.unit}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.quantityColumn}>
                  <div className={styles.quantitySelector}>
                    <button
                      className={styles.quantityButton}
                      onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className={styles.quantityValue}>{item.quantity}</span>
                    <button
                      className={styles.quantityButton}
                      onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className={styles.actionColumn}>
                  <button
                    className={styles.removeButton}
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            <div className={styles.cartActions}>
              <button className={styles.clearCartButton} onClick={clearCart}>
                Clear Cart
              </button>
              <Link href="/products" className={styles.continueShoppingLink}>
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className={styles.orderSummary}>
            <h2 className={styles.summaryTitle}>Enquiry Details</h2>
            <p className={styles.enquiryText}>
              Interested in the products in your cart? Send us an enquiry and our team will contact you with more
              information about availability, pricing, and shipping options.
            </p>
            <button className={styles.checkoutButton} onClick={handlePlaceOrderClick} disabled={isCheckingOut}>
              {isCheckingOut ? "Processing..." : "Place Order"}
            </button>
            <p className={styles.secureCheckout}>
              <span className={styles.secureIcon}>📧</span> We'll respond within 24 hours
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
