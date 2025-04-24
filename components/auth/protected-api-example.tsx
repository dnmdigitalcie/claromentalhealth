"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function ProtectedApiExample() {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const callProtectedApi = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Call the protected API
      const response = await fetch("/api/protected", {
        credentials: "include", // Include cookies
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const responseData = await response.json()
      setData(responseData)
    } catch (err: any) {
      console.error("Error calling protected API:", err)
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-calm-blue-100">
      <CardHeader>
        <CardTitle className="text-calm-blue-800">Protected API Example</CardTitle>
        <CardDescription>Test calling a protected API endpoint</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {data && (
          <Alert className="bg-green-50 border-green-200 mb-4">
            <AlertDescription>
              <p className="text-green-800">API call successful!</p>
              <pre className="mt-2 bg-white p-2 rounded text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={callProtectedApi}
          disabled={isLoading}
          className="w-full bg-calm-blue-600 hover:bg-calm-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calling API...
            </>
          ) : (
            "Call Protected API"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
