import { supabase } from "@/lib/supabase"
import { getClientInfo } from "@/lib/utils"
// Import the Slack integration utilities
import { formatSlackMessage, isSlackWebhookUrl } from "@/lib/integrations/slack"

export enum SecurityEventType {
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILURE = "LOGIN_FAILURE",
  LOGOUT = "LOGOUT",
  PASSWORD_CHANGE = "PASSWORD_CHANGE",
  PASSWORD_RESET_REQUEST = "PASSWORD_RESET_REQUEST",
  PASSWORD_RESET_COMPLETE = "PASSWORD_RESET_COMPLETE",
  MFA_ENABLED = "MFA_ENABLED",
  MFA_DISABLED = "MFA_DISABLED",
  MFA_CHALLENGE_SUCCESS = "MFA_CHALLENGE_SUCCESS",
  MFA_CHALLENGE_FAILURE = "MFA_CHALLENGE_FAILURE",
  ACCOUNT_LOCKED = "ACCOUNT_LOCKED",
  ACCOUNT_UNLOCKED = "ACCOUNT_UNLOCKED",
  ADMIN_ACTION = "ADMIN_ACTION",
  PERMISSION_CHANGE = "PERMISSION_CHANGE",
  SENSITIVE_DATA_ACCESS = "SENSITIVE_DATA_ACCESS",
  GDPR_DATA_REQUEST = "GDPR_DATA_REQUEST",
  GDPR_DATA_DELETE = "GDPR_DATA_DELETE",
  API_KEY_CREATED = "API_KEY_CREATED",
  API_KEY_DELETED = "API_KEY_DELETED",
  SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED", // New event type
}

export interface SecurityLogEntry {
  id?: string
  event_type: SecurityEventType
  user_id?: string
  email?: string
  ip_address?: string
  user_agent?: string
  details?: Record<string, any>
  created_at?: string
}

export async function logSecurityEvent(
  eventType: SecurityEventType,
  userId?: string,
  email?: string,
  details?: Record<string, any>,
  request?: Request,
): Promise<void> {
  try {
    const clientInfo = request ? getClientInfo(request) : { ipAddress: undefined, userAgent: undefined }

    const logEntry: SecurityLogEntry = {
      event_type: eventType,
      user_id: userId,
      email: email,
      ip_address: clientInfo.ipAddress,
      user_agent: clientInfo.userAgent,
      details: details,
      created_at: new Date().toISOString(),
    }

    // Insert into security_logs table
    const { error } = await supabase.from("security_logs").insert(logEntry)

    if (error) {
      console.error("Error logging security event:", error)
    }

    // For critical security events, we might want to trigger alerts
    if (
      eventType === SecurityEventType.SUSPICIOUS_ACTIVITY ||
      eventType === SecurityEventType.ACCOUNT_LOCKED ||
      eventType === SecurityEventType.ADMIN_ACTION
    ) {
      await triggerSecurityAlert(logEntry)
    }
  } catch (error) {
    console.error("Failed to log security event:", error)
  }
}

// Update the triggerSecurityAlert function to use the Slack integration
async function triggerSecurityAlert(logEntry: SecurityLogEntry): Promise<void> {
  // Check if webhook URL is configured
  const webhookUrl = process.env.SECURITY_WEBHOOK_URL
  if (!webhookUrl) {
    console.warn("SECURITY ALERT: No webhook URL configured. Security alert not sent:", logEntry)
    return
  }

  try {
    // Format the alert message based on the webhook type
    let formattedAlert

    // Check if it's a Slack webhook
    if (isSlackWebhookUrl(webhookUrl)) {
      formattedAlert = formatSlackMessage(logEntry)
    } else {
      // Generic format for other webhook services
      formattedAlert = {
        event: "security_alert",
        severity: EVENT_SEVERITY[logEntry.event_type] || "medium",
        timestamp: logEntry.created_at || new Date().toISOString(),
        event_type: logEntry.event_type,
        user_id: logEntry.user_id,
        email: logEntry.email,
        ip_address: logEntry.ip_address,
        user_agent: logEntry.user_agent,
        details: logEntry.details,
      }
    }

    // Send the alert to the webhook with retry logic
    await sendWebhookWithRetry(webhookUrl, formattedAlert)

    console.log(`Security alert sent to webhook for event: ${logEntry.event_type}`)
  } catch (error) {
    console.error("Failed to send security alert to webhook:", error)
  }
}

// Add these helper functions after triggerSecurityAlert

/**
 * Send webhook with retry logic
 */
async function sendWebhookWithRetry(url: string, payload: any, maxRetries = 3): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${await response.text()}`)
      }

      return response
    } catch (error) {
      lastError = error
      console.warn(`Webhook attempt ${attempt + 1}/${maxRetries} failed:`, error)

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000 // 1s, 2s, 4s, etc.
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error("Failed to send webhook after multiple attempts")
}

export async function getSecurityLogs(
  userId?: string,
  eventTypes?: SecurityEventType[],
  startDate?: Date,
  endDate?: Date,
  limit = 100,
  offset = 0,
): Promise<{ logs: SecurityLogEntry[]; count: number }> {
  try {
    let query = supabase.from("security_logs").select("*", { count: "exact" })

    if (userId) {
      query = query.eq("user_id", userId)
    }

    if (eventTypes && eventTypes.length > 0) {
      query = query.in("event_type", eventTypes)
    }

    if (startDate) {
      query = query.gte("created_at", startDate.toISOString())
    }

    if (endDate) {
      query = query.lte("created_at", endDate.toISOString())
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching security logs:", error)
      return { logs: [], count: 0 }
    }

    return { logs: data || [], count: count || 0 }
  } catch (error) {
    console.error("Failed to fetch security logs:", error)
    return { logs: [], count: 0 }
  }
}

export async function detectSuspiciousActivity(userId: string, ipAddress: string, userAgent: string): Promise<boolean> {
  try {
    // 1. Check for multiple failed login attempts
    const { count: failedLoginCount } = await supabase
      .from("security_logs")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .eq("event_type", SecurityEventType.LOGIN_FAILURE)
      .gte("created_at", new Date(Date.now() - 30 * 60 * 1000).toISOString()) // Last 30 minutes
      .limit(1)

    if (failedLoginCount && failedLoginCount > 5) {
      await logSecurityEvent(SecurityEventType.SUSPICIOUS_ACTIVITY, userId, undefined, {
        reason: "Multiple failed login attempts",
        count: failedLoginCount,
      })
      return true
    }

    // 2. Check for login from new location
    const { data: previousLogins } = await supabase
      .from("security_logs")
      .select("ip_address")
      .eq("user_id", userId)
      .eq("event_type", SecurityEventType.LOGIN_SUCCESS)
      .order("created_at", { ascending: false })
      .limit(5)

    const knownIPs = previousLogins?.map((log) => log.ip_address) || []

    if (previousLogins && previousLogins.length > 0 && !knownIPs.includes(ipAddress)) {
      await logSecurityEvent(SecurityEventType.SUSPICIOUS_ACTIVITY, userId, undefined, {
        reason: "Login from new location",
        ip_address: ipAddress,
        known_ips: knownIPs,
      })
      return true
    }

    // 3. Check for unusual user agent
    const { data: previousUserAgents } = await supabase
      .from("security_logs")
      .select("user_agent")
      .eq("user_id", userId)
      .eq("event_type", SecurityEventType.LOGIN_SUCCESS)
      .order("created_at", { ascending: false })
      .limit(5)

    const knownUserAgents = previousUserAgents?.map((log) => log.user_agent) || []

    if (previousUserAgents && previousUserAgents.length > 0 && !knownUserAgents.includes(userAgent)) {
      await logSecurityEvent(SecurityEventType.SUSPICIOUS_ACTIVITY, userId, undefined, {
        reason: "Unusual user agent",
        user_agent: userAgent,
      })
      return true
    }

    return false
  } catch (error) {
    console.error("Error detecting suspicious activity:", error)
    return false
  }
}

// Remove the formatSecurityAlert function since we now have a dedicated module for that

const EVENT_SEVERITY: Record<SecurityEventType, string> = {
  [SecurityEventType.SUSPICIOUS_ACTIVITY]: "high",
  [SecurityEventType.ACCOUNT_LOCKED]: "high",
  [SecurityEventType.LOGIN_FAILURE]: "medium",
  [SecurityEventType.ADMIN_ACTION]: "medium",
  [SecurityEventType.PERMISSION_CHANGE]: "medium",
  [SecurityEventType.SENSITIVE_DATA_ACCESS]: "medium",
  [SecurityEventType.GDPR_DATA_REQUEST]: "medium",
  [SecurityEventType.GDPR_DATA_DELETE]: "medium",
  // Default to "Low" for other event types
  [SecurityEventType.LOGIN_SUCCESS]: "low",
  [SecurityEventType.LOGOUT]: "low",
  [SecurityEventType.PASSWORD_CHANGE]: "low",
  [SecurityEventType.PASSWORD_RESET_REQUEST]: "low",
  [SecurityEventType.PASSWORD_RESET_COMPLETE]: "low",
  [SecurityEventType.MFA_ENABLED]: "low",
  [SecurityEventType.MFA_DISABLED]: "low",
  [SecurityEventType.MFA_CHALLENGE_SUCCESS]: "low",
  [SecurityEventType.MFA_CHALLENGE_FAILURE]: "low",
  [SecurityEventType.ACCOUNT_UNLOCKED]: "low",
  [SecurityEventType.API_KEY_CREATED]: "low",
  [SecurityEventType.API_KEY_DELETED]: "low",
  [SecurityEventType.RATE_LIMIT_EXCEEDED]: "low",
}
