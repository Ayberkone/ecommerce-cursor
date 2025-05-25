import { api } from "./api"

export type Address = {
  _id?: string
  title: string
  recipient: string
  phone: string
  email?: string
  address: string
  city: string
  district: string
  postalCode?: string
  taxNumber?: string
  taxOffice?: string
  tc?: string
  isDefault?: boolean
}

// List addresses
export async function getAddresses(): Promise<Address[]> {
  return api("/api/addresses")
}

// Add address
export async function addAddress(address: Partial<Address>) {
  return api("/api/addresses", {
    method: "POST",
    body: JSON.stringify(address)
  })
}

// Update address
export async function updateAddress(id: string, address: Partial<Address>) {
  return api(`/api/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(address)
  })
}

// Delete address
export async function deleteAddress(id: string) {
  return api(`/api/addresses/${id}`, {
    method: "DELETE"
  })
}
