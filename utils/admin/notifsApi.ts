// utils/admin/notifsApi.ts
import { api } from "../api"

export interface AdminNotification {
  _id: string
  type: string
  title?: string
  message: string
  createdAt: string
  read: boolean
}

// Fetch notifications (optionally limit, page, etc)
export async function fetchNotifications({ page = 1, limit = 10, search = "", unreadOnly = false } = {}): Promise<{ notifications: AdminNotification[]; count: number }> {
  const params = new URLSearchParams()
  if (page) params.append("page", page.toString())
  if (limit) params.append("limit", limit.toString())
  if (search) params.append("search", search)
  if (unreadOnly) params.append("unreadOnly", "true")
  const data = await api<{ notifications: AdminNotification[]; count: number }>(`/api/admin/notifications?${params.toString()}`)
  return data
}

// Fetch unread notification count
export async function fetchUnreadNotificationCount(): Promise<number> {
  const data = await api<{ count: number }>("/api/admin/notifications/unread-count")
  return data.count || 0
}

// Mark all notifications as read
export async function markAllNotificationsRead(): Promise<void> {
  await api("/api/admin/notifications/mark-as-read", {
    method: "POST",
    body: JSON.stringify({ all: true }),
    headers: { "Content-Type": "application/json" }
  })
}

// Mark a single notification as read
export async function markNotificationRead(notificationId: string): Promise<void> {
  await api("/api/admin/notifications/mark-as-read", {
    method: "POST",
    body: JSON.stringify({ notificationId }),
    headers: { "Content-Type": "application/json" }
  })
}
