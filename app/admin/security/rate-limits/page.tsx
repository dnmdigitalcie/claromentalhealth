"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RateLimitMonitor } from "@/components/admin/rate-limit-monitor"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RateLimitsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Rate Limit Monitoring</h1>

          <div className="grid gap-6 md:grid-cols-2">
            <RateLimitMonitor />

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About Rate Limiting</CardTitle>
                  <CardDescription>Understanding how rate limiting protects your application</CardDescription>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p>Rate limiting is a critical security measure that helps protect your application from:</p>
                  <ul>
                    <li>
                      <strong>Brute force attacks</strong> - Prevents attackers from making many login attempts
                    </li>
                    <li>
                      <strong>Credential stuffing</strong> - Limits automated login attempts with stolen credentials
                    </li>
                    <li>
                      <strong>Denial of Service</strong> - Prevents overwhelming your servers with too many requests
                    </li>
                    <li>
                      <strong>API abuse</strong> - Ensures fair usage of your API resources
                    </li>
                  </ul>

                  <h3>Current Rate Limits</h3>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th>Endpoint</th>
                        <th>Limit</th>
                        <th>Window</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Login</td>
                        <td>5 requests</td>
                        <td>15 minutes</td>
                      </tr>
                      <tr>
                        <td>Registration</td>
                        <td>3 requests</td>
                        <td>1 hour</td>
                      </tr>
                      <tr>
                        <td>Password Reset</td>
                        <td>3 requests</td>
                        <td>1 hour</td>
                      </tr>
                      <tr>
                        <td>General API</td>
                        <td>100 requests</td>
                        <td>1 minute</td>
                      </tr>
                      <tr>
                        <td>Sensitive API</td>
                        <td>20 requests</td>
                        <td>1 minute</td>
                      </tr>
                    </tbody>
                  </table>

                  <h3>Monitoring and Alerts</h3>
                  <p>
                    When rate limits are exceeded, the system logs a security event and sends an alert through the
                    configured security webhook. This helps you identify potential attacks or misuse of your
                    application.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
