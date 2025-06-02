"use client"

import type React from "react"

import Image from "next/image"
import { Heart, ShoppingCart } from "lucide-react"
import styles from "./ProductGrid.module.css"
import { useCart } from "../../context/CartContext"
import type { Product } from "../../types/product"

interface ProductGridProps {
  products: Product[]
  onProductClick: (product: Product) => void
}

const ProductGrid = ({ products, onProductClick }: ProductGridProps) => {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation()

    addToCart({
      id: product.id,
      name: product.name,
      quantity: 1,
      image: product.image,
      unit: product.unit,
    })
  }

  return (
    <div className={styles.productGrid}>
      {products.length === 0 ? (
        <div className={styles.noResults}>
          <p>No products found. Try adjusting your filters.</p>
        </div>
      ) : (
        products.map((product) => (
          <div key={product.id} className={styles.productCard} onClick={() => onProductClick(product)}>
            <div className={styles.productImageContainer}>
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={200}
                height={200}
                className={styles.productImage}
              />
              <button
                className={styles.wishlistButton}
                aria-label="Add to wishlist"
                onClick={(e) => e.stopPropagation()}
              >
                <Heart size={18} />
              </button>
              {product.inStock ? (
                <span className={styles.stockBadge}>In Stock</span>
              ) : (
                <span className={`${styles.stockBadge} ${styles.outOfStock}`}>Out of Stock</span>
              )}
            </div>
            <div className={styles.productInfo}>
              <span className={styles.category}>{product.category}</span>
              <h3 className={styles.productName}>{product.name}</h3>
              <div className={styles.unitContainer}>
                <span className={styles.unit}>Quantity: {product.unit}</span>
              </div>
              {product.inStock && (
                <button
                  className={styles.addToCartButton}
                  onClick={(e) => handleAddToCart(e, product)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              )}
              {!product.inStock && (
                <button className={`${styles.addToCartButton} ${styles.disabled}`} disabled>
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default ProductGrid
