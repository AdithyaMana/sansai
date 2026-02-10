"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createLogger } from "../utils/logger"

// Initialize module-specific logger
const logger = createLogger("CartContext")

/**
 * Represents an item in the shopping cart with database sync
 */
export interface CartItem {
  id: string
  name: string
  quantity: number
  image: string
  unit: string
  price?: number
  productId?: string
  cartItemId?: string // Database ID for cart_items table
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
  addToCart: (item: CartItem) => Promise<void>
  removeFromCart: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => void
  getCartCount: () => number
  notification: CartNotification
  hideNotification: () => void
  isLoading: boolean
}

// Storage key for fallback cart data persistence
const CART_STORAGE_KEY = "sansaiCart"
const USER_ID_KEY = "sansaiUserId"

// Create context with undefined default value
const CartContext = createContext<CartContextType | undefined>(undefined)

/**
 * Get or create a user ID for anonymous users
 */
function getUserId(): string {
  if (typeof window === "undefined") return "anonymous"

  let userId = localStorage.getItem(USER_ID_KEY)
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(USER_ID_KEY, userId)
  }
  return userId
}

/**
 * Provider component that wraps the application to provide cart functionality
 */
export function CartProvider({ children }: { children: ReactNode }) {
  // Cart state management
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Notification state for user feedback
  const [notification, setNotification] = useState<CartNotification>({
    message: "",
    isVisible: false,
  })

  /**
   * Fetch cart from database on initial render
   */
  useEffect(() => {
    const loadCart = async () => {
      logger.debug("Fetching cart from database")
      try {
        setIsLoading(true)
        const userId = getUserId()
        const response = await fetch("/api/cart", {
          headers: {
            "x-user-id": userId,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch cart")
        }

        const data = await response.json()
        setCart(data.items || [])
        logger.debug("Cart loaded from database", { itemCount: data.items?.length || 0 })
      } catch (error) {
        logger.error("Failed to load cart from database", error instanceof Error ? error : new Error(String(error)))
        // Fallback to localStorage
        try {
          const savedCart = localStorage.getItem(CART_STORAGE_KEY)
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart)
            setCart(parsedCart)
            logger.debug("Cart loaded from localStorage fallback", { itemCount: parsedCart.length })
          }
        } catch (storageError) {
          logger.error("Failed to load cart from localStorage", storageError instanceof Error ? storageError : new Error(String(storageError)))
          setCart([])
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [])

  /**
   * Add an item to the cart via database
   */
  const addToCart = async (item: CartItem) => {
    logger.debug("Adding item to cart", { item })

    try {
      setIsLoading(true)
      const userId = getUserId()

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          productId: item.productId || item.id,
          quantity: item.quantity || 1,
          price: item.price || 0,
          name: item.name,
          image: item.image,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add item to cart")
      }

      // Refresh cart from database
      const cartResponse = await fetch("/api/cart", {
        headers: {
          "x-user-id": userId,
        },
      })

      if (cartResponse.ok) {
        const data = await cartResponse.json()
        setCart(data.items || [])
      }

      // Show notification
      setNotification({
        message: `${item.name} added to cart`,
        isVisible: true,
      })
      logger.debug("Item added to cart successfully", { id: item.id })
    } catch (error) {
      logger.error("Failed to add item to cart", error instanceof Error ? error : new Error(String(error)))
      setNotification({
        message: "Failed to add item to cart",
        isVisible: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Remove an item from the cart by ID
   */
  const removeFromCart = async (id: string) => {
    logger.debug("Removing item from cart", { id })

    try {
      setIsLoading(true)

      // Find the cart item ID
      const item = cart.find((cartItem) => cartItem.id === id || cartItem.cartItemId === id)
      if (!item?.cartItemId) {
        throw new Error("Cart item ID not found")
      }

      const response = await fetch(`/api/cart?itemId=${item.cartItemId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove item from cart")
      }

      setCart((prevCart) => prevCart.filter((item) => item.id !== id && item.cartItemId !== id))
      logger.debug("Item removed from cart", { id })
    } catch (error) {
      logger.error("Failed to remove item from cart", error instanceof Error ? error : new Error(String(error)))
      setNotification({
        message: "Failed to remove item from cart",
        isVisible: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Update the quantity of an item in the cart
   */
  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 0) {
      logger.warn("Attempted to set invalid quantity", { id, quantity })
      return
    }

    logger.debug("Updating item quantity", { id, quantity })

    try {
      setIsLoading(true)

      // Find the cart item ID
      const item = cart.find((cartItem) => cartItem.id === id || cartItem.cartItemId === id)
      if (!item?.cartItemId) {
        throw new Error("Cart item ID not found")
      }

      if (quantity === 0) {
        // Delete item
        await removeFromCart(id)
      } else {
        // Update quantity
        const response = await fetch("/api/cart", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemId: item.cartItemId,
            quantity,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to update item quantity")
        }

        setCart((prevCart) =>
          prevCart.map((cartItem) =>
            cartItem.id === id || cartItem.cartItemId === id ? { ...cartItem, quantity } : cartItem
          )
        )
      }

      logger.debug("Item quantity updated", { id, quantity })
    } catch (error) {
      logger.error("Failed to update item quantity", error instanceof Error ? error : new Error(String(error)))
      setNotification({
        message: "Failed to update item quantity",
        isVisible: true,
      })
    } finally {
      setIsLoading(false)
    }
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
    isLoading,
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
