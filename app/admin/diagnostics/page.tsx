import type { Metadata } from "next"
import { ApiDiagnostics } from "@/components/diagnostics/api-check"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "System Diagnostics",
  description: "Diagnose and troubleshoot system issues",
}

export default function DiagnosticsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">System Diagnostics</h1>

      <div className="grid gap-6">
        <ApiDiagnostics />

        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Check if required environment variables are configured</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className={process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL ? "text-green-500" : "text-red-500"}>
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓" : "✗"}
                </span>
                <span className="ml-2">NEXT_PUBLIC_SUPABASE_URL</span>
              </li>
              <li className="flex items-center">
                <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "text-green-500" : "text-red-500"}>
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓" : "✗"}
                </span>
                <span className="ml-2">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              </li>
              <li className="flex items-center">
                <span className={process.env.SUPABASE_SERVICE_ROLE_KEY ? "text-green-500" : "text-red-500"}>
                  {process.env.SUPABASE_SERVICE_ROLE_KEY ? "✓" : "✗"}
                </span>
                <span className="ml-2">SUPABASE_SERVICE_ROLE_KEY</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
