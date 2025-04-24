import { notFound } from "next/navigation"
import { getWebhookEventWithLogs } from "@/lib/webhook-service"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WebhookEventDetail } from "@/components/admin/webhook-event-detail"
import { formatDistanceToNow, format } from "date-fns"
import { AlertCircle, CheckCircle, Clock, RefreshCw, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

interface WebhookEventDetailPageProps {
  params: {
    id: string
  }
}

export default async function WebhookEventDetailPage({ params }: WebhookEventDetailPageProps) {
  const event = await getWebhookEventWithLogs(params.id)

  if (!event) {
    notFound()
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
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <div className="mb-6">
            <Link href="/admin/webhooks" className="flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Webhooks
            </Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Webhook Event Details</h1>
              <p className="text-muted-foreground">Event ID: {event.id}</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(event.status)}
              {(event.status === "failed" || event.status === "retrying") && (
                <form action={`/api/webhooks/retry?id=${event.id}`} method="POST">
                  <Button type="submit" variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-1" /> Retry
                  </Button>
                </form>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
                <CardDescription>Basic information about this webhook event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm font-medium">Event Type</div>
                  <div className="col-span-2">{event.eventType}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm font-medium">Source</div>
                  <div className="col-span-2">{event.source}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm font-medium">Status</div>
                  <div className="col-span-2">{getStatusBadge(event.status)}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm font-medium">Created</div>
                  <div className="col-span-2">
                    {format(event.createdAt, "PPpp")}
                    <span className="text-muted-foreground ml-2">
                      ({formatDistanceToNow(event.createdAt, { addSuffix: true })})
                    </span>
                  </div>
                </div>
                {event.processingTime && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-sm font-medium">Processing Time</div>
                    <div className="col-span-2">{event.processingTime}ms</div>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm font-medium">Retry Count</div>
                  <div className="col-span-2">
                    {event.retryCount} of {event.maxRetries}
                  </div>
                </div>
                {event.nextRetryAt && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-sm font-medium">Next Retry</div>
                    <div className="col-span-2">
                      {format(event.nextRetryAt, "PPpp")}
                      <span className="text-muted-foreground ml-2">
                        ({formatDistanceToNow(event.nextRetryAt, { addSuffix: true })})
                      </span>
                    </div>
                  </div>
                )}
                {event.errorMessage && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-sm font-medium">Error</div>
                    <div className="col-span-2 text-red-600">{event.errorMessage}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Information</CardTitle>
                <CardDescription>Details about the webhook response</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.responseCode ? (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-sm font-medium">Status Code</div>
                      <div className="col-span-2">
                        <Badge
                          variant={event.responseCode >= 200 && event.responseCode < 300 ? "outline" : "destructive"}
                        >
                          {event.responseCode}
                        </Badge>
                      </div>
                    </div>
                    {event.logs.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-sm font-medium">Attempts</div>
                        <div className="col-span-2">{event.logs.length}</div>
                      </div>
                    )}
                    {event.logs.length > 0 && event.logs[0].duration && (
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-sm font-medium">Last Duration</div>
                        <div className="col-span-2">{event.logs[0].duration}ms</div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">No response information available</div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <WebhookEventDetail event={event} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
