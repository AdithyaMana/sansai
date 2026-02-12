"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react"
import styles from "./Header.module.css"
import { useCart } from "../context/CartContext"

const Header = () => {
  const { cart, getCartCount, updateQuantity, removeFromCart } = useCart()
  const cartCount = getCartCount()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const cartRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!isCartOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setIsCartOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isCartOpen])

  // Close on Escape
  useEffect(() => {
    if (!isCartOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartOpen(false)
    }

    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [isCartOpen])

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/sansai-logo.png"
            alt="Sansai Logo"
            width={160}
            height={192}
            priority
            className={styles.logoImage}
          />
        </Link>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/products" className={styles.navLink}>
            Products
          </Link>
          <Link href="/about" className={styles.navLink}>
            About Us
          </Link>
          <Link href="/contact" className={styles.navLink}>
            Contact
          </Link>

          {/* Cart with mini-drawer */}
          <div className={styles.cartWrapper} ref={cartRef}>
            <button
              className={styles.cartLink}
              onClick={() => setIsCartOpen(!isCartOpen)}
              aria-label={`Shopping cart, ${cartCount} items`}
              aria-expanded={isCartOpen}
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className={styles.cartCount}>{cartCount}</span>
              )}
            </button>

            {/* Mini-cart dropdown */}
            {isCartOpen && (
              <div className={styles.miniCart}>
                <div className={styles.miniCartHeader}>
                  <h4>Shopping Cart</h4>
                  <button
                    className={styles.miniCartClose}
                    onClick={() => setIsCartOpen(false)}
                    aria-label="Close cart"
                  >
                    <X size={14} />
                  </button>
                </div>

                {cartCount === 0 ? (
                  <div className={styles.miniCartEmpty}>
                    <ShoppingCart size={28} strokeWidth={1.5} />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className={styles.miniCartItems}>
                      {cart.map((item) => (
                        <div key={item.id} className={styles.miniCartItem}>
                          <div className={styles.miniCartItemImage}>
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={44}
                              height={44}
                            />
                          </div>
                          <div className={styles.miniCartItemInfo}>
                            <span className={styles.miniCartItemName}>{item.name}</span>
                            <span className={styles.miniCartItemUnit}>{item.unit}</span>
                          </div>
                          <div className={styles.miniCartQty}>
                            <button
                              className={styles.miniCartQtyBtn}
                              onClick={() => {
                                if (item.quantity <= 1) {
                                  removeFromCart(item.id)
                                } else {
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                              }}
                              aria-label="Decrease"
                            >
                              {item.quantity <= 1 ? <Trash2 size={10} /> : <Minus size={10} />}
                            </button>
                            <span className={styles.miniCartQtyVal}>{item.quantity}</span>
                            <button
                              className={styles.miniCartQtyBtn}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={styles.miniCartFooter}>
                      <Link
                        href="/cart"
                        className={styles.miniCartCheckout}
                        onClick={() => setIsCartOpen(false)}
                      >
                        View Cart & Checkout →
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
