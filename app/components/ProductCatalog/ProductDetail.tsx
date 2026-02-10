"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X, Plus, Minus, ShoppingCart } from "lucide-react"
import styles from "./ProductDetail.module.css"
import { useCart } from "../../context/CartContext"
import type { Product } from "../../types/product"
import { createLogger } from "../../utils/logger"

// Initialize module-specific logger
const logger = createLogger("ProductDetail")

interface ProductDetailProps {
  /** Product data to display */
  product: Product

  /** Callback function when modal is closed */
  onClose: () => void
}

/**
 * Modal component that displays detailed product information
 * and allows adding the product to cart
 */
const ProductDetail = ({ product, onClose }: ProductDetailProps) => {
  // Track selected quantity for cart
  const [quantity, setQuantity] = useState(1)

  // Access cart context
  const { addToCart } = useCart()

  /**
   * Handle quantity change with validation
   * @param changeAmount - Amount to change quantity by (positive or negative)
   */
  const handleQuantityChange = (changeAmount: number) => {
    const newQuantity = Math.max(1, quantity + changeAmount)
    logger.debug("Quantity changed", {
      productId: product.id,
      oldQuantity: quantity,
      newQuantity,
      changeAmount,
    })
    setQuantity(newQuantity)
  }

  /**
   * Add current product to cart with selected quantity
   */
  const handleAddToCart = () => {
    logger.debug("Adding product to cart", {
      productId: product.id,
      productName: product.name,
      quantity,
    })

    addToCart({
      id: product.id,
      name: product.name,
      quantity: quantity,
      image: product.image,
      unit: product.unit,
    })
  }

  /**
   * Set up keyboard event listener for Escape key to close modal
   * and prevent body scrolling while modal is open
   */
  useEffect(() => {
    logger.debug("ProductDetail mounted", { productId: product.id })

    // Handle Escape key press
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        logger.debug("Escape key pressed, closing modal")
        onClose()
      }
    }

    // Add event listener and disable body scroll
    document.addEventListener("keydown", handleEscKey)
    document.body.style.overflow = "hidden"

    // Clean up on unmount
    return () => {
      logger.debug("ProductDetail unmounting, restoring scroll")
      document.removeEventListener("keydown", handleEscKey)
      document.body.style.overflow = "auto"
    }
  }, [onClose, product.id])

  /**
   * Handle clicks on the backdrop to close the modal
   * but prevent clicks on the modal content from closing
   */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking directly on the backdrop (not its children)
    if (e.target === e.currentTarget) {
      logger.debug("Backdrop clicked, closing modal")
      onClose()
    }
  }

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick} data-testid="product-detail-modal">
      <div className={styles.modalContent}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close product details"
          data-testid="close-modal-button"
        >
          <X size={24} />
        </button>

        <div className={styles.productDetail}>
          <div className={styles.productImage}>
            <Image
              src={product.image || "/placeholder.svg?height=400&width=400"}
              alt={product.name}
              width={400}
              height={400}
              className={styles.image}
              onError={() => {
                logger.warn("Product image failed to load", {
                  productId: product.id,
                  imageSrc: product.image,
                })
              }}
            />
          </div>

          <div className={styles.productInfo}>
            <span className={styles.category}>{product.category}</span>
            <h2 className={styles.productName}>{product.name}</h2>

            <div className={styles.unitContainer}>
              <span className={styles.unit}>Quantity: {product.unit}</span>
            </div>

            <div className={styles.stockContainer}>
              <span className={styles.stockStatus} data-in-stock={product.inStock}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div className={styles.specifications}>
              <h3>Specifications</h3>
              <ul className={styles.specsList}>
                <li>
                  <span className={styles.specLabel}>Unit:</span>
                  <span className={styles.specValue}>{product.unit}</span>
                </li>
                <li>
                  <span className={styles.specLabel}>Category:</span>
                  <span className={styles.specValue}>{product.category}</span>
                </li>
                <li>
                  <span className={styles.specLabel}>Origin:</span>
                  <span className={styles.specValue}>{product.origin}</span>
                </li>
              </ul>
            </div>

            <div className={styles.description}>
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className={styles.benefits}>
              <h3>Benefits</h3>
              <ul>
                {product.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>

            {product.inStock && (
              <div className={styles.addToCartSection}>
                <div className={styles.quantitySelector}>
                  <button
                    className={styles.quantityButton}
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    data-testid="decrease-quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className={styles.quantityValue} data-testid="quantity-value">
                    {quantity}
                  </span>
                  <button
                    className={styles.quantityButton}
                    onClick={() => handleQuantityChange(1)}
                    aria-label="Increase quantity"
                    data-testid="increase-quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button className={styles.addToCartButton} onClick={handleAddToCart} data-testid="add-to-cart-button">
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
