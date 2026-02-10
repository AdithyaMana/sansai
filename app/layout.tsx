import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { CartProvider } from "./context/CartContext"
import CartNotificationContainer from "./components/CartNotificationContainer"
import ErrorBoundary from "./components/ErrorBoundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sansai - Premium Spices & Ingredients",
  description: "Discover premium quality spices, ingredients, and hardware products at Sansai.",
    generator: 'v0.app'
}

/**
 * Root layout component that wraps the entire application
 * Provides global context providers and layout structure
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <CartNotificationContainer />
          </CartProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
