import { NextResponse } from "next/server"

export type GalleryProduct = {
  id: number
  type: string // e.g. "jel", "sprey"
  typeColor?: string // optional, e.g. "mavi", "pembe", ""
  typeIcon: string // image path or URL for the product form/category icon
  typeLabel: string // e.g. "Jel"
  url: string // product detail page URL (relative or absolute)
  image: string // main product image path or URL
  name: string // product display name
  price: number // price in TRY
  comments: number // number of comments/reviews
  stars: number // star rating (0-5)
}

const products: GalleryProduct[] = [
  {
    id: 1,
    type: "jel",
    typeColor: "",
    typeIcon: "/img/product/je.jpg", // (or the proper frame img, keep for design)
    typeLabel: "Jel",
    url: "/gengigel-jel-30ml",
    image: "/img/product/je.jpg",
    name: "Gengigel Jel 30 ml",
    price: 1349,
    comments: 0,
    stars: 0
  },
  {
    id: 2,
    type: "jel",
    typeColor: "",
    typeIcon: "/img/product/ga.jpg",
    typeLabel: "Jel",
    url: "/gengigel-jel-20ml",
    image: "/img/product/ga.jpg",
    name: "Gengigel Jel 20 ml",
    price: 999,
    comments: 0,
    stars: 0
  },
  {
    id: 3,
    type: "jel",
    typeColor: "",
    typeIcon: "/img/product/fj.jpg",
    typeLabel: "Jel",
    url: "/gengigel-forte-jel",
    image: "/img/product/fj.jpg",
    name: "Gengigel Forte Jel",
    price: 1099,
    comments: 0,
    stars: 0
  },
  {
    id: 4,
    type: "sprey",
    typeColor: "mavi",
    typeIcon: "/img/product/sp.jpg",
    typeLabel: "Sprey",
    url: "/gengigel-sprey",
    image: "/img/product/sp.jpg",
    name: "Gengigel Diş Eti Hassasiyet Sprey",
    price: 949,
    comments: 0,
    stars: 0
  },
  {
    id: 5,
    type: "sprey",
    typeColor: "mavi",
    typeIcon: "/img/product/fs.jpg",
    typeLabel: "Sprey",
    url: "/gengigel-forte-oral-sprey",
    image: "/img/product/fs.jpg",
    name: "Gengigel Forte Oral Sprey",
    price: 1099,
    comments: 0,
    stars: 0
  },
  {
    id: 6,
    type: "jel",
    typeColor: "",
    typeIcon: "/img/product/teething.png",
    typeLabel: "Jel",
    url: "/gengigel-teething",
    image: "/img/product/teething.png",
    name: "Gengigel Teething Jel",
    price: 1099,
    comments: 0,
    stars: 0
  },
  {
    id: 7,
    type: "jel",
    typeColor: "",
    typeIcon: "/img/product/teen.png",
    typeLabel: "Jel",
    url: "/gengigel-teen",
    image: "/img/product/teen.png",
    name: "Gengigel Teen Jel",
    price: 949,
    comments: 0,
    stars: 0
  },
  {
    id: 8,
    type: "jel",
    typeColor: "",
    typeIcon: "/img/product/fa.jpg",
    typeLabel: "Jel",
    url: "/gengigel-forte-oral-gel",
    image: "/img/img/product/fa.jpg",
    name: "Gengigel Forte Oral Gel",
    price: 1099,
    comments: 0,
    stars: 0
  }
]

export async function GET() {
  return NextResponse.json(products)
}
