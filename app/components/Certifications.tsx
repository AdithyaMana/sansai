"use client"

import Image from "next/image"
import styles from "./Certifications.module.css"
import { useAutoScroll } from "../utils/useAutoScroll"

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
  // Use slightly slower scrolling for certifications since they contain more text
  const { scrollContainerRef, setIsHovering } = useAutoScroll({
    pixelsPerScroll: 2.5,
    scrollInterval: 16,
  })

  return (
    <section className={styles.certifications}>
      <div className="container">
        <h2 className="section-title animate-slideUp">Quality Certifications</h2>
        <p className={`${styles.intro} animate-slideUp`} style={{ animationDelay: "0.2s" }}>
          At Sansai, we adhere to the highest quality standards and have earned various certifications that reflect our
          commitment to excellence and food safety.
        </p>

        <div className={styles.scrollContainer}>
          <div
            className={styles.certificationsScroll}
            ref={scrollContainerRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {certifications.map((cert, index) => (
              <div
                key={cert.id}
                className={`${styles.certCard} animate-fadeIn`}
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className={styles.logoContainer}>
                  <Image
                    src={cert.logo || "/placeholder.svg?height=80&width=80"}
                    alt={`${cert.name} certification`}
                    width={80}
                    height={80}
                    className={styles.logo}
                  />
                </div>
                <div className={styles.certContent}>
                  <h3 className={styles.certName}>{cert.name}</h3>
                  <p className={styles.certDescription}>{cert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Certifications
