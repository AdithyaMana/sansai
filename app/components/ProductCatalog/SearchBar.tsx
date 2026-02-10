"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import styles from "./SearchBar.module.css"

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

const SearchBar = ({ onSearch, placeholder = "Search products..." }: SearchBarProps) => {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={styles.searchInput}
      />
      <button type="submit" className={styles.searchButton} aria-label="Search">
        <Search size={20} />
      </button>
    </form>
  )
}

export default SearchBar
