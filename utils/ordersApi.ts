// utils/ordersApi.ts
import { api } from "./api"

export async function createOrder(orderData: any) {
  return api("/api/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
    showLoader: true
  })
}

// Sipariş iptali (iade)
// return_amount: KURUŞ cinsinden (örn: 1250 = 12.50 TL)
export async function refundOrder(merchant_oid: string, return_amount: number) {
  return api("/api/paytr/refund", {
    method: "POST",
    body: JSON.stringify({
      merchant_oid,
      return_amount
    }),
    showLoader: true
  })
}
