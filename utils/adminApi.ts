// utils/adminApi.ts
import { Brand, Category, ProductFormValues } from "@/types/Product"
import { api } from "./api"

export async function fetchPendingUsers() {
  return api("/api/admin/users/pending-users", { showLoader: true })
}

export async function approveUser(userId: string) {
  return api(`/api/admin/users/approve-user/${userId}`, {
    method: "POST",
    body: JSON.stringify({ adminId: "admin" }), // replace with real session
    showLoader: true
  })
}

export async function rejectUser(userId: string, note = "") {
  return api(`/api/admin/users/reject-user/${userId}`, {
    method: "POST",
    body: JSON.stringify({ adminId: "admin", note }),
    showLoader: true
  })
}

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

export async function fetchBrands() {
  return api<Brand[]>("/api/brands")
}

export async function fetchProduct(id: string) {
  return api<ProductFormValues>(`/api/admin/products/${id}`)
}

export const deleteProduct = async (id: string) => {
  return api(`/api/admin/products/${id}`, { method: "DELETE", showLoader: true })
}
