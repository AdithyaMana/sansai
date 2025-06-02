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
  return (
    <section className={styles.hero}>
      {/* Ship background image covering entire area */}
      <div className={styles.shipBackground}>
        <img src="/hero-ship.jpg" alt="Cargo ship representing global trade" className={styles.shipImage} />
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
