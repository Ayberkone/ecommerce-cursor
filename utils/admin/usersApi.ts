import { api } from "@/utils/api"

export async function fetchAllUsers() {
  return await api("/api/admin/users", { showLoader: true })
}

export async function fetchPendingUsers() {
  return await api("/api/admin/users/pending-users", { showLoader: true })
}

export async function fetchRejectedUsers() {
  return await api("/api/admin/users/rejected-users", { showLoader: true })
}

export async function approveUser(id: string) {
  return await api(`/api/admin/users/approve-user/${id}`, { method: "POST", showLoader: true })
}

export async function rejectUser(id: string) {
  return await api(`/api/admin/users/reject-user/${id}`, { method: "POST", showLoader: true })
}

export async function deleteUser(id: string) {
  return await api(`/api/admin/users/${id}`, { method: "DELETE", showLoader: true })
}

export async function reactivateUser(id: string) {
  return await api(`/api/admin/users/reactivate-user/${id}`, { method: "POST", showLoader: true })
}
