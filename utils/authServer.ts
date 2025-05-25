// utils/authServer.ts
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function getUserFromCookies() {
  const cookieStore = await cookies()
  console.log("🚀 ~ getUserFromCookies ~ cookieStore:", cookieStore)
  const cookie = cookieStore.get("token")?.value
  console.log("BE JWT_SECRET:", JSON.stringify(process.env.JWT_SECRET), JSON.stringify(process.env.JWT_SECRET ? process.env.JWT_SECRET.length : "undefined"))
  console.log("🚀 ~ getUserFromCookies ~ cookie:", cookie)
  console.log("🚀 ~ getUserFromCookies ~ jwt:", jwt)
  if (!cookie) return null
  try {
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET!) // decoded: string | JwtPayload
    console.log("🚀 ~ getUserFromCookies ~ decoded:", decoded)
    if (typeof decoded !== "object" || !decoded) return null
    // Optionally check for "type" property
    if (!("type" in decoded)) return null
    return decoded // Now always JwtPayload
  } catch (e) {
    console.error("JWT VERIFY ERROR:", e)
    return null
  }
}
