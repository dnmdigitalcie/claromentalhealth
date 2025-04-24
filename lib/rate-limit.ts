import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { logSecurityEvent, SecurityEventType } from "@/lib/security-logger"
import { getClientInfo } from "@/lib/utils"

// Define rate limit configurations for different endpoints
export const RATE_LIMITS = {
  // Authentication endpoints
  auth: {
    login: { limit: 5, window: 15 * 60 }, // 5 attempts per 15 minutes
    register: { limit: 3, window: 60 * 60 }, // 3 attempts per hour
    forgotPassword: { limit: 3, window: 60 * 60 }, // 3 attempts per hour
    resetPassword: { limit: 3, window: 60 * 60 }, // 3 attempts per hour
    verifyEmail: { limit: 5, window: 60 * 60 }, // 5 attempts per hour
  },
  // API endpoints
  api: {
    default: { limit: 100, window: 60 }, // 100 requests per minute
    sensitive: { limit: 20, window: 60 }, // 20 requests per minute
  },
}

// Interface for rate limit options
interface RateLimitOptions {
  limit: number
  window: number
  identifierFunction?: (req: NextRequest) => Promise<string> | string
}

// Cache to store rate limit data in memory (for development)
// In production, you would use Redis or a similar solution
const rateLimitCache: Record<string, { count: number; resetTime: number }> = {}

/**
 * Creates a rate limiting middleware
 * @param options Rate limit options
 * @returns Middleware function
 */
export function createRateLimiter(options: RateLimitOptions) {
  const { limit, window, identifierFunction } = options

  return async function rateLimitMiddleware(request: NextRequest): Promise<NextResponse | null> {
    try {
      // Get client info
      const { ipAddress, userAgent } = getClientInfo(request)

      // Get identifier (default to IP address if no custom function provided)
      let identifier = ipAddress
      if (identifierFunction) {
        identifier = await identifierFunction(request)
      }

      // Create a unique key for this rate limit
      const key = `ratelimit:${request.nextUrl.pathname}:${identifier}`

      // Get current time
      const now = Math.floor(Date.now() / 1000)

      // Check if we have a record for this key
      let record = rateLimitCache[key]

      // If no record exists or the window has expired, create a new one
      if (!record || now > record.resetTime) {
        record = {
          count: 0,
          resetTime: now + window,
        }
      }

      // Increment the count
      record.count++

      // Update the cache
      rateLimitCache[key] = record

      // Calculate remaining requests and time until reset
      const remaining = Math.max(0, limit - record.count)
      const reset = record.resetTime
      const timeUntilReset = Math.max(0, reset - now)

      // Set rate limit headers
      const headers = {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      }

      // If limit is exceeded
      if (record.count > limit) {
        // Log rate limit violation as a security event
        await logSecurityEvent(SecurityEventType.RATE_LIMIT_EXCEEDED, undefined, undefined, {
          path: request.nextUrl.pathname,
          ipAddress,
          userAgent,
          requestsCount: record.count,
          limit,
          window,
        })

        // Return 429 Too Many Requests
        return new NextResponse(
          JSON.stringify({
            error: "Too many requests",
            message: `Rate limit exceeded. Try again in ${timeUntilReset} seconds.`,
          }),
          {
            status: 429,
            headers: {
              ...headers,
              "Content-Type": "application/json",
              "Retry-After": timeUntilReset.toString(),
            },
          },
        )
      }

      // If we're getting close to the limit (80% or more used)
      if (record.count >= limit * 0.8) {
        // Log a warning
        console.warn(`Rate limit warning: ${record.count}/${limit} requests used for ${key}`)
      }

      // Continue with the request, adding rate limit headers
      return null
    } catch (error) {
      console.error("Rate limit error:", error)
      // In case of error, allow the request to proceed
      return null
    }
  }
}

/**
 * Helper function to get a user ID from a request
 * @param req NextRequest object
 * @returns User ID or null
 */
export async function getUserIdFromRequest(req: NextRequest): Promise<string> {
  // Get the session token from cookies
  const sessionToken = req.cookies.get("auth_session")?.value

  if (!sessionToken) {
    return "anonymous"
  }

  try {
    // Validate the session and get user ID
    // This is a simplified example - in your actual code, use your session validation logic
    const { data } = await supabase.from("sessions").select("user_id").eq("token", sessionToken).single()

    return data?.user_id || "anonymous"
  } catch (error) {
    console.error("Error getting user ID from session:", error)
    return "anonymous"
  }
}

/**
 * Creates a combined identifier from both IP and user ID
 * This prevents rate limit bypassing by switching accounts
 */
export async function getCombinedIdentifier(req: NextRequest): Promise<string> {
  const { ipAddress } = getClientInfo(req)
  const userId = await getUserIdFromRequest(req)
  return `${ipAddress}:${userId}`
}
