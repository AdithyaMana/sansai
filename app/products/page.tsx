"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react"
import styles from "./products.module.css"
import SearchBar from "../components/ProductCatalog/SearchBar"
import FilterSidebar from "../components/ProductCatalog/FilterSidebar"
import SortOptions from "../components/ProductCatalog/SortOptions"
import ProductGrid from "../components/ProductCatalog/ProductGrid"
import Pagination from "../components/ProductCatalog/Pagination"
import ProductDetail from "../components/ProductCatalog/ProductDetail"
import productsData from "../data/products.json"
import type { Product } from "../types/product"
import { useCart } from "../context/CartContext"

interface Category {
  name: string
  count: number
}

// Extract categories once from static data
const allProducts = productsData as Product[]
const allCategories: Category[] = Object.entries(
  allProducts.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1
    return acc
  }, {})
).map(([name, count]) => ({ name, count }))

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
]

const PRODUCTS_PER_PAGE = 12

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortOption, setSortOption] = useState("featured")
  const [currentPage, setCurrentPage] = useState(1)
  const { cart, removeFromCart, getCartCount } = useCart()

  // Derive filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((product) => product.category === selectedCategory)
    }

    // Sort
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
    }

    return result
  }, [searchQuery, selectedCategory, sortOption])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  )

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({
      top: document.getElementById("product-section")?.offsetTop || 0,
      behavior: "smooth",
    })
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSortOption("featured")
    setCurrentPage(1)
  }

  const cartCount = getCartCount()

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.productsHeader}>
        <h1 className="section-title">Our Products</h1>
      </div>

      <div className={styles.searchContainer}>
        <SearchBar onSearch={handleSearch} placeholder="Search for spices, snacks, beverages..." />
      </div>

      <div className={`${styles.productLayout} ${cartCount > 0 ? styles.withCart : ""}`} id="product-section">
        <div className={styles.filterColumn}>
          <FilterSidebar
            categories={allCategories}
            onCategoryChange={handleCategoryChange}
            selectedCategory={selectedCategory}
            onClearFilters={handleClearFilters}
          />
        </div>

        <div className={styles.productColumn}>
          <div className={styles.productHeader}>
            <div className={styles.resultCount}>
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
            </div>
            <SortOptions options={sortOptions} onSortChange={(option) => setSortOption(option)} defaultValue={sortOption} />
          </div>

          <ProductGrid products={currentProducts} onProductClick={setSelectedProduct} />

          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </div>

        {/* Cart Sidebar */}
        {cartCount > 0 && (
          <div className={styles.cartColumn}>
            <div className={styles.cartSidebar}>
              <div className={styles.cartSidebarHeader}>
                <div className={styles.cartSidebarTitle}>
                  <ShoppingCart size={18} />
                  <span>Your Cart</span>
                </div>
                <span className={styles.cartBadge}>{cartCount} {cartCount === 1 ? "item" : "items"}</span>
              </div>

              <div className={styles.cartItemsList}>
                {cart.map((item) => (
                  <div key={item.id} className={styles.cartSidebarItem}>
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={44}
                        height={44}
                        className={styles.cartItemImage}
                      />
                    )}
                    <div className={styles.cartItemInfo}>
                      <span className={styles.cartItemName}>{item.name}</span>
                      <span className={styles.cartItemMeta}>
                        {item.unit} · Qty: {item.quantity}
                      </span>
                    </div>
                    <button
                      className={styles.cartItemRemove}
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <Link href="/cart" className={styles.viewCartButton}>
                View Cart
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  )
}

