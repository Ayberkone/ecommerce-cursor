// utils/adminApi.ts
import { api } from "./api"

export function fetchPendingUsers() {
  return api("/api/admin/pending-users")
}

export function approveUser(userId: string) {
  return api(`/api/admin/approve-user/${userId}`, {
    method: "POST",
    body: JSON.stringify({ adminId: "admin" }) // replace with real session
  })
}

export function rejectUser(userId: string, note = "") {
  return api(`/api/admin/reject-user/${userId}`, {
    method: "POST",
    body: JSON.stringify({ adminId: "admin", note })
  })
}
