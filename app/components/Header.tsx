import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import styles from "./Header.module.css"
import { useCart } from "../context/CartContext"

const Header = () => {
  // Add useCart hook
  const { getCartCount } = useCart()
  const cartCount = getCartCount()

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.png" alt="Sansai Logo" width={140} height={48} priority />
        </Link>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/products" className={styles.navLink}>
            Products
          </Link>
          <Link href="/about" className={styles.navLink}>
            About Us
          </Link>
          <Link href="/contact" className={styles.navLink}>
            Contact
          </Link>
          <Link href="/cart" className={styles.cartLink}>
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
