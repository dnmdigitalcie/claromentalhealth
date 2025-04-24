"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SecurityEventType } from "@/lib/security-logger"
import { Loader2 } from "lucide-react"

export function SecurityAlertTester() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [selectedEventType, setSelectedEventType] = useState<SecurityEventType>(SecurityEventType.SUSPICIOUS_ACTIVITY)

  const handleTestAlert = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/test-security-alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventType: selectedEventType }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send test alert")
      }

      setResult({
        success: true,
        message: data.message || "Test alert sent successfully",
      })
    } catch (error) {
      console.error("Error testing security alert:", error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Security Alerts</CardTitle>
        <CardDescription>Send a test security alert to verify your webhook configuration</CardDescription>
      </CardHeader>
      <CardContent>
        {result && (
          <Alert variant={result.success ? "default" : "destructive"} className="mb-4">
            <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Alert Type</label>
            <Select
              value={selectedEventType}
              onValueChange={(value) => setSelectedEventType(value as SecurityEventType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an alert type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SecurityEventType.SUSPICIOUS_ACTIVITY}>Suspicious Activity</SelectItem>
                <SelectItem value={SecurityEventType.ACCOUNT_LOCKED}>Account Locked</SelectItem>
                <SelectItem value={SecurityEventType.LOGIN_FAILURE}>Login Failure</SelectItem>
                <SelectItem value={SecurityEventType.ADMIN_ACTION}>Admin Action</SelectItem>
                <SelectItem value={SecurityEventType.SENSITIVE_DATA_ACCESS}>Sensitive Data Access</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
            <p className="text-amber-800 text-sm">
              Make sure you have set the <code>SECURITY_WEBHOOK_URL</code> environment variable before testing. The
              alert will be sent to that webhook endpoint.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleTestAlert} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
            </>
          ) : (
            "Send Test Alert"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
