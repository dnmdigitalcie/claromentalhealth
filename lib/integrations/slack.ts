/**
 * Slack Integration Utility
 *
 * This module provides utilities for formatting and sending messages to Slack webhooks.
 */

import type { SecurityEventType, SecurityLogEntry } from "@/lib/security-logger"

// Define severity levels and their corresponding colors in Slack
const SEVERITY_COLORS = {
  high: "#FF0000", // Red
  medium: "#FFA500", // Orange
  low: "#FFFF00", // Yellow
  info: "#00FF00", // Green
}

// Map security event types to severity levels
export const EVENT_SEVERITY: Record<SecurityEventType, "high" | "medium" | "low" | "info"> = {
  SUSPICIOUS_ACTIVITY: "high",
  ACCOUNT_LOCKED: "high",
  LOGIN_FAILURE: "medium",
  ADMIN_ACTION: "medium",
  PERMISSION_CHANGE: "medium",
  SENSITIVE_DATA_ACCESS: "medium",
  GDPR_DATA_REQUEST: "medium",
  GDPR_DATA_DELETE: "medium",
  MFA_CHALLENGE_FAILURE: "medium",
  API_KEY_CREATED: "medium",
  API_KEY_DELETED: "medium",
  PASSWORD_RESET_REQUEST: "medium",
  LOGIN_SUCCESS: "low",
  LOGOUT: "low",
  PASSWORD_CHANGE: "low",
  PASSWORD_RESET_COMPLETE: "low",
  MFA_ENABLED: "low",
  MFA_DISABLED: "low",
  MFA_CHALLENGE_SUCCESS: "low",
  ACCOUNT_UNLOCKED: "low",
}

// Map security event types to emoji icons
export const EVENT_ICONS: Record<SecurityEventType, string> = {
  SUSPICIOUS_ACTIVITY: "🚨",
  ACCOUNT_LOCKED: "🔒",
  LOGIN_FAILURE: "❌",
  ADMIN_ACTION: "🛠️",
  PERMISSION_CHANGE: "🔑",
  SENSITIVE_DATA_ACCESS: "👁️",
  GDPR_DATA_REQUEST: "📋",
  GDPR_DATA_DELETE: "🗑️",
  LOGIN_SUCCESS: "✅",
  LOGOUT: "👋",
  PASSWORD_CHANGE: "🔄",
  PASSWORD_RESET_REQUEST: "📧",
  PASSWORD_RESET_COMPLETE: "✅",
  MFA_ENABLED: "🛡️",
  MFA_DISABLED: "🔓",
  MFA_CHALLENGE_SUCCESS: "✅",
  MFA_CHALLENGE_FAILURE: "❌",
  ACCOUNT_UNLOCKED: "🔓",
  API_KEY_CREATED: "🔑",
  API_KEY_DELETED: "🗑️",
}

/**
 * Format a security event for Slack
 */
export function formatSlackMessage(logEntry: SecurityLogEntry): any {
  const timestamp = new Date(logEntry.created_at || new Date()).toISOString()
  const severity = EVENT_SEVERITY[logEntry.event_type] || "medium"
  const icon = EVENT_ICONS[logEntry.event_type] || "🔔"

  // Format the event type to be more readable
  const eventTypeFormatted = logEntry.event_type
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ")

  // Create the main message blocks
  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `${icon} Security Alert: ${eventTypeFormatted}`,
        emoji: true,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Severity:*\n${severity.charAt(0).toUpperCase() + severity.slice(1)}`,
        },
        {
          type: "mrkdwn",
          text: `*Time:*\n<!date^${Math.floor(new Date(timestamp).getTime() / 1000)}^{date_short_pretty} at {time}|${timestamp}>`,
        },
      ],
    },
  ]

  // Add user information if available
  if (logEntry.user_id || logEntry.email) {
    blocks.push({
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*User ID:*\n${logEntry.user_id || "Unknown"}`,
        },
        {
          type: "mrkdwn",
          text: `*Email:*\n${logEntry.email || "Unknown"}`,
        },
      ],
    })
  }

  // Add location information if available
  if (logEntry.ip_address || logEntry.user_agent) {
    blocks.push({
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*IP Address:*\n${logEntry.ip_address || "Unknown"}`,
        },
        {
          type: "mrkdwn",
          text: `*User Agent:*\n${truncateText(logEntry.user_agent || "Unknown", 100)}`,
        },
      ],
    })
  }

  // Add details if available
  if (logEntry.details && Object.keys(logEntry.details).length > 0) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Details:*\n\`\`\`${JSON.stringify(logEntry.details, null, 2)}\`\`\``,
      },
    })
  }

  // Add divider
  blocks.push({ type: "divider" })

  // Add context with app name and environment
  blocks.push({
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `*App:* ${process.env.NEXT_PUBLIC_APP_NAME || "Claro Mental Health"} | *Environment:* ${process.env.NODE_ENV || "development"}`,
      },
    ],
  })

  // Return the formatted Slack message
  return {
    blocks,
    attachments: [
      {
        color: SEVERITY_COLORS[severity],
        fallback: `${icon} Security Alert: ${eventTypeFormatted} (${severity.toUpperCase()})`,
      },
    ],
  }
}

/**
 * Send a message to a Slack webhook
 */
export async function sendSlackMessage(webhookUrl: string, message: any): Promise<Response> {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  })

  if (!response.ok) {
    throw new Error(`Slack API error: ${response.status} ${await response.text()}`)
  }

  return response
}

/**
 * Helper function to truncate text
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

/**
 * Check if a URL is a Slack webhook URL
 */
export function isSlackWebhookUrl(url: string): boolean {
  return url.includes("hooks.slack.com/services/")
}
