"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import styles from "./FeaturedProducts.module.css"
import ProductDetail from "./ProductCatalog/ProductDetail"
import type { Product } from "../types/product"

interface FeaturedProductsProps {
  products: Product[]
}

const FeaturedProducts = ({ products }: FeaturedProductsProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null)
  }, [])

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement
    target.src = "/placeholder.svg?height=200&width=200&text=" + encodeURIComponent("Product Image")
  }, [])

  const scrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = 300

      // If we're at or near the beginning, jump to the end
      if (container.scrollLeft <= scrollAmount) {
        container.scrollLeft = container.scrollWidth - container.clientWidth
      } else {
        container.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        })
      }
    }
  }, [])

  const scrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = 300
      const maxScroll = container.scrollWidth - container.clientWidth

      // If we're at or near the end, jump to the beginning
      if (container.scrollLeft >= maxScroll - scrollAmount) {
        container.scrollLeft = 0
      } else {
        container.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        })
      }
    }
  }, [])

  // Don't render if no products
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className={styles.featuredSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className="section-title animate-slideUp">Featured Products</h2>
          <Link href="/products" className={`${styles.viewAllLink} animate-slideUp`} style={{ animationDelay: "0.2s" }}>
            View All Products
          </Link>
        </div>

        <div className={styles.scrollContainer}>
          <button className={styles.scrollButton} onClick={scrollLeft} aria-label="Scroll left">
            <ChevronLeft size={24} />
          </button>

          <div
            className={styles.productsScroll}
            ref={scrollContainerRef}
            role="region"
            aria-label="Featured products carousel"
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className={`${styles.productCard} animate-fadeIn`}
                onClick={() => handleProductClick(product)}
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${product.name}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleProductClick(product)
                  }
                }}
              >
                <div className={styles.productImageContainer}>
                  <img
                    src={product.image || "/placeholder.svg?height=200&width=200&text=Product"}
                    alt={product.name}
                    className={styles.productImage}
                    onError={handleImageError}
                    loading={index < 4 ? "eager" : "lazy"}
                  />
                </div>
                <div className={styles.productInfo}>
                  <span className={styles.category}>{product.category}</span>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <div className={styles.unitContainer}>
                    <span className={styles.unit}>Quantity: {product.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className={styles.scrollButton} onClick={scrollRight} aria-label="Scroll right">
            <ChevronRight size={24} />
          </button>
        </div>

        {selectedProduct && <ProductDetail product={selectedProduct} onClose={handleCloseModal} />}
      </div>
    </section>
  )
}

export default FeaturedProducts
