export type Order = {
  _id: string
  createdAt: string
  customer?: string
  email?: string
  total: number
  paymentMethod: string
  paymentStatus: string
  status: string
  cargoCompany?: string
  cargoNo?: string
  address: string
  items: any[]
}
