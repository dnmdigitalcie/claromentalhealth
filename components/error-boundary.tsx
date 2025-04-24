"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function ErrorBoundary({
  children,
}: {
  children: React.ReactNode
}) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error("Client error caught by boundary:", error)
      setError(error.error)
      setHasError(true)
    }

    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("error", handleError)
    }
  }, [])

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Application Error</AlertTitle>
            <AlertDescription>
              <p className="mb-4">
                Something went wrong. Please try refreshing the page or contact support if the issue persists.
              </p>
              {error && (
                <pre className="bg-secondary p-2 rounded text-xs overflow-auto max-h-40">{error.toString()}</pre>
              )}
              <div className="mt-4 flex gap-2">
                <Button onClick={() => window.location.reload()}>Refresh Page</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.clear()
                    sessionStorage.clear()
                    window.location.href = "/"
                  }}
                >
                  Clear Cache & Restart
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
