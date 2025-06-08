// utils/paytrApi.ts
import { api } from "./api"

export async function initPaytr(data: any) {
  return api("/api/paytr/init", {
    method: "POST",
    body: JSON.stringify(data),
    showLoader: true
  })
}
