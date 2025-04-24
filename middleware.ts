import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSecurityHeaders } from "@/lib/security-headers"

// List of public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/verify-email",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/cookies",
]

// Routes that require specific roles
const roleProtectedRoutes = [
  {
    path: "/admin",
    roles: ["admin"],
  },
  {
    path: "/instructor",
    roles: ["admin", "instructor"],
  },
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Apply security headers to all responses
  const response = NextResponse.next()
  const securityHeaders = getSecurityHeaders()
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Special handling for webhook endpoints
  if (pathname.startsWith("/api/webhooks/")) {
    // For webhook endpoints, we'll skip some of the usual checks
    return response
  }

  // Check if the route is public
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return response
  }

  // For API routes, check for authentication using session cookie
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) {
    const sessionToken = request.cookies.get("auth_session")?.value

    if (!sessionToken) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          ...securityHeaders,
        },
      })
    }

    // In a real implementation, you would validate the session here
    return response
  }

  // For regular routes, check the session cookie
  const sessionToken = request.cookies.get("auth_session")?.value

  if (!sessionToken) {
    // Redirect to login if no session
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("returnTo", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // In a real implementation, you would validate the session here
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
