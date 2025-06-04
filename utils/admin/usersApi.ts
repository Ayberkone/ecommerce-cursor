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

export async function reactivateUser(id: string) {
  return await api(`/api/admin/users/reactivate-user/${id}`, { method: "POST", showLoader: true })
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
    body: JSON.stringify({ note: note }),
    showLoader: true
  })
}

export async function deleteUser(id: string) {
  return await api(`/api/admin/users/${id}`, {
    method: "DELETE",
    showLoader: true
  })
}
