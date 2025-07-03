import { NextRequest, NextResponse } from "next/server"
import { verifyJWT } from "@/utils/jwtUtils"
import { USER_TYPES } from "./types/User"

export async function middleware(request: NextRequest) {
  // Only intercept public pages, not /admin/*
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Let admin pages handle their own auth
    return NextResponse.next()
  }

  // Check JWT in cookies (server-side!)
  const token = request.cookies.get("token")?.value
  if (token) {
    try {
      const user = await verifyJWT(token)
      if (user && user.type === USER_TYPES.ADMIN) {
        // Redirect admin to /admin no matter what they try to visit
        return NextResponse.redirect(new URL("/admin", request.url))
      }
    } catch (err) {
      // Ignore errors, treat as guest
    }
  }

  // Not an admin, continue as normal
  return NextResponse.next()
}

// Optional: Only match public routes
export const config = {
  matcher: [
    /*
      Intercept everything EXCEPT /admin and /api.
      Adjust if you want to cover more/less.
    */
    "/((?!admin|api|_next|favicon.ico|media|static).*)"
  ]
}
