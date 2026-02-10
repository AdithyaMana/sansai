"use client"

import Image from "next/image"
import { useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import styles from "./Certifications.module.css"

interface Certification {
  id: string
  name: string
  logo: string
  description: string
}

const certifications: Certification[] = [
  {
    id: "iso",
    name: "ISO 22000",
    logo: "/certifications/iso-22000.svg",
    description:
      "International food safety management system certification ensuring our products meet the highest safety standards.",
  },
  {
    id: "organic",
    name: "Organic Certified",
    logo: "/certifications/organic.svg",
    description:
      "Our organic products are certified by international organic standards, ensuring sustainable farming practices.",
  },
  {
    id: "haccp",
    name: "HACCP",
    logo: "/certifications/haccp.svg",
    description:
      "Hazard Analysis Critical Control Point certification for systematic preventive approach to food safety.",
  },
  {
    id: "fssai",
    name: "FSSAI",
    logo: "/certifications/fssai.svg",
    description:
      "Food Safety and Standards Authority of India certification for all our products distributed in India.",
  },
  {
    id: "iso9001",
    name: "ISO 9001",
    logo: "/certifications/iso-9001.svg",
    description:
      "Quality management system certification demonstrating our commitment to consistent quality and customer satisfaction.",
  },
  {
    id: "bis",
    name: "BIS Certification",
    logo: "/certifications/bis.svg",
    description:
      "Bureau of Indian Standards certification ensuring our hardware products meet national quality standards.",
  },
]

const Certifications = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = 400

      // If we're at or near the beginning, jump to the end
      if (container.scrollLeft <= scrollAmount) {
        container.scrollLeft = container.scrollWidth - container.clientWidth
      } else {
        container.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        })
      }
    }
  }, [])

  const scrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = 400
      const maxScroll = container.scrollWidth - container.clientWidth

      // If we're at or near the end, jump to the beginning
      if (container.scrollLeft >= maxScroll - scrollAmount) {
        container.scrollLeft = 0
      } else {
        container.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        })
      }
    }
  }, [])

  return (
    <section className={styles.certifications}>
      <div className="container">
        <h2 className="section-title animate-slideUp">Quality Certifications</h2>
        <p className={`${styles.intro} animate-slideUp`} style={{ animationDelay: "0.2s" }}>
          At Sansai, we adhere to the highest quality standards and have earned various certifications that reflect our
          commitment to excellence and food safety.
        </p>

        <div className={styles.scrollContainer}>
          <button className={styles.scrollButton} onClick={scrollLeft} aria-label="Scroll left">
            <ChevronLeft size={24} />
          </button>

          <div
            className={styles.certificationsScroll}
            ref={scrollContainerRef}
            role="region"
            aria-label="Quality certifications carousel"
          >
            {certifications.map((cert, index) => (
              <div
                key={cert.id}
                className={`${styles.certCard} animate-fadeIn`}
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                role="article"
                aria-labelledby={`cert-${cert.id}-title`}
              >
                <div className={styles.logoContainer}>
                  <Image
                    src={cert.logo || "/placeholder.svg?height=80&width=80"}
                    alt={`${cert.name} certification logo`}
                    width={80}
                    height={80}
                    className={styles.logo}
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                </div>
                <div className={styles.certContent}>
                  <h3 className={styles.certName} id={`cert-${cert.id}-title`}>
                    {cert.name}
                  </h3>
                  <p className={styles.certDescription}>{cert.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button className={styles.scrollButton} onClick={scrollRight} aria-label="Scroll right">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default Certifications
