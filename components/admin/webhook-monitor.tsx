"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { WebhookEvent } from "@/types/webhook"
import { getWebhookEvents } from "@/lib/webhook-service"
import { formatDistanceToNow } from "date-fns"
import { AlertCircle, CheckCircle, Clock, RefreshCw, Loader2 } from "lucide-react"
import Link from "next/link"

export function WebhookMonitor() {
  const [events, setEvents] = useState<WebhookEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchEvents()

    // Set up polling every 30 seconds
    const interval = setInterval(fetchEvents, 30000)

    return () => clearInterval(interval)
  }, [activeTab])

  async function fetchEvents() {
    setIsLoading(true)
    try {
      const filters: any = { limit: 5 }

      if (activeTab !== "all") {
        filters.status = activeTab
      }

      const { events } = await getWebhookEvents(filters)
      setEvents(events)
    } catch (error) {
      console.error("Error fetching webhook events:", error)
    } finally {
      setIsLoading(false)
    }
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Webhooks</CardTitle>
            <CardDescription>Monitor recent webhook activity</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchEvents} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
            <TabsTrigger value="retrying">Retrying</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-md" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No webhook events found</div>
            ) : (
              <div className="space-y-2">
                {events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/admin/webhooks/events/${event.id}`}
                    className="block p-3 rounded-md border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{event.eventType}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDistanceToNow(event.createdAt, { addSuffix: true })}
                        </div>
                      </div>
                      <div>{getStatusBadge(event.status)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-4 text-center">
              <Link href="/admin/webhooks">
                <Button variant="outline">View All Webhooks</Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
