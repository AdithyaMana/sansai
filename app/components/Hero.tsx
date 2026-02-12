"use client"

import { useState } from "react"
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
  const [imageError, setImageError] = useState(false)

  return (
    <section className={`${styles.hero} ${imageError ? styles.heroFallback : ""}`}>
      <div className={styles.shipBackground}>
        {!imageError && (
          <img
            src={backgroundImage}
            alt="Cargo ship representing global trade"
            className={styles.shipImage}
            onError={() => setImageError(true)}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        )}
      </div>

      <div className={styles.greenOverlay}></div>
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
