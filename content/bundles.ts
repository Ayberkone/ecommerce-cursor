// content/bundles.ts
import { products } from "@/lib/products"

export const bundles = [
  {
    id: 1,
    name: "Jel 3'lü Avantaj Paketi",
    productIds: [1, 2, 3], // product IDs from your products
    description: "3 farklı Gengigel Jel ürünü tek pakette.",
    oldPrice: products[0].specialPrice + products[1].specialPrice + products[2].specialPrice, // 1249+899+949 = 3097
    bundlePrice: 3000,
    image: "/img/product/je.jpg", // Pick one or make a montage for the bundle
    url: "/offers/1"
  }
  // ... add more bundles
]
