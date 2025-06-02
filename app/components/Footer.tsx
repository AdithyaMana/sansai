import Link from "next/link"
import styles from "./Footer.module.css"
import { getCurrentYear } from "../utils/dateUtils"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>About Sansai</h3>
            <p className={styles.footerText}>
              Sansai is a premium supplier of high-quality spices, ingredients, and hardware products. We source our
              products directly from trusted farmers and manufacturers to ensure the best quality.
            </p>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Quick Links</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/products">Products</Link>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Contact Us</h3>
            <address className={styles.footerAddress}>
              <p>123 Spice Road</p>
              <p>Chennai, Tamil Nadu 600001</p>
              <p>India</p>
              <p>
                <a href="tel:+919876543210">+91 98765 43210</a>
              </p>
              <p>
                <a href="mailto:info@sansai.com">info@sansai.com</a>
              </p>
            </address>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>&copy; {getCurrentYear()} Sansai. All rights reserved.</p>
          <div className={styles.footerBottomLinks}>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
