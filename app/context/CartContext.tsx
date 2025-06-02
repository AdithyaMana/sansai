"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createLogger } from "../utils/logger"

// Initialize module-specific logger
const logger = createLogger("CartContext")

/**
 * Represents an item in the shopping cart
 */
export interface CartItem {
  id: string
  name: string
  quantity: number
  image: string
  unit: string
}

/**
 * Notification state for cart actions
 */
interface CartNotification {
  message: string
  isVisible: boolean
}

/**
 * Cart context interface defining all available cart operations
 */
interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getCartCount: () => number
  notification: CartNotification
  hideNotification: () => void
}

// Storage key for cart data persistence
const CART_STORAGE_KEY = "sansaiCart"

// Create context with undefined default value
const CartContext = createContext<CartContextType | undefined>(undefined)

/**
 * Provider component that wraps the application to provide cart functionality
 */
export function CartProvider({ children }: { children: ReactNode }) {
  // Cart state management
  const [cart, setCart] = useState<CartItem[]>([])

  // Notification state for user feedback
  const [notification, setNotification] = useState<CartNotification>({
    message: "",
    isVisible: false,
  })

  /**
   * Load cart data from localStorage on initial render
   */
  useEffect(() => {
    logger.debug("Initializing cart from localStorage")
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)
        logger.debug("Cart loaded successfully", { itemCount: parsedCart.length })
      }
    } catch (error) {
      logger.error("Failed to parse cart from localStorage", error instanceof Error ? error : new Error(String(error)))
      // Recover by initializing with empty cart
      setCart([])
    }
  }, [])

  /**
   * Save cart to localStorage whenever it changes
   */
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
      logger.debug("Cart saved to localStorage", { itemCount: cart.length })
    } catch (error) {
      logger.error("Failed to save cart to localStorage", error instanceof Error ? error : new Error(String(error)))
    }
  }, [cart])

  /**
   * Add an item to the cart or increase quantity if it already exists
   */
  const addToCart = (item: CartItem) => {
    logger.debug("Adding item to cart", { item })

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((cartItem) => cartItem.id === item.id)

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += item.quantity
        logger.debug("Updated existing item quantity", {
          id: item.id,
          newQuantity: updatedCart[existingItemIndex].quantity,
        })
        return updatedCart
      } else {
        // Item doesn't exist, add new item
        logger.debug("Added new item to cart", { id: item.id })
        return [...prevCart, item]
      }
    })

    // Show notification
    setNotification({
      message: `${item.name} added to cart`,
      isVisible: true,
    })
  }

  /**
   * Remove an item from the cart by ID
   */
  const removeFromCart = (id: string) => {
    logger.debug("Removing item from cart", { id })
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  /**
   * Update the quantity of an item in the cart
   * @param id - The ID of the item to update
   * @param quantity - The new quantity (must be positive)
   */
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      logger.warn("Attempted to set invalid quantity", { id, quantity })
      return
    }

    logger.debug("Updating item quantity", { id, quantity })
    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  /**
   * Clear all items from the cart
   */
  const clearCart = () => {
    logger.debug("Clearing cart")
    setCart([])
  }

  /**
   * Get the total number of items in the cart
   */
  const getCartCount = (): number => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  /**
   * Hide the notification
   */
  const hideNotification = () => {
    setNotification({ ...notification, isVisible: false })
  }

  // Context value with all cart operations
  const contextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    notification,
    hideNotification,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

/**
 * Custom hook to access the cart context
 * @throws Error if used outside of CartProvider
 */
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
