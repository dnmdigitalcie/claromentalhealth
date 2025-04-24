"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

export function ApiDiagnostics() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState<string>("")

  const checkSupabaseConnection = async () => {
    setStatus("loading")
    setMessage("Testing Supabase connection...")

    try {
      // Try to make a simple query to test the connection
      const { data, error } = await supabase.from("health_check").select("*").limit(1)

      if (error) {
        throw error
      }

      setStatus("success")
      setMessage("Successfully connected to Supabase!")
    } catch (error: any) {
      console.error("Supabase connection test failed:", error)
      setStatus("error")
      setMessage(`Connection failed: ${error.message || "Unknown error"}`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Connection Diagnostics</CardTitle>
        <CardDescription>Test your API connections to identify configuration issues</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "idle" ? (
          <p className="text-sm text-muted-foreground">Click the button below to test your Supabase connection</p>
        ) : status === "loading" ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Testing Connection</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : status === "success" ? (
          <Alert className="border-green-500 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Connection Successful</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Connection Failed</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkSupabaseConnection} disabled={status === "loading"}>
          {status === "loading" ? "Testing..." : "Test Supabase Connection"}
        </Button>
      </CardFooter>
    </Card>
  )
}
