import { promises as fs } from "fs"
import path from "path"
import HardwareProductsSection from "./HardwareProductsSection"
import type { Product } from "../types/product"

const HardwareProductsContainer = async () => {
  // Read the JSON file
  const filePath = path.join(process.cwd(), "app/data/products.json")
  const fileContents = await fs.readFile(filePath, "utf8")
  const allProducts = JSON.parse(fileContents) as Product[]

  // Filter hardware products
  const hardwareProducts = allProducts.filter((product) => product.category === "Hardware")

  return <HardwareProductsSection products={hardwareProducts} />
}

export default HardwareProductsContainer
