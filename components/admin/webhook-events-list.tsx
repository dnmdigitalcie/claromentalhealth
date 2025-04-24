"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import type { WebhookEvent, WebhookEventFilters } from "@/types/webhook"
import { getWebhookEvents, retryWebhookEvent } from "@/lib/webhook-service"
import { formatDistanceToNow } from "date-fns"
import { AlertCircle, CheckCircle, Clock, RefreshCw, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface WebhookEventsListProps {
  filters: WebhookEventFilters
  refreshTrigger: number
  onError: (message: string) => void
}

export function WebhookEventsList({ filters, refreshTrigger, onError }: WebhookEventsListProps) {
  const [events, setEvents] = useState<WebhookEvent[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [isRetrying, setIsRetrying] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const limit = 10

  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true)
      try {
        const offset = (page - 1) * limit
        const { events, total } = await getWebhookEvents({
          ...filters,
          limit,
          offset,
        })

        setEvents(events)
        setTotal(total)
      } catch (error) {
        console.error("Error fetching webhook events:", error)
        onError("Failed to load webhook events. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [filters, page, refreshTrigger, onError])

  const totalPages = Math.ceil(total / limit)

  const handleRetry = async (eventId: string) => {
    setIsRetrying((prev) => ({ ...prev, [eventId]: true }))
    try {
      const success = await retryWebhookEvent(eventId)
      if (!success) {
        onError("Failed to retry webhook event. Please try again.")
      }
    } catch (error) {
      console.error("Error retrying webhook event:", error)
      onError("An error occurred while retrying the webhook event.")
    } finally {
      setIsRetrying((prev) => ({ ...prev, [eventId]: false }))
    }
  }

  const handleViewDetails = (eventId: string) => {
    router.push(`/admin/webhooks/events/${eventId}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Delivered
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" /> Failed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="border-blue-200 text-blue-700">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Processing
          </Badge>
        )
      case "retrying":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
            <RefreshCw className="h-3 w-3 mr-1" /> Retrying
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No webhook events found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Type</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.eventType}</TableCell>
                <TableCell>{event.source}</TableCell>
                <TableCell>{getStatusBadge(event.status)}</TableCell>
                <TableCell>{formatDistanceToNow(event.createdAt, { addSuffix: true })}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(event.id)}>
                      View
                    </Button>
                    {(event.status === "failed" || event.status === "retrying") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetry(event.id)}
                        disabled={isRetrying[event.id]}
                      >
                        {isRetrying[event.id] ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Retrying
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-3 w-3 mr-1" /> Retry
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} />
            </PaginationItem>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              // Show pages around current page
              let pageNum = page
              if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }

              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <PaginationItem key={i}>
                    <PaginationLink isActive={pageNum === page} onClick={() => setPage(pageNum)}>
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              }
              return null
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
