"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WebhookStats as WebhookStatsType } from "@/types/webhook"
import { getWebhookStats } from "@/lib/webhook-service"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, AlertCircle, Clock, RefreshCw } from "lucide-react"

interface WebhookStatsProps {
  refreshTrigger: number
}

export function WebhookStats({ refreshTrigger }: WebhookStatsProps) {
  const [stats, setStats] = useState<WebhookStatsType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true)
      try {
        // Get stats for the last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const data = await getWebhookStats(thirtyDaysAgo)
        setStats(data)
      } catch (error) {
        console.error("Error fetching webhook stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [refreshTrigger])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-4 w-28 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          <div className="h-4 w-4 text-muted-foreground">
            <Clock className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          <div className="h-4 w-4 text-green-500">
            <CheckCircle className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.delivered.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {stats.total > 0 ? (
              <span className="text-green-500">{Math.round((stats.delivered / stats.total) * 100)}% success rate</span>
            ) : (
              "No events"
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed</CardTitle>
          <div className="h-4 w-4 text-red-500">
            <AlertCircle className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.failed.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {stats.total > 0 ? (
              <span className="text-red-500">{Math.round((stats.failed / stats.total) * 100)}% failure rate</span>
            ) : (
              "No events"
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Retrying</CardTitle>
          <div className="h-4 w-4 text-amber-500">
            <RefreshCw className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.retrying.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {stats.total > 0 ? (
              <span className="text-amber-500">{Math.round((stats.retrying / stats.total) * 100)}% of total</span>
            ) : (
              "No events"
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
