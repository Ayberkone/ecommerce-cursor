export function isPhoneValid(phone: string) {
  // Turkish GSM pattern: 5xxxxxxxxx (10 digits, starts with 5)
  return /^5\d{9}$/.test(phone)
}
