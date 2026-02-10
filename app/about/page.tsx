import Image from "next/image"
import styles from "./about.module.css"

export default function About() {
  return (
    <div className={styles.about}>
      <div className="container">
        <h1 className="section-title">About Sansai</h1>
        <div className={styles.content}>
          <div className={styles.imageWrapper}>
            <Image src="/about-image.jpg" alt="Sansai team" width={600} height={400} />
          </div>
          <div className={styles.text}>
            <h2>Our Story</h2>
            <p>
              Sansai was born out of a passion for sharing the rich culinary heritage of South India with the world.
              Founded in 2010, we started as a small family-owned business and have since grown into a leading exporter
              of premium South Indian products.
            </p>
            <h2>Our Mission</h2>
            <p>
              At Sansai, our mission is to bring the authentic flavors and traditions of South India to global markets
              while supporting local farmers and artisans. We strive to maintain the highest standards of quality and
              sustainability in all our products.
            </p>
            <h2>Our Values</h2>
            <ul>
              <li>Quality: We are committed to delivering only the finest products to our customers.</li>
              <li>Authenticity: We preserve traditional methods and recipes to ensure genuine South Indian flavors.</li>
              <li>Sustainability: We work closely with local communities to promote sustainable farming practices.</li>
              <li>Innovation: We continuously explore new ways to bring South Indian cuisine to the global stage.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
