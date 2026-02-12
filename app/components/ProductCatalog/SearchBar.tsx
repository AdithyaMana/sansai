"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Search, X } from "lucide-react"
import styles from "./SearchBar.module.css"

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

const SearchBar = ({ onSearch, placeholder = "Search products..." }: SearchBarProps) => {
  const [query, setQuery] = useState("")

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setQuery(value)
      onSearch(value)
    },
    [onSearch]
  )

  const handleClear = useCallback(() => {
    setQuery("")
    onSearch("")
  }, [onSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <div className={styles.searchIcon}>
        <Search size={18} />
      </div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className={styles.searchInput}
      />
      {query && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </form>
  )
}

export default SearchBar
