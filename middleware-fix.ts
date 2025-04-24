import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSecurityHeaders } from "@/lib/security-headers"
import { createRateLimiter, RATE_LIMITS, getCombinedIdentifier } from "@/lib/rate-limit"

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
  "/debug", // Added debug route
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

// Create rate limiters for different endpoints
const loginRateLimiter = createRateLimiter({
  ...RATE_LIMITS.auth.login,
  identifierFunction: getCombinedIdentifier,
})

const registerRateLimiter = createRateLimiter({
  ...RATE_LIMITS.auth.register,
  identifierFunction: getCombinedIdentifier,
})

const forgotPasswordRateLimiter = createRateLimiter({
  ...RATE_LIMITS.auth.forgotPassword,
  identifierFunction: getCombinedIdentifier,
})

const resetPasswordRateLimiter = createRateLimiter({
  ...RATE_LIMITS.auth.resetPassword,
  identifierFunction: getCombinedIdentifier,
})

const apiRateLimiter = createRateLimiter({
  ...RATE_LIMITS.api.default,
  identifierFunction: getCombinedIdentifier,
})

const sensitiveApiRateLimiter = createRateLimiter({
  ...RATE_LIMITS.api.sensitive,
  identifierFunction: getCombinedIdentifier,
})

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
    // but still apply rate limiting

    // Apply specific rate limits to webhook endpoints
    const webhookRateLimiter = createRateLimiter({
      limit: 60, // Higher limit for webhooks
      window: 60, // 1 minute window
    })

    const rateLimitResponse = await webhookRateLimiter(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    return response
  }

  // Apply rate limiting based on the path
  let rateLimitResponse = null

  // Apply specific rate limits to auth endpoints
  if (pathname === "/api/auth/login") {
    rateLimitResponse = await loginRateLimiter(request)
  } else if (pathname === "/api/auth/register") {
    rateLimitResponse = await registerRateLimiter(request)
  } else if (pathname === "/api/auth/forgot-password") {
    rateLimitResponse = await forgotPasswordRateLimiter(request)
  } else if (pathname === "/api/auth/reset-password") {
    rateLimitResponse = await resetPasswordRateLimiter(request)
  }
  // Apply general API rate limits
  else if (pathname.startsWith("/api/")) {
    // Apply stricter rate limits to sensitive endpoints
    if (pathname.includes("/admin/") || pathname.includes("/security/") || pathname.includes("/user-data/")) {
      rateLimitResponse = await sensitiveApiRateLimiter(request)
    } else {
      rateLimitResponse = await apiRateLimiter(request)
    }
  }

  // If rate limit is exceeded, return the rate limit response
  if (rateLimitResponse) {
    return rateLimitResponse
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
    // For now, we'll just check if it exists
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
  // For now, we'll just check if it exists

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
