"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface RateLimitRecord {
  id: string
  key: string
  count: number
  reset_time: string
  created_at: string
  updated_at: string
}

export function RateLimitMonitor() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rateLimits, setRateLimits] = useState<RateLimitRecord[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [supabase, setSupabase] = useState(null)

  useEffect(() => {
    // Only initialize Supabase client on the client side
    try {
      const supabaseClient = createClientComponentClient()
      setSupabase(supabaseClient)
    } catch (error) {
      console.error("Error initializing Supabase client:", error)
      setError("Failed to initialize database connection")
    }
  }, [])

  const fetchRateLimits = async () => {
    if (!supabase) {
      setError("Database connection not available")
      return
    }

    setIsRefreshing(true)
    setError(null)

    try {
      // In a real app, you would fetch this from an API endpoint
      const { data, error } = await supabase
        .from("rate_limits")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(50)

      if (error) throw error

      setRateLimits(data || [])
    } catch (err) {
      console.error("Error fetching rate limits:", err)
      setError("Failed to fetch rate limit data")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchRateLimits()
  }, [])

  const handleRunCleanup = async () => {
    setIsRefreshing(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/run-scheduled-tasks", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to run cleanup task")
      }

      // Refresh the data
      await fetchRateLimits()
    } catch (err) {
      console.error("Error running cleanup:", err)
      setError("Failed to run cleanup task")
    } finally {
      setIsRefreshing(false)
    }
  }

  // Format the key to make it more readable
  const formatKey = (key: string) => {
    const parts = key.split(":")
    if (parts.length >= 3) {
      return {
        endpoint: parts[1],
        identifier: parts.slice(2).join(":"),
      }
    }
    return { endpoint: "unknown", identifier: key }
  }

  // Calculate time remaining until reset
  const getTimeRemaining = (resetTime: string) => {
    const reset = new Date(resetTime).getTime()
    const now = Date.now()
    const diff = reset - now

    if (diff <= 0) return "Expired"

    const minutes = Math.floor(diff / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return `${minutes}m ${seconds}s`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate Limit Monitor</CardTitle>
        <CardDescription>View active rate limits and potential abuse attempts</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-calm-blue-600" />
          </div>
        ) : rateLimits.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No active rate limits found</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Identifier</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Time Remaining</TableHead>
                  <TableHead className="text-right">Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rateLimits.map((record) => {
                  const { endpoint, identifier } = formatKey(record.key)
                  const timeRemaining = getTimeRemaining(record.reset_time)
                  const isExpired = timeRemaining === "Expired"
                  const isHighCount = record.count > 10

                  return (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{endpoint}</TableCell>
                      <TableCell className="font-mono text-xs">{identifier}</TableCell>
                      <TableCell className={`text-right ${isHighCount ? "text-red-600 font-bold" : ""}`}>
                        {record.count}
                      </TableCell>
                      <TableCell className={`text-right ${isExpired ? "text-muted-foreground" : ""}`}>
                        {timeRemaining}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {new Date(record.updated_at).toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={fetchRateLimits} disabled={isRefreshing}>
          {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
        <Button onClick={handleRunCleanup} disabled={isRefreshing}>
          {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Run Cleanup"}
        </Button>
      </CardFooter>
    </Card>
  )
}
