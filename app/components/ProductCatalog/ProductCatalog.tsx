"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import styles from "./ProductCatalog.module.css"
import ProductDetail from "./ProductDetail"

interface Product {
  id: string
  name: string
  category: string
  price: number
  unit: string
  image: string
  description: string
  benefits: string[]
  origin: string
  inStock: boolean
}

interface ProductCatalogProps {
  products: Product[]
  title?: string
  showTitle?: boolean
}

const ProductCatalog = ({ products, title = "Featured Products", showTitle = true }: ProductCatalogProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const scrollContainerRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const handleScroll = (category: string, direction: "left" | "right") => {
    const container = scrollContainerRefs.current[category]
    if (container) {
      const scrollAmount = 300 // Adjust scroll amount as needed

      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
  }

  const closeProductDetail = () => {
    setSelectedProduct(null)
  }

  // Group products by category
  const productsByCategory: Record<string, Product[]> = {}
  products.forEach((product) => {
    if (!productsByCategory[product.category]) {
      productsByCategory[product.category] = []
    }
    productsByCategory[product.category].push(product)
  })

  return (
    <div className={`${styles.catalogContainer} animate-fadeIn`}>
      {showTitle && <h2 className="section-title animate-slideUp">{title}</h2>}

      {Object.entries(productsByCategory).map(([category, categoryProducts], categoryIndex) => (
        <div
          key={category}
          className={`${styles.categorySection} animate-slideUp`}
          style={{ animationDelay: `${categoryIndex * 0.1}s` }}
        >
          <h3 className={styles.categoryTitle}>{category}</h3>

          <div className={styles.scrollControls}>
            <button
              className={`${styles.scrollButton} animate-fadeIn`}
              onClick={() => handleScroll(category, "left")}
              aria-label="Scroll left"
              style={{ animationDelay: `${categoryIndex * 0.1 + 0.1}s` }}
            >
              <ChevronLeft size={24} />
            </button>

            <div className={styles.productsScroll} ref={(el) => (scrollContainerRefs.current[category] = el)}>
              {categoryProducts.map((product, productIndex) => (
                <div
                  key={product.id}
                  className={`${styles.productCard} animate-fadeIn`}
                  onClick={() => handleProductClick(product)}
                  style={{ animationDelay: `${categoryIndex * 0.1 + productIndex * 0.05}s` }}
                >
                  <div className={styles.productImageContainer}>
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={200}
                      height={200}
                      className={styles.productImage}
                    />
                  </div>
                  <h4 className={styles.productName}>{product.name}</h4>
                  <p className={styles.productPrice}>
                    ${product.price} <span className={styles.productUnit}>/ {product.unit}</span>
                  </p>
                </div>
              ))}
            </div>

            <button
              className={`${styles.scrollButton} animate-fadeIn`}
              onClick={() => handleScroll(category, "right")}
              aria-label="Scroll right"
              style={{ animationDelay: `${categoryIndex * 0.1 + 0.1}s` }}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      ))}

      {selectedProduct && <ProductDetail product={selectedProduct} onClose={closeProductDetail} />}
    </div>
  )
}

export default ProductCatalog
