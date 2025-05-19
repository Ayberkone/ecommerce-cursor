// /lib/products.ts
export type GalleryProduct = {
  id: number
  type: string // e.g. "jel", "sprey"
  typeColor?: string // optional, e.g. "mavi", "pembe", ""
  typeIcon: string // image path or URL for the product form/category icon
  typeLabel: string // e.g. "Jel"
  url: string // product detail page URL (relative or absolute)
  images: string[] // main product image path or URL
  name: string // product display name
  category: string // category name
  price: number // price in TRY
  specialPrice: number // special price in TRY
  comments: number // number of comments/reviews
  stars: number // star rating (0-5)
  productShortInfo?: string
}

export const products: GalleryProduct[] = [
  {
    id: 1,
    type: "jel",
    typeColor: "",
    typeIcon: "/img/product/je.jpg", // (or the proper frame img, keep for design)
    typeLabel: "Jel",
    url: "/products/gengigel-jel-30ml",
    images: ["/img/product/je.jpg", "/img/product/ga.jpg", "/img/product/fj.jpg"],
    name: "Gengigel Jel 30 ml",
    price: 1349,
    specialPrice: 1249,
    category: "Sprays",
    comments: 0,
    stars: 0
  },
  {
    id: 2,
    type: "jel",
    typeColor: "",
    typeIcon: "/img/product/ga.jpg",
    typeLabel: "Jel",
    url: "/products/gengigel-jel-20ml",
    images: ["/img/product/ga.jpg"],
    name: "Gengigel Jel 20 ml",
    price: 999,
    specialPrice: 899,
    comments: 0,
    category: "Gargara",
    stars: 0
  },
  {
    id: 3,
    type: "jel",
    typeColor: "",
    typeIcon: "/img/product/fj.jpg",
    typeLabel: "Jel",
    url: "/products/gengigel-forte-jel",
    images: ["/img/product/fj.jpg"],
    name: "Gengigel Forte Jel",
    price: 1099,
    specialPrice: 949,
    comments: 0,
    category: "Sprays",
    stars: 0
  },
  {
    id: 4,
    type: "sprey",
    typeColor: "mavi",
    typeIcon: "/img/product/sp.jpg",
    typeLabel: "Sprey",
    url: "/products/gengigel-sprey",
    images: ["/img/product/sp.jpg"],
    name: "Gengigel Diş Eti Hassasiyet Sprey",
    price: 949,
    specialPrice: 449,
    category: "Sprays",
    comments: 0,
    stars: 0
  },
  {
    id: 5,
    type: "sprey",
    typeColor: "mavi",
    typeIcon: "/img/product/fs.jpg",
    typeLabel: "Sprey",
    url: "/products/gengigel-forte-oral-sprey",
    images: ["/img/product/fs.jpg"],
    name: "Gengigel Forte Oral Sprey",
    price: 1099,
    specialPrice: 249,
    comments: 0,
    category: "Sprays",
    stars: 0
  },
  {
    id: 6,
    type: "jel",
    typeColor: "",
    typeIcon: "/img/product/teething.png",
    typeLabel: "Jel",
    url: "/products/gengigel-teething",
    images: ["/img/product/teething.png"],
    name: "Gengigel Teething Jel",
    price: 1099,
    specialPrice: 29,
    comments: 0,
    category: "Jel",
    stars: 0
  },
  {
    id: 7,
    type: "jel",
    typeColor: "",
    typeIcon: "/img/product/teen.png",
    typeLabel: "Jel",
    url: "/products/gengigel-teen",
    images: ["/img/product/teen.png"],
    name: "Gengigel Teen Jel",
    price: 949,
    specialPrice: 349,
    comments: 0,
    category: "Sprays",
    stars: 0
  },
  {
    id: 8,
    type: "jel",
    typeColor: "",
    typeIcon: "/img/product/fa.jpg",
    typeLabel: "Jel",
    url: "/products/gengigel-forte-oral-gel",
    images: ["/img/product/fj.jpg"],
    name: "Gengigel Forte Oral Gel",
    price: 1099,
    specialPrice: 249,
    comments: 0,
    category: "Sprays",
    stars: 0
  }
]
