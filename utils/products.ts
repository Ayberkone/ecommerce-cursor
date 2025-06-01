// lib/productService.ts
import { api } from "@/utils/api" // Assuming your API helper is here
import type { Product, Review } from "@/types/Product" // Assuming your Product type is here
import { normalizeTurkish } from "./functions"

/**
 * Fetches products from the backend API.
 * @param category Optional category to filter products by.
 * @param query Optional search query to filter products by.
 * @returns A promise that resolves to an array of Product objects.
 */
export async function fetchProducts(category?: string, collections?: string[], query?: string, showLoader: boolean = false): Promise<Product[]> {
  const params = new URLSearchParams()
  if (category) {
    params.append("category", category)
  }
  if (collections && collections.length > 0) {
    collections.forEach((id) => params.append("collection", id))
  }
  if (query) {
    params.append("q", encodeURIComponent(normalizeTurkish(query)))
  }
  const queryString = params.toString()
  const url = `/api/products${queryString ? `?${queryString}` : ""}`
  const res = await api<{ products: Product[] }>(url, { showLoader })
  return res.products || []
}

/**
 * Fetches a single product by its ID.
 * @param id The ID of the product to fetch.
 * @returns A Promise that resolves to the Product object.
 * @throws An error if the product is not found or the API call fails.
 */
export async function fetchProductById(id: string): Promise<Product> {
  const product = await api<Product>(`/api/products/${id}`, { showLoader: true })
  if (!product) {
    throw new Error("Product not found")
  }
  return product
}

/**
 * Fetches reviews for a given product ID.
 * @param productId The ID of the product to fetch reviews for.
 * @returns A Promise that resolves to an array of Review objects.
 * Returns an empty array if no reviews are found or on error.
 */
export async function fetchReviewsByProductId(productId: string): Promise<Review[]> {
  try {
    const reviews = await api<Review[]>(`/api/reviews?productId=${productId}`, { showLoader: true })
    return reviews || [] // Ensure it returns an array even if API returns null/undefined
  } catch (err) {
    return [] // Return empty array on error for reviews
  }
}
