"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function VerifyEmailPage() {
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (tokenParam) {
      setToken(tokenParam)
      verifyEmail(tokenParam)
    } else {
      setError("Missing verification token. Please check your email for the correct link.")
    }
  }, [searchParams])

  const verifyEmail = async (verificationToken: string) => {
    setIsVerifying(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: verificationToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify email")
      }

      setSuccess(data.message || "Email verified successfully")
    } catch (error) {
      console.error("Email verification error:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
            <CardDescription className="text-center">Verifying your email address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isVerifying && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-calm-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Verifying your email...</p>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            {success && (
              <Button className="w-full bg-calm-blue-600 hover:bg-calm-blue-700" onClick={() => router.push("/login")}>
                Go to login
              </Button>
            )}

            {error && (
              <div className="text-center text-sm">
                <p>If you're having trouble, you can request a new verification email.</p>
                <Button
                  variant="link"
                  className="mt-2 text-calm-blue-600 hover:text-calm-blue-500"
                  onClick={() => {
                    // In a real app, you would have an API endpoint to resend the verification email
                    alert("This would resend the verification email in a real application.")
                  }}
                >
                  Resend verification email
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
