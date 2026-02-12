"use client"

import type React from "react"

import { useCallback } from "react"
import Image from "next/image"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import styles from "./ProductGrid.module.css"
import { useCart } from "../../context/CartContext"
import type { Product } from "../../types/product"

interface ProductGridProps {
  products: Product[]
  onProductClick: (product: Product) => void
}

const ProductGrid = ({ products, onProductClick }: ProductGridProps) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart()

  // Get quantity of a product in the cart
  const getCartQuantity = useCallback(
    (productId: string) => {
      const item = cart.find((i) => i.id === productId)
      return item ? item.quantity : 0
    },
    [cart]
  )

  const handleAddToCart = useCallback(
    (e: React.MouseEvent, product: Product) => {
      e.stopPropagation()
      addToCart({
        id: product.id,
        name: product.name,
        quantity: 1,
        image: product.image,
        unit: product.unit,
      })
    },
    [addToCart]
  )

  const handleIncrement = useCallback(
    (e: React.MouseEvent, product: Product) => {
      e.stopPropagation()
      const currentQty = getCartQuantity(product.id)
      updateQuantity(product.id, currentQty + 1)
    },
    [getCartQuantity, updateQuantity]
  )

  const handleDecrement = useCallback(
    (e: React.MouseEvent, product: Product) => {
      e.stopPropagation()
      const currentQty = getCartQuantity(product.id)
      if (currentQty <= 1) {
        removeFromCart(product.id)
      } else {
        updateQuantity(product.id, currentQty - 1)
      }
    },
    [getCartQuantity, updateQuantity, removeFromCart]
  )

  if (products.length === 0) {
    return (
      <div className={styles.noResults}>
        <div className={styles.noResultsIcon}>🔍</div>
        <h3>No products found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <div className={styles.productGrid}>
      {products.map((product) => {
        const quantity = getCartQuantity(product.id)
        const isInCart = quantity > 0

        return (
          <div
            key={product.id}
            className={styles.productCard}
            onClick={() => onProductClick(product)}
            role="button"
            tabIndex={0}
            aria-label={`View ${product.name}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onProductClick(product)
              }
            }}
          >
            <div className={styles.productImageContainer}>
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={200}
                height={200}
                className={styles.productImage}
              />
              {product.inStock ? (
                <span className={styles.stockBadge}>In Stock</span>
              ) : (
                <span className={`${styles.stockBadge} ${styles.outOfStock}`}>Out of Stock</span>
              )}
            </div>
            <div className={styles.productInfo}>
              <span className={styles.category}>{product.category}</span>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productDescription}>
                {product.description.length > 80
                  ? product.description.slice(0, 80) + "..."
                  : product.description}
              </p>
              <div className={styles.productFooter}>
                <span className={styles.unit}>{product.unit}</span>
                {product.inStock ? (
                  isInCart ? (
                    <div className={styles.quantitySelector} onClick={(e) => e.stopPropagation()}>
                      <button
                        className={styles.quantityButton}
                        onClick={(e) => handleDecrement(e, product)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className={styles.quantityValue}>{quantity}</span>
                      <button
                        className={styles.quantityButton}
                        onClick={(e) => handleIncrement(e, product)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className={styles.addToCartButton}
                      onClick={(e) => handleAddToCart(e, product)}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <ShoppingCart size={14} />
                      Add to Cart
                    </button>
                  )
                ) : (
                  <button className={`${styles.addToCartButton} ${styles.disabled}`} disabled>
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProductGrid
