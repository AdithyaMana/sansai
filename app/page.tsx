import Hero from "./components/Hero"
import FeaturedProductsContainer from "./components/FeaturedProductsContainer"
import HardwareProductsContainer from "./components/HardwareProductsContainer"
import Services from "./components/Services"
import Certifications from "./components/Certifications"

export default function Home() {
  return (
    <div className="animate-fadeIn">
      <Hero
        backgroundImage="/hero-ship.jpg"
        title="Sansai: Bringing the Best of South India to the World"
        subtitle="Experience the authentic flavors and traditions of South India"
        buttonText="Explore Our Products"
        buttonLink="/products"
      />
      <FeaturedProductsContainer />
      <HardwareProductsContainer />
      <Services />
      <Certifications />
    </div>
  )
}
