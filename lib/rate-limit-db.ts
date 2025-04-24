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

/**
 * Creates a rate limiting middleware using database persistence
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
      const now = new Date()
      const resetTime = new Date(now.getTime() + window * 1000)

      // Try to get existing rate limit record
      const { data: existingRecord, error: selectError } = await supabase
        .from("rate_limits")
        .select("id, key, count, reset_time")
        .eq("key", key)
        .single()

      if (selectError && selectError.code !== "PGRST116") {
        // PGRST116 is "no rows returned"
        console.error("Error checking rate limit:", selectError)
        // On error, allow the request to proceed
        return null
      }

      let count = 1

      if (existingRecord) {
        const recordResetTime = new Date(existingRecord.reset_time)

        // If the record exists and hasn't expired
        if (recordResetTime > now) {
          count = existingRecord.count + 1

          // Update the record
          await supabase
            .from("rate_limits")
            .update({ count, updated_at: now.toISOString() })
            .eq("id", existingRecord.id)
        } else {
          // Record exists but has expired, create a new one
          await supabase
            .from("rate_limits")
            .update({
              count: 1,
              reset_time: resetTime.toISOString(),
              updated_at: now.toISOString(),
            })
            .eq("id", existingRecord.id)
        }
      } else {
        // No record exists, create a new one
        await supabase.from("rate_limits").insert({
          key,
          count: 1,
          reset_time: resetTime.toISOString(),
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
        })
      }

      // Calculate remaining requests and time until reset
      const remaining = Math.max(0, limit - count)
      const timeUntilReset = Math.floor((resetTime.getTime() - now.getTime()) / 1000)

      // Set rate limit headers
      const headers = {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": Math.floor(resetTime.getTime() / 1000).toString(),
      }

      // If limit is exceeded
      if (count > limit) {
        // Log rate limit violation as a security event
        await logSecurityEvent(SecurityEventType.RATE_LIMIT_EXCEEDED, undefined, undefined, {
          path: request.nextUrl.pathname,
          ipAddress,
          userAgent,
          requestsCount: count,
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
      if (count >= limit * 0.8) {
        // Log a warning
        console.warn(`Rate limit warning: ${count}/${limit} requests used for ${key}`)
      }

      // Continue with the request, adding rate limit headers
      const response = NextResponse.next()
      Object.entries(headers).forEach(([name, value]) => {
        response.headers.set(name, value)
      })

      return response
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

/**
 * Cleanup expired rate limits
 * This should be run periodically (e.g., via a cron job)
 */
export async function cleanupExpiredRateLimits(): Promise<void> {
  try {
    await supabase.rpc("cleanup_expired_rate_limits")
    console.log("Cleaned up expired rate limits")
  } catch (error) {
    console.error("Error cleaning up expired rate limits:", error)
  }
}
