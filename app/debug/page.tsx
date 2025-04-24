"use client"

import { useState, useEffect } from "react"
import ReactVersion from "@/components/react-version"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugPage() {
  const [environmentInfo, setEnvironmentInfo] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Collect environment information
    const info = {
      nextRuntime: process.env.NEXT_RUNTIME || "unknown",
      nodeVersion: process.version,
      platform: process.platform,
      timestamp: new Date().toISOString(),
    }

    setEnvironmentInfo(info)
    setLoading(false)
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Debug Information</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>React Information</CardTitle>
            <CardDescription>Details about the React version</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactVersion />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Information</CardTitle>
            <CardDescription>Details about the runtime environment</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading environment information...</p>
            ) : (
              <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(environmentInfo, null, 2)}</pre>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>Refresh Information</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
