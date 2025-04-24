"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WebhookEventsList } from "@/components/admin/webhook-events-list"
import { WebhookDestinationsList } from "@/components/admin/webhook-destinations-list"
import { WebhookStats } from "@/components/admin/webhook-stats"
import type { WebhookEventFilters } from "@/types/webhook"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function WebhookDashboard() {
  const [activeTab, setActiveTab] = useState("events")
  const [filters, setFilters] = useState<WebhookEventFilters>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Function to refresh data
  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  // Handle filter changes
  const handleFilterChange = (key: keyof WebhookEventFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Clear filters
  const clearFilters = () => {
    setFilters({})
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-calm-blue-900">Webhook Management</h1>
          <p className="text-calm-blue-600 mt-1">Monitor and manage webhook events and destinations</p>
        </div>
        <Button onClick={refreshData} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <WebhookStats refreshTrigger={refreshTrigger} />

      <Tabs defaultValue="events" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="destinations">Destinations</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Events</CardTitle>
              <CardDescription>View and manage webhook events sent from your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="event-type">Event Type</Label>
                  <Select
                    value={filters.eventType || ""}
                    onValueChange={(value) => handleFilterChange("eventType", value || undefined)}
                  >
                    <SelectTrigger id="event-type">
                      <SelectValue placeholder="All event types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All event types</SelectItem>
                      <SelectItem value="user.created">User Created</SelectItem>
                      <SelectItem value="user.updated">User Updated</SelectItem>
                      <SelectItem value="course.published">Course Published</SelectItem>
                      <SelectItem value="enrollment.created">Enrollment Created</SelectItem>
                      <SelectItem value="lesson.completed">Lesson Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={filters.status || ""}
                    onValueChange={(value) => handleFilterChange("status", value || undefined)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="retrying">Retrying</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="source">Source</Label>
                  <Select
                    value={filters.source || ""}
                    onValueChange={(value) => handleFilterChange("source", value || undefined)}
                  >
                    <SelectTrigger id="source">
                      <SelectValue placeholder="All sources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All sources</SelectItem>
                      <SelectItem value="api">API</SelectItem>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end mb-4">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>

              <WebhookEventsList
                filters={filters}
                refreshTrigger={refreshTrigger}
                onError={(message) => setError(message)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="destinations" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Destinations</CardTitle>
              <CardDescription>Configure endpoints where webhook events will be sent</CardDescription>
            </CardHeader>
            <CardContent>
              <WebhookDestinationsList refreshTrigger={refreshTrigger} onError={(message) => setError(message)} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
