export type WebhookEventStatus = "pending" | "processing" | "delivered" | "failed" | "retrying"
export type WebhookRetryStrategy = "exponential" | "linear" | "fixed"

export interface WebhookEvent {
  id: string
  eventType: string
  source: string
  status: WebhookEventStatus
  payload: Record<string, any>
  responseCode?: number
  responseBody?: string
  errorMessage?: string
  processingTime?: number // in milliseconds
  retryCount: number
  maxRetries: number
  nextRetryAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface WebhookDestination {
  id: string
  name: string
  url: string
  secret?: string
  eventTypes: string[]
  headers?: Record<string, string>
  active: boolean
  retryStrategy: WebhookRetryStrategy
  maxRetries: number
  createdAt: Date
  updatedAt: Date
}

export interface WebhookLog {
  id: string
  webhookEventId: string
  attemptNumber: number
  requestUrl: string
  requestHeaders?: Record<string, string>
  requestBody?: string
  responseCode?: number
  responseHeaders?: Record<string, string>
  responseBody?: string
  errorMessage?: string
  duration?: number // in milliseconds
  createdAt: Date
}

export interface WebhookEventWithLogs extends WebhookEvent {
  logs: WebhookLog[]
}

export interface WebhookEventFilters {
  eventType?: string
  source?: string
  status?: WebhookEventStatus
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}

export interface WebhookStats {
  total: number
  delivered: number
  failed: number
  pending: number
  retrying: number
  successRate: number
}
