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

// Disable a user (set status to "disabled")
export async function disableUser(id: string) {
  return await api(`/api/admin/users/${id}/disable`, {
    method: "POST",
    showLoader: true
  })
}

// Enable a user (set status to "active")
export async function enableUser(id: string) {
  return await api(`/api/admin/users/${id}/enable`, {
    method: "POST",
    showLoader: true
  })
}

// Ban a user (set status to "banned")
export async function banUser(id: string) {
  return await api(`/api/admin/users/${id}/ban`, {
    method: "POST",
    showLoader: true
  })
}
