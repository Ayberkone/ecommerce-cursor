export type User = {
  id: string
  username: string
  firstName: string
  lastName: string
  type: UserType
  email: string
  phone: string
  address: string
}

export const USER_TYPES = {
  PHARMACY: "pharmacy",
  DOCTOR: "doctor",
  REGULAR: "regular",
  ADMIN: "admin",
  ORDER_ADMIN: "order_admin"
} as const

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES]

export const USER_TYPE_LABELS: Record<UserType, string> = {
  [USER_TYPES.PHARMACY]: "Eczane",
  [USER_TYPES.DOCTOR]: "Doktor",
  [USER_TYPES.REGULAR]: "Bireysel",
  [USER_TYPES.ADMIN]: "Yönetici",
  [USER_TYPES.ORDER_ADMIN]: "Sipariş Yöneticisi"
}

export const USER_TYPE_SELECT_OPTIONS = [
  { key: "", label: "Tümü" },
  { key: USER_TYPES.REGULAR, label: USER_TYPE_LABELS[USER_TYPES.REGULAR] },
  { key: USER_TYPES.PHARMACY, label: USER_TYPE_LABELS[USER_TYPES.PHARMACY] },
  { key: USER_TYPES.DOCTOR, label: USER_TYPE_LABELS[USER_TYPES.DOCTOR] },
  { key: USER_TYPES.ADMIN, label: USER_TYPE_LABELS[USER_TYPES.ADMIN] },
  { key: USER_TYPES.ORDER_ADMIN, label: USER_TYPE_LABELS[USER_TYPES.ORDER_ADMIN] }
]
