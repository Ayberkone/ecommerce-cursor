export type AdminNotification = {
  _id: string
  type: string
  message: string
  createdAt: string
  read: boolean
}

export const notificationTypeLabels: Record<string, string> = {
  user_register: "Yeni Kullanıcı Kaydı",
  order_received: "Yeni Sipariş",
  sample_request: "Numune Talebi"
}
