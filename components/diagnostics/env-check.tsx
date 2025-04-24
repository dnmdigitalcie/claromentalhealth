"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

export default function EnvCheck() {
  const [checks, setChecks] = useState({
    supabaseUrl: false,
    supabaseAnonKey: false,
  })

  useEffect(() => {
    // Check if environment variables are defined
    setChecks({
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  }, [])

  const allChecksPass = Object.values(checks).every(Boolean)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Variables Check</CardTitle>
        <CardDescription>Checking if required environment variables are properly configured</CardDescription>
      </CardHeader>
      <CardContent>
        {!allChecksPass && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Missing Environment Variables</AlertTitle>
            <AlertDescription>
              Some required environment variables are missing. Please check your configuration.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>NEXT_PUBLIC_SUPABASE_URL</span>
            {checks.supabaseUrl ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
            {checks.supabaseAnonKey ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
