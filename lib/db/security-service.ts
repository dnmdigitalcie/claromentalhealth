import { supabase } from "@/lib/supabase"
import { generateId } from "@/lib/utils"
import type { SecurityEventType } from "@/types/auth"

export async function logSecurityEvent(
  eventType: SecurityEventType,
  details: {
    userId?: string
    email?: string
    ipAddress?: string
    userAgent?: string
    additionalDetails?: Record<string, any>
  },
) {
  try {
    const { userId, email, ipAddress, userAgent, additionalDetails } = details
    const now = new Date()
    const eventId = generateId(24)

    const { error } = await supabase.from("security_logs").insert({
      id: eventId,
      user_id: userId || null,
      email: email || null,
      event_type: eventType,
      ip_address: ipAddress || null,
      user_agent: userAgent || null,
      details: additionalDetails || null,
      created_at: now.toISOString(),
    })

    if (error) {
      console.error("Error logging security event:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in logSecurityEvent:", error)
    return false
  }
}

export async function getSecurityLogs(
  filters: {
    userId?: string
    email?: string
    eventType?: SecurityEventType
    startDate?: Date
    endDate?: Date
    limit?: number
    offset?: number
  } = {},
) {
  try {
    const { userId, email, eventType, startDate, endDate, limit = 100, offset = 0 } = filters

    let query = supabase.from("security_logs").select("*")

    if (userId) {
      query = query.eq("user_id", userId)
    }

    if (email) {
      query = query.eq("email", email)
    }

    if (eventType) {
      query = query.eq("event_type", eventType)
    }

    if (startDate) {
      query = query.gte("created_at", startDate.toISOString())
    }

    if (endDate) {
      query = query.lte("created_at", endDate.toISOString())
    }

    query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching security logs:", error)
      return { logs: [], total: 0, error }
    }

    return { logs: data, total: count || data.length, error: null }
  } catch (error) {
    console.error("Error in getSecurityLogs:", error)
    return { logs: [], total: 0, error }
  }
}

export async function detectSuspiciousActivity(userId: string, ipAddress: string, userAgent: string) {
  try {
    // Get user's recent login history
    const { data: recentLogins } = await supabase
      .from("security_logs")
      .select("ip_address, user_agent, created_at")
      .eq("user_id", userId)
      .eq("event_type", "login_success")
      .order("created_at", { ascending: false })
      .limit(5)

    if (!recentLogins || recentLogins.length === 0) {
      // First login, not suspicious
      return false
    }

    // Check if this IP has been used before by this user
    const knownIp = recentLogins.some((login) => login.ip_address === ipAddress)

    // If IP is new and there are previous logins, flag as potentially suspicious
    if (!knownIp && recentLogins.length > 0) {
      await logSecurityEvent("suspicious_activity", {
        userId,
        ipAddress,
        userAgent,
        additionalDetails: {
          reason: "Login from new IP address",
          previousIps: recentLogins.map((l) => l.ip_address),
        },
      })
      return true
    }

    return false
  } catch (error) {
    console.error("Error in detectSuspiciousActivity:", error)
    return false
  }
}
