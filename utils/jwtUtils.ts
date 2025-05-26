import { jwtVerify } from "jose"

// The secret as a Uint8Array (Edge expects Uint8Array, not string)
const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function verifyJWT(token: string) {
  try {
    // Verify the JWT and return its payload
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (err) {
    // Invalid or expired token
    return null
  }
}
