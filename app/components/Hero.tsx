"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import styles from "./Hero.module.css"

interface HeroProps {
  backgroundImage?: string
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
}

const Hero = ({
  backgroundImage = "/hero-ship.jpg",
  title = "Sansai: Bringing the Best of South India to the World",
  subtitle = "Experience the authentic flavors and traditions of South India",
  buttonText = "Explore Our Products",
  buttonLink = "/products",
}: HeroProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  useEffect(() => {
    // Preload the image to ensure it's available
    const img = new Image()

    img.onload = () => {
      setImageLoaded(true)
      setImageSrc(backgroundImage)
      setImageError(false)
    }

    img.onerror = () => {
      console.warn(`Failed to load hero image: ${backgroundImage}`)
      setImageError(true)
      setImageLoaded(false)
      // Try fallback placeholder
      const fallbackImg = new Image()
      fallbackImg.onload = () => {
        setImageSrc("/placeholder.svg?height=800&width=1200&text=Cargo+Ship")
        setImageLoaded(true)
      }
      fallbackImg.onerror = () => {
        // Complete fallback - no image
        setImageSrc(null)
        setImageLoaded(true)
      }
      fallbackImg.src = "/placeholder.svg?height=800&width=1200&text=Cargo+Ship"
    }

    img.src = backgroundImage
  }, [backgroundImage])

  const handleImageError = () => {
    console.warn("Hero image failed to render, using fallback")
    setImageError(true)
    setImageSrc(null)
  }

  return (
    <section className={`${styles.hero} ${imageError ? styles.heroFallback : ""}`}>
      {/* Ship background image covering entire area */}
      <div className={styles.shipBackground}>
        {imageSrc && imageLoaded && (
          <img
            src={imageSrc || "/placeholder.svg"}
            alt="Cargo ship representing global trade"
            className={`${styles.shipImage} ${imageLoaded ? styles.imageLoaded : ""}`}
            onError={handleImageError}
            loading="eager"
            decoding="async"
          />
        )}

        {/* Loading state */}
        {!imageLoaded && !imageError && (
          <div className={styles.imageLoading}>
            <div className={styles.loadingSpinner}></div>
          </div>
        )}
      </div>

      {/* Green overlay to maintain brand colors and text readability */}
      <div className={styles.greenOverlay}></div>

      {/* Text overlay for enhanced readability */}
      <div className={styles.textOverlay}></div>

      <div className="container">
        <div className={styles.content}>
          <h1 className={`${styles.title} animate-slideUp`} style={{ animationDelay: "0.2s" }}>
            {title}
          </h1>
          <p className={`${styles.subtitle} animate-slideUp`} style={{ animationDelay: "0.4s" }}>
            {subtitle}
          </p>
          <div className="animate-slideUp" style={{ animationDelay: "0.6s" }}>
            <Link href={buttonLink} className={`btn ${styles.heroBtn}`}>
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
