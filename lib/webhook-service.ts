import { supabase } from "@/lib/supabase"
import { generateId } from "@/lib/utils"
import type {
  WebhookEvent,
  WebhookDestination,
  WebhookLog,
  WebhookEventFilters,
  WebhookStats,
  WebhookEventWithLogs,
} from "@/types/webhook"
import { logSecurityEvent } from "./db/security-service"

/**
 * Create a new webhook event
 */
export async function createWebhookEvent(
  eventType: string,
  source: string,
  payload: Record<string, any>,
): Promise<WebhookEvent | null> {
  try {
    const id = generateId(24)
    const now = new Date()

    const { data, error } = await supabase
      .from("webhook_events")
      .insert({
        id,
        event_type: eventType,
        source,
        status: "pending",
        payload,
        retry_count: 0,
        max_retries: 3,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating webhook event:", error)
      return null
    }

    // Queue the event for processing
    await queueWebhookEvent(id)

    return mapWebhookEvent(data)
  } catch (error) {
    console.error("Error in createWebhookEvent:", error)
    return null
  }
}

/**
 * Queue a webhook event for processing
 */
async function queueWebhookEvent(eventId: string): Promise<boolean> {
  try {
    // In a production environment, this would add the event to a queue
    // For this demo, we'll process it immediately
    setTimeout(() => processWebhookEvent(eventId), 100)
    return true
  } catch (error) {
    console.error("Error in queueWebhookEvent:", error)
    return false
  }
}

/**
 * Process a webhook event
 */
async function processWebhookEvent(eventId: string): Promise<boolean> {
  try {
    // Update status to processing
    await supabase
      .from("webhook_events")
      .update({
        status: "processing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId)

    // Get the event
    const { data: event } = await supabase.from("webhook_events").select("*").eq("id", eventId).single()

    if (!event) {
      console.error("Webhook event not found:", eventId)
      return false
    }

    // Get destinations for this event type
    const { data: destinations } = await supabase
      .from("webhook_destinations")
      .select("*")
      .filter("active", "eq", true)
      .contains("event_types", [event.event_type])

    if (!destinations || destinations.length === 0) {
      // No destinations, mark as delivered
      await supabase
        .from("webhook_events")
        .update({
          status: "delivered",
          updated_at: new Date().toISOString(),
        })
        .eq("id", eventId)
      return true
    }

    // Send to each destination
    let allSuccessful = true
    for (const destination of destinations) {
      const success = await sendWebhook(eventId, event, destination)
      if (!success) {
        allSuccessful = false
      }
    }

    // Update status based on results
    await supabase
      .from("webhook_events")
      .update({
        status: allSuccessful ? "delivered" : "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId)

    return allSuccessful
  } catch (error) {
    console.error("Error in processWebhookEvent:", error)

    // Update status to failed
    await supabase
      .from("webhook_events")
      .update({
        status: "failed",
        error_message: error instanceof Error ? error.message : "Unknown error",
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId)

    return false
  }
}

/**
 * Send a webhook to a destination
 */
async function sendWebhook(eventId: string, event: any, destination: any): Promise<boolean> {
  const startTime = Date.now()
  const attemptNumber = event.retry_count + 1

  try {
    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Webhook-ID": eventId,
      "X-Webhook-Signature": generateSignature(event.payload, destination.secret),
      "X-Webhook-Event": event.event_type,
      "X-Webhook-Timestamp": new Date().toISOString(),
      ...destination.headers,
    }

    // Prepare request body
    const body = JSON.stringify({
      id: eventId,
      event_type: event.event_type,
      created_at: event.created_at,
      payload: event.payload,
    })

    // Send the request
    const response = await fetch(destination.url, {
      method: "POST",
      headers,
      body,
    })

    const responseBody = await response.text()
    const duration = Date.now() - startTime

    // Log the attempt
    await logWebhookAttempt({
      webhookEventId: eventId,
      attemptNumber,
      requestUrl: destination.url,
      requestHeaders: headers,
      requestBody: body,
      responseCode: response.status,
      responseHeaders: Object.fromEntries(response.headers.entries()),
      responseBody,
      duration,
    })

    // Update the event
    await supabase
      .from("webhook_events")
      .update({
        response_code: response.status,
        response_body: responseBody,
        processing_time: duration,
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId)

    // Check if successful
    const isSuccess = response.status >= 200 && response.status < 300

    if (!isSuccess) {
      // Handle retry if needed
      await handleRetry(eventId, event, destination)
    }

    return isSuccess
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    // Log the failed attempt
    await logWebhookAttempt({
      webhookEventId: eventId,
      attemptNumber,
      requestUrl: destination.url,
      requestHeaders: {
        "Content-Type": "application/json",
        "X-Webhook-ID": eventId,
        "X-Webhook-Event": event.event_type,
      },
      requestBody: JSON.stringify(event.payload),
      errorMessage,
      duration,
    })

    // Update the event
    await supabase
      .from("webhook_events")
      .update({
        error_message: errorMessage,
        processing_time: duration,
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId)

    // Handle retry
    await handleRetry(eventId, event, destination)

    return false
  }
}

/**
 * Handle retry logic for failed webhook deliveries
 */
async function handleRetry(eventId: string, event: any, destination: any): Promise<void> {
  try {
    const retryCount = event.retry_count + 1

    // Check if we've reached max retries
    if (retryCount >= destination.max_retries) {
      await supabase
        .from("webhook_events")
        .update({
          status: "failed",
          retry_count: retryCount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", eventId)

      // Log security event for webhook failure
      await logSecurityEvent("webhook_failure", {
        additionalDetails: {
          eventId,
          eventType: event.event_type,
          destination: destination.name,
          maxRetriesReached: true,
        },
      })

      return
    }

    // Calculate next retry time based on strategy
    const nextRetryAt = calculateNextRetryTime(retryCount, destination.retry_strategy)

    // Update event with retry information
    await supabase
      .from("webhook_events")
      .update({
        status: "retrying",
        retry_count: retryCount,
        next_retry_at: nextRetryAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId)

    // Schedule the retry
    // In a production environment, this would use a proper job queue
    const delayMs = nextRetryAt.getTime() - Date.now()
    setTimeout(() => processWebhookEvent(eventId), delayMs)
  } catch (error) {
    console.error("Error in handleRetry:", error)
  }
}

/**
 * Calculate the next retry time based on retry strategy
 */
function calculateNextRetryTime(retryCount: number, strategy: string): Date {
  const now = new Date()

  switch (strategy) {
    case "exponential":
      // Exponential backoff: 2^retryCount * 1000ms
      now.setMilliseconds(now.getMilliseconds() + Math.pow(2, retryCount) * 1000)
      break
    case "linear":
      // Linear backoff: retryCount * 1000ms
      now.setMilliseconds(now.getMilliseconds() + retryCount * 1000)
      break
    case "fixed":
    default:
      // Fixed delay: 5000ms
      now.setMilliseconds(now.getMilliseconds() + 5000)
      break
  }

  return now
}

/**
 * Log a webhook attempt
 */
async function logWebhookAttempt(log: Partial<WebhookLog>): Promise<boolean> {
  try {
    const id = generateId(24)
    const now = new Date()

    const { error } = await supabase.from("webhook_logs").insert({
      id,
      webhook_event_id: log.webhookEventId,
      attempt_number: log.attemptNumber,
      request_url: log.requestUrl,
      request_headers: log.requestHeaders,
      request_body: log.requestBody,
      response_code: log.responseCode,
      response_headers: log.responseHeaders,
      response_body: log.responseBody,
      error_message: log.errorMessage,
      duration: log.duration,
      created_at: now.toISOString(),
    })

    return !error
  } catch (error) {
    console.error("Error in logWebhookAttempt:", error)
    return false
  }
}

/**
 * Generate a signature for webhook payload
 */
function generateSignature(payload: any, secret?: string): string {
  if (!secret) return ""

  const crypto = require("crypto")
  const hmac = crypto.createHmac("sha256", secret)
  hmac.update(JSON.stringify(payload))
  return hmac.digest("hex")
}

/**
 * Get webhook events with optional filtering
 */
export async function getWebhookEvents(
  filters: WebhookEventFilters = {},
): Promise<{ events: WebhookEvent[]; total: number }> {
  try {
    let query = supabase.from("webhook_events").select("*", { count: "exact" })

    if (filters.eventType) {
      query = query.eq("event_type", filters.eventType)
    }

    if (filters.source) {
      query = query.eq("source", filters.source)
    }

    if (filters.status) {
      query = query.eq("status", filters.status)
    }

    if (filters.startDate) {
      query = query.gte("created_at", filters.startDate.toISOString())
    }

    if (filters.endDate) {
      query = query.lte("created_at", filters.endDate.toISOString())
    }

    // Add pagination
    const limit = filters.limit || 20
    const offset = filters.offset || 0
    query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching webhook events:", error)
      return { events: [], total: 0 }
    }

    return {
      events: data.map(mapWebhookEvent),
      total: count || 0,
    }
  } catch (error) {
    console.error("Error in getWebhookEvents:", error)
    return { events: [], total: 0 }
  }
}

/**
 * Get a single webhook event with its logs
 */
export async function getWebhookEventWithLogs(eventId: string): Promise<WebhookEventWithLogs | null> {
  try {
    // Get the event
    const { data: event, error: eventError } = await supabase
      .from("webhook_events")
      .select("*")
      .eq("id", eventId)
      .single()

    if (eventError || !event) {
      console.error("Error fetching webhook event:", eventError)
      return null
    }

    // Get the logs
    const { data: logs, error: logsError } = await supabase
      .from("webhook_logs")
      .select("*")
      .eq("webhook_event_id", eventId)
      .order("attempt_number", { ascending: true })

    if (logsError) {
      console.error("Error fetching webhook logs:", logsError)
      return null
    }

    return {
      ...mapWebhookEvent(event),
      logs: logs.map(mapWebhookLog),
    }
  } catch (error) {
    console.error("Error in getWebhookEventWithLogs:", error)
    return null
  }
}

/**
 * Get webhook destinations
 */
export async function getWebhookDestinations(): Promise<WebhookDestination[]> {
  try {
    const { data, error } = await supabase.from("webhook_destinations").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching webhook destinations:", error)
      return []
    }

    return data.map(mapWebhookDestination)
  } catch (error) {
    console.error("Error in getWebhookDestinations:", error)
    return []
  }
}

/**
 * Create or update a webhook destination
 */
export async function saveWebhookDestination(
  destination: Partial<WebhookDestination> & { id?: string },
): Promise<WebhookDestination | null> {
  try {
    const now = new Date()

    if (destination.id) {
      // Update existing destination
      const { data, error } = await supabase
        .from("webhook_destinations")
        .update({
          name: destination.name,
          url: destination.url,
          secret: destination.secret,
          event_types: destination.eventTypes,
          headers: destination.headers,
          active: destination.active,
          retry_strategy: destination.retryStrategy,
          max_retries: destination.maxRetries,
          updated_at: now.toISOString(),
        })
        .eq("id", destination.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating webhook destination:", error)
        return null
      }

      return mapWebhookDestination(data)
    } else {
      // Create new destination
      const id = generateId(24)

      const { data, error } = await supabase
        .from("webhook_destinations")
        .insert({
          id,
          name: destination.name,
          url: destination.url,
          secret: destination.secret,
          event_types: destination.eventTypes,
          headers: destination.headers,
          active: destination.active !== undefined ? destination.active : true,
          retry_strategy: destination.retryStrategy || "exponential",
          max_retries: destination.maxRetries || 3,
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating webhook destination:", error)
        return null
      }

      return mapWebhookDestination(data)
    }
  } catch (error) {
    console.error("Error in saveWebhookDestination:", error)
    return null
  }
}

/**
 * Delete a webhook destination
 */
export async function deleteWebhookDestination(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("webhook_destinations").delete().eq("id", id)

    return !error
  } catch (error) {
    console.error("Error in deleteWebhookDestination:", error)
    return false
  }
}

/**
 * Get webhook statistics
 */
export async function getWebhookStats(startDate?: Date, endDate?: Date): Promise<WebhookStats> {
  try {
    let query = supabase.from("webhook_events").select("status", { count: "exact" })

    if (startDate) {
      query = query.gte("created_at", startDate.toISOString())
    }

    if (endDate) {
      query = query.lte("created_at", endDate.toISOString())
    }

    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching webhook stats:", error)
      return {
        total: 0,
        delivered: 0,
        failed: 0,
        pending: 0,
        retrying: 0,
        successRate: 0,
      }
    }

    const total = count || 0
    const delivered = data.filter((e) => e.status === "delivered").length
    const failed = data.filter((e) => e.status === "failed").length
    const pending = data.filter((e) => e.status === "pending").length
    const retrying = data.filter((e) => e.status === "retrying").length
    const successRate = total > 0 ? (delivered / total) * 100 : 0

    return {
      total,
      delivered,
      failed,
      pending,
      retrying,
      successRate,
    }
  } catch (error) {
    console.error("Error in getWebhookStats:", error)
    return {
      total: 0,
      delivered: 0,
      failed: 0,
      pending: 0,
      retrying: 0,
      successRate: 0,
    }
  }
}

/**
 * Retry a failed webhook event
 */
export async function retryWebhookEvent(eventId: string): Promise<boolean> {
  try {
    // Get the event
    const { data: event, error: eventError } = await supabase
      .from("webhook_events")
      .select("*")
      .eq("id", eventId)
      .single()

    if (eventError || !event) {
      console.error("Error fetching webhook event:", eventError)
      return false
    }

    // Reset retry count and status
    await supabase
      .from("webhook_events")
      .update({
        status: "pending",
        retry_count: 0,
        next_retry_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId)

    // Queue for processing
    await queueWebhookEvent(eventId)

    return true
  } catch (error) {
    console.error("Error in retryWebhookEvent:", error)
    return false
  }
}

// Helper functions to map database records to TypeScript types
function mapWebhookEvent(record: any): WebhookEvent {
  return {
    id: record.id,
    eventType: record.event_type,
    source: record.source,
    status: record.status,
    payload: record.payload,
    responseCode: record.response_code,
    responseBody: record.response_body,
    errorMessage: record.error_message,
    processingTime: record.processing_time,
    retryCount: record.retry_count,
    maxRetries: record.max_retries,
    nextRetryAt: record.next_retry_at ? new Date(record.next_retry_at) : undefined,
    createdAt: new Date(record.created_at),
    updatedAt: new Date(record.updated_at),
  }
}

function mapWebhookDestination(record: any): WebhookDestination {
  return {
    id: record.id,
    name: record.name,
    url: record.url,
    secret: record.secret,
    eventTypes: record.event_types,
    headers: record.headers,
    active: record.active,
    retryStrategy: record.retry_strategy,
    maxRetries: record.max_retries,
    createdAt: new Date(record.created_at),
    updatedAt: new Date(record.updated_at),
  }
}

function mapWebhookLog(record: any): WebhookLog {
  return {
    id: record.id,
    webhookEventId: record.webhook_event_id,
    attemptNumber: record.attempt_number,
    requestUrl: record.request_url,
    requestHeaders: record.request_headers,
    requestBody: record.request_body,
    responseCode: record.response_code,
    responseHeaders: record.response_headers,
    responseBody: record.response_body,
    errorMessage: record.error_message,
    duration: record.duration,
    createdAt: new Date(record.created_at),
  }
}
