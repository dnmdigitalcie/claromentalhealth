import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SecurityAlertTester } from "@/components/admin/security-alert-tester"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bell, Lock, Activity } from "lucide-react"

export default function SecurityAdminPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Security Administration</h1>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Link href="/admin/security/slack" className="block">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <Bell className="h-8 w-8 text-calm-blue-600 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Slack Integration</h2>
                <p className="text-calm-blue-600">Configure Slack webhooks for security alerts</p>
              </div>
            </Link>

            <Link href="/admin/security/rate-limits" className="block">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <Activity className="h-8 w-8 text-calm-blue-600 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Rate Limits</h2>
                <p className="text-calm-blue-600">Monitor rate limits and potential abuse</p>
              </div>
            </Link>

            <Link href="/admin/security/logs" className="block">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <Lock className="h-8 w-8 text-calm-blue-600 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Security Logs</h2>
                <p className="text-calm-blue-600">View and analyze security events</p>
              </div>
            </Link>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Security Integrations</h2>
            <Link href="/admin/security/slack">
              <Button variant="outline">Configure Slack Integration</Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <SecurityAlertTester />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Setting Up Your Security Webhook</h2>

              <div className="prose max-w-none">
                <p>
                  The <code>SECURITY_WEBHOOK_URL</code> environment variable should be set to a valid webhook URL where
                  security alerts will be sent.
                </p>

                <h3>For Slack:</h3>
                <ol>
                  <li>Go to your Slack workspace</li>
                  <li>
                    Create a new Slack app at{" "}
                    <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer">
                      api.slack.com/apps
                    </a>
                  </li>
                  <li>Enable "Incoming Webhooks" feature</li>
                  <li>Create a new webhook URL for a specific channel</li>
                  <li>
                    Copy the webhook URL and set it as your <code>SECURITY_WEBHOOK_URL</code>
                  </li>
                </ol>

                <p>
                  For detailed instructions, visit the <Link href="/admin/security/slack">Slack Configuration</Link>{" "}
                  page.
                </p>

                <h3>For other services:</h3>
                <p>
                  The security alerts are formatted as JSON payloads with information about the security event. You can
                  integrate with any service that accepts JSON webhooks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
