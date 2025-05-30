export function isPhoneValid(phone: string) {
  // Turkish GSM pattern: 5xxxxxxxxx (10 digits, starts with 5)
  return /^5\d{9}$/.test(phone)
}

export function normalizeTurkish(str: string): string {
  if (!str) return ""
  return String(str).toLowerCase().replace(/ş/g, "s").replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c").replace(/\s+/g, "")
}
