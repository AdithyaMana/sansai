"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import styles from "./SortOptions.module.css"

interface SortOption {
  value: string
  label: string
}

interface SortOptionsProps {
  options: SortOption[]
  onSortChange: (value: string) => void
  defaultValue?: string
}

const SortOptions = ({ options, onSortChange, defaultValue = "featured" }: SortOptionsProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(
    options.find((option) => option.value === defaultValue) || options[0],
  )
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const handleSelect = (option: SortOption) => {
    setSelectedOption(option)
    onSortChange(option.value)
    setIsOpen(false)
  }

  return (
    <div className={styles.sortContainer} ref={dropdownRef}>
      <div className={styles.sortLabel}>Sort by:</div>
      <div className={styles.dropdown}>
        <button
          className={`${styles.dropdownToggle} ${isOpen ? styles.open : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {selectedOption.label}
          <ChevronDown size={16} className={`${styles.chevron} ${isOpen ? styles.rotated : ""}`} />
        </button>

        {isOpen && (
          <ul className={styles.dropdownMenu} role="listbox">
            {options.map((option) => (
              <li
                key={option.value}
                className={`${styles.dropdownItem} ${selectedOption.value === option.value ? styles.active : ""}`}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={selectedOption.value === option.value}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default SortOptions
