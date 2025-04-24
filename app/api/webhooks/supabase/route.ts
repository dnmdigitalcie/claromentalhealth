import { type NextRequest, NextResponse } from "next/server"
import { createWebhookEvent } from "@/lib/webhook-service"
import { logSecurityEvent } from "@/lib/db/security-service"

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json()

    // Extract relevant information
    const eventType = determineEventType(body)
    const source = "supabase"

    // Create a webhook event
    await createWebhookEvent(eventType, source, body)

    // Return a success response
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing webhook:", error)

    // Log security event for webhook failure
    await logSecurityEvent("webhook_processing_error", {
      additionalDetails: {
        error: error instanceof Error ? error.message : "Unknown error",
      },
    })

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * Determine the event type based on the webhook payload
 */
function determineEventType(payload: any): string {
  try {
    // For Supabase database webhooks
    if (payload.type && payload.table && payload.schema) {
      const { type, table, schema } = payload

      // Format: table.action (e.g., users.created, courses.updated)
      const tableName = table.toLowerCase()
      let action = ""

      switch (type) {
        case "INSERT":
          action = "created"
          break
        case "UPDATE":
          action = "updated"
          break
        case "DELETE":
          action = "deleted"
          break
        default:
          action = type.toLowerCase()
      }

      return `${tableName}.${action}`
    }

    // For custom events
    if (payload.event) {
      return payload.event
    }

    // Default fallback
    return "unknown.event"
  } catch (error) {
    console.error("Error determining event type:", error)
    return "unknown.event"
  }
}
