import { promises as fs } from "fs"
import path from "path"
import FeaturedProducts from "./FeaturedProducts"
import type { Product } from "../types/product"

const FeaturedProductsContainer = async () => {
  // Read the JSON file
  const filePath = path.join(process.cwd(), "app/data/products.json")
  const fileContents = await fs.readFile(filePath, "utf8")
  const allProducts = JSON.parse(fileContents) as Product[]

  // Get 8 featured products
  const featuredProducts = allProducts.slice(0, 8)

  return <FeaturedProducts products={featuredProducts} />
}

export default FeaturedProductsContainer
