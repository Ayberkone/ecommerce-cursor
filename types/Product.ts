// types/Product.ts
export type ProductPhoto = string // Just store Cloudinary URLs

export type ProductPrice = {
  regular: number
  pro?: number
  storage?: number
}

export type ProductDescription = {
  normal: string
  mini?: string
}

export type Product = {
  _id: string // mongo id, can be string
  name: string
  seoTitle?: string
  description: ProductDescription
  proDescription?: ProductDescription
  keywords?: string[]
  videoLink?: string
  price: ProductPrice
  isTaxIncluded?: boolean
  taxRate?: number
  stockQuantity: number
  barcode?: string
  category?: Category
  collections?: Collection[]
  brand?: Brand
  photoUrls?: ProductPhoto[]
  documentUrl?: string
  createdAt?: string
  updatedAt?: string
}

export interface ProductFormValues {
  _id: string
  name: string
  seoTitle: string
  description: { normal: string; mini: string }
  proDescription: { normal: string; mini: string }
  keywords: string
  videoLink: string
  price: { regular: number; pro: number; storage: number }
  isTaxIncluded: boolean
  taxRate: number
  stockQuantity: number
  barcode: string
  category: string
  collections: string[]
  brand: string
  photoUrls: ProductPhoto[]
  documentUrl: string
}

export interface Category {
  _id: string
  name: string
}

export interface Collection {
  _id: string
  name: string
}

export interface Brand {
  _id: string
  name: string
}

export type Review = {
  id: number
  user: string
  rating: number
  comment: string
  date: string
}
