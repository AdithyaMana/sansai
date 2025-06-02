"use client"

import { useState } from "react"
import Link from "next/link"
import styles from "./HardwareProductsSection.module.css"
import ProductDetail from "./ProductCatalog/ProductDetail"
import type { Product } from "../types/product"
import { useAutoScroll } from "../utils/useAutoScroll"

interface HardwareProductsSectionProps {
  products: Product[]
}

const HardwareProductsSection = ({ products }: HardwareProductsSectionProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  // Use faster scrolling for hardware products
  const { scrollContainerRef, setIsHovering } = useAutoScroll({
    pixelsPerScroll: 3,
    scrollInterval: 16,
  })

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
  }

  return (
    <section className={styles.hardwareSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className="section-title animate-slideUp">Hardware Products</h2>
          <Link
            href="/products?category=Hardware"
            className={`${styles.viewAllLink} animate-slideUp`}
            style={{ animationDelay: "0.2s" }}
          >
            View All Hardware
          </Link>
        </div>

        <div className={styles.scrollContainer}>
          <div
            className={styles.productsScroll}
            ref={scrollContainerRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className={`${styles.productCard} animate-fadeIn`}
                onClick={() => handleProductClick(product)}
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <div className={styles.productImageContainer}>
                  <img src={product.image || "/placeholder.svg"} alt={product.name} className={styles.productImage} />
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
        </div>

        {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      </div>
    </section>
  )
}

export default HardwareProductsSection
