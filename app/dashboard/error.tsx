"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We encountered an error while loading your dashboard. Please try again or contact support if the problem
          persists.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="bg-calm-blue-600 hover:bg-calm-blue-700">
            Try again
          </Button>
          <Button
            variant="outline"
            className="border-calm-blue-200 text-calm-blue-700 hover:bg-calm-blue-50"
            onClick={() => (window.location.href = "/support")}
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  )
}
