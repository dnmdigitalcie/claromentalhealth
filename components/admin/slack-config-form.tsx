"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react"
import { SecurityEventType } from "@/lib/security-logger"

export function SlackConfigForm() {
  const [webhookUrl, setWebhookUrl] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  // Load the current webhook URL from environment variables
  useEffect(() => {
    // In a real app, you would fetch this from an API
    // For demo purposes, we'll just check if it's set in localStorage
    const savedUrl = localStorage.getItem("SECURITY_WEBHOOK_URL")
    if (savedUrl) {
      setWebhookUrl(savedUrl)
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveResult(null)

    try {
      // In a real app, you would send this to an API to update the environment variable
      // For demo purposes, we'll just save it to localStorage
      localStorage.setItem("SECURITY_WEBHOOK_URL", webhookUrl)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSaveResult({
        success: true,
        message: "Webhook URL saved successfully. Note: In this demo, it's only saved to localStorage.",
      })
    } catch (error) {
      console.error("Error saving webhook URL:", error)
      setSaveResult({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleTest = async () => {
    setIsTesting(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/admin/test-security-alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventType: SecurityEventType.SUSPICIOUS_ACTIVITY }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send test alert")
      }

      setTestResult({
        success: true,
        message: "Test alert sent successfully. Check your Slack channel for the message.",
      })
    } catch (error) {
      console.error("Error testing Slack integration:", error)
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsTesting(false)
    }
  }

  const isValidSlackUrl = webhookUrl.startsWith("https://hooks.slack.com/services/")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Slack Webhook Configuration</CardTitle>
        <CardDescription>Configure the Slack webhook URL where security alerts will be sent</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {saveResult && (
          <Alert variant={saveResult.success ? "default" : "destructive"}>
            {saveResult.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <AlertTitle>{saveResult.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{saveResult.message}</AlertDescription>
          </Alert>
        )}

        {testResult && (
          <Alert variant={testResult.success ? "default" : "destructive"}>
            {testResult.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <AlertTitle>{testResult.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{testResult.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Slack Webhook URL</label>
          <Input
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
          />
          {webhookUrl && !isValidSlackUrl && (
            <p className="text-sm text-red-500">URL must start with https://hooks.slack.com/services/</p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
          <p className="text-blue-800 text-sm">
            In a production environment, this would update the <code>SECURITY_WEBHOOK_URL</code> environment variable.
            For this demo, it will only be saved to localStorage.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSave}
          disabled={isSaving || !webhookUrl || !isValidSlackUrl}
          className="w-full sm:w-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save Webhook URL"
          )}
        </Button>

        <Button
          onClick={handleTest}
          disabled={isTesting || !webhookUrl || !isValidSlackUrl}
          variant="outline"
          className="w-full sm:w-auto"
        >
          {isTesting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Testing...
            </>
          ) : (
            "Test Integration"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
