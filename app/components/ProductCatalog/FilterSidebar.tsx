"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import styles from "./FilterSidebar.module.css"

interface Category {
  name: string
  count: number
}

interface FilterSidebarProps {
  categories: Category[]
  onCategoryChange: (category: string) => void
  selectedCategory: string
  onClearFilters: () => void
}

const FilterSidebar = ({ categories, onCategoryChange, selectedCategory, onClearFilters }: FilterSidebarProps) => {
  const [categoryExpanded, setCategoryExpanded] = useState(true)

  return (
    <div className={styles.sidebar}>
      <div className={styles.filterHeader}>
        <h3>Filters</h3>
        <button className={styles.clearButton} onClick={onClearFilters}>
          Clear All
        </button>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterTitle} onClick={() => setCategoryExpanded(!categoryExpanded)}>
          <h4>Categories</h4>
          {categoryExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        {categoryExpanded && (
          <ul className={styles.filterList}>
            <li
              className={`${styles.filterItem} ${selectedCategory === "all" ? styles.active : ""}`}
              onClick={() => onCategoryChange("all")}
            >
              All Products
              <span className={styles.count}>{categories.reduce((acc, cat) => acc + cat.count, 0)}</span>
            </li>
            {categories.map((category) => (
              <li
                key={category.name}
                className={`${styles.filterItem} ${selectedCategory === category.name ? styles.active : ""}`}
                onClick={() => onCategoryChange(category.name)}
              >
                {category.name}
                <span className={styles.count}>{category.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default FilterSidebar
