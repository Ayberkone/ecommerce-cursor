// utils/adminApi.ts
import { Brand, Category, Collection, Product } from "@/types/Product"
import { api } from "../api"

export async function fetchAdminStats() {
  return api("/api/admin/dashboard/stats", { showLoader: true })
}

export async function fetchSalesHistory() {
  return api("/api/admin/dashboard/sales-history", { showLoader: true })
}

export async function fetchLatestOrders() {
  return api("/api/admin/dashboard/orders/latest", { showLoader: true })
}

export async function fetchCategories() {
  return api<Category[]>("/api/categories")
}

export async function fetchCollections() {
  return api<Collection[]>("/api/collections")
}

export async function fetchBrands() {
  return api<Brand[]>("/api/brands")
}

export async function fetchProduct(id: string) {
  return api<Product>(`/api/admin/products/${id}`)
}

export async function deleteProduct(id: string) {
  return api(`/api/admin/products/${id}`, { method: "DELETE", showLoader: true })
}
