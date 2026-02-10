"use client"

import { useState } from "react"
import Image from "next/image"
import styles from "./LogoOptimized.module.css"

interface LogoOptimizedProps {
  /** Size variant for different use cases */
  size?: "small" | "medium" | "large"
  /** Whether to show on dark background */
  variant?: "light" | "dark"
  /** Additional CSS classes */
  className?: string
  /** Whether logo should be clickable */
  clickable?: boolean
}

const LogoOptimized = ({
  size = "medium",
  variant = "light",
  className = "",
  clickable = true,
}: LogoOptimizedProps) => {
  const [imageError, setImageError] = useState(false)

  // Size configurations
  const sizeConfig = {
    small: { width: 80, height: 96 },
    medium: { width: 120, height: 144 },
    large: { width: 160, height: 192 },
  }

  const { width, height } = sizeConfig[size]

  const logoClasses = `
    ${styles.logo} 
    ${styles[size]} 
    ${styles[variant]} 
    ${clickable ? styles.clickable : ""} 
    ${className}
  `.trim()

  const handleImageError = () => {
    setImageError(true)
  }

  // Fallback SVG if image fails to load
  const FallbackLogo = () => (
    <div className={styles.fallback} style={{ width, height }}>
      <div className={styles.fallbackText}>SANSAI</div>
    </div>
  )

  if (imageError) {
    return <FallbackLogo />
  }

  return (
    <div className={logoClasses}>
      <Image
        src="/sansai-logo.png"
        alt="Sansai - Premium Spices & Ingredients"
        width={width}
        height={height}
        priority={size === "medium"} // Prioritize medium size (header)
        className={styles.logoImage}
        onError={handleImageError}
        sizes={`
          (max-width: 480px) ${Math.round(width * 0.8)}px,
          (max-width: 768px) ${Math.round(width * 0.9)}px,
          ${width}px
        `}
      />
    </div>
  )
}

export default LogoOptimized
