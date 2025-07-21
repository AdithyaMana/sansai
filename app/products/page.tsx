"use client"

import { useState, useEffect } from "react"
import styles from "./products.module.css"
import SearchBar from "../components/ProductCatalog/SearchBar"
import FilterSidebar from "../components/ProductCatalog/FilterSidebar"
import SortOptions from "../components/ProductCatalog/SortOptions"
import ProductGrid from "../components/ProductCatalog/ProductGrid"
import Pagination from "../components/ProductCatalog/Pagination"
import ProductDetail from "../components/ProductCatalog/ProductDetail"
import productsData from "../data/products.json"

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

interface Category {
  name: string
  count: number
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortOption, setSortOption] = useState("featured")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const productsPerPage = 12

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ]

  useEffect(() => {
    const loadProducts = () => {
      try {
        // Use the imported JSON data directly
        const data = productsData as Product[]
        setProducts(data)

        // Extract categories
        const categoryMap = data.reduce((acc: Record<string, number>, product: Product) => {
          acc[product.category] = (acc[product.category] || 0) + 1
          return acc
        }, {})

        const categoryList = Object.entries(categoryMap).map(([name, count]) => ({
          name,
          count: count as number,
        }))

        setCategories(categoryList)
        setFilteredProducts(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading products:", error)
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    // Apply filters and sorting
    let result = [...products]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter((product) => product.category === selectedCategory)
    }

    // Apply sorting
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
      default:
        // 'featured' - no specific sorting
        break
    }

    setFilteredProducts(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [products, searchQuery, selectedCategory, sortOption])

  // Get current page products
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of product section
    window.scrollTo({
      top: document.getElementById("product-section")?.offsetTop || 0,
      behavior: "smooth",
    })
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSortOption("featured")
  }

  const handleSortChange = (option: string) => {
    setSortOption(option)
  }

  return (
    <div className="container">
      <div className={styles.productsHeader}>
        <h1 className="section-title">Our Products</h1>
      </div>

      <div className={styles.searchContainer}>
        <SearchBar onSearch={handleSearch} placeholder="Search for spices, snacks, beverages..." />
      </div>

      <div className={styles.productLayout} id="product-section">
        <div className={styles.filterColumn}>
          <FilterSidebar
            categories={categories}
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
            <SortOptions options={sortOptions} onSortChange={handleSortChange} defaultValue={sortOption} />
          </div>

          {isLoading ? (
            <div className={styles.loading}>
              <p>Loading products...</p>
            </div>
          ) : (
            <>
              <ProductGrid products={currentProducts} onProductClick={handleProductClick} />

              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              )}
            </>
          )}
        </div>
      </div>

      {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  )
}
