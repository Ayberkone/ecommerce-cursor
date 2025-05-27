// utils/adminApi.ts
import { api } from "./api"

export async function fetchPendingUsers() {
  return api("/api/admin/users/pending-users")
}

export async function approveUser(userId: string) {
  return api(`/api/admin/users/approve-user/${userId}`, {
    method: "POST",
    body: JSON.stringify({ adminId: "admin" }) // replace with real session
  })
}

export async function rejectUser(userId: string, note = "") {
  return api(`/api/admin/users/reject-user/${userId}`, {
    method: "POST",
    body: JSON.stringify({ adminId: "admin", note })
  })
}

export async function fetchAdminStats() {
  return api("/api/admin/dashboard/stats")
}

export async function fetchSalesHistory() {
  return api("/api/admin/dashboard/sales-history")
}

export async function fetchLatestOrders() {
  return api("/api/admin/dashboard/orders/latest")
}
