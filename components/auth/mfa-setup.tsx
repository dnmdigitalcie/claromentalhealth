"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import QRCode from "qrcode.react"
import { useAuth } from "@/contexts/auth-context"

interface MfaSetupProps {
  onComplete?: () => void
}

export function MfaSetup({ onComplete }: MfaSetupProps) {
  const [step, setStep] = useState<"intro" | "setup" | "verify" | "backupCodes" | "complete">("intro")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [verificationCode, setVerificationCode] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])

  const { user, refreshUser } = useAuth()

  const startSetup = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/mfa/setup", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to start MFA setup")
      }

      setSecret(data.secret)
      setQrCodeUrl(data.qrCodeUrl)
      setStep("setup")
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
      console.error("MFA setup error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const verifySetup = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/mfa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: verificationCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify MFA setup")
      }

      setBackupCodes(data.backupCodes)
      setStep("backupCodes")

      // Refresh user data to update MFA status
      await refreshUser()
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
      console.error("MFA verification error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const completeSetup = () => {
    setStep("complete")
    if (onComplete) {
      onComplete()
    }
  }

  if (step === "intro") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Set Up Two-Factor Authentication</CardTitle>
          <CardDescription>Enhance your account security by enabling two-factor authentication</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-600">
            Two-factor authentication adds an extra layer of security to your account. In addition to your password,
            you'll need to enter a verification code from your authenticator app when signing in.
          </p>

          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <h4 className="font-medium text-blue-700 mb-2">You'll need:</h4>
            <ul className="list-disc pl-5 text-sm text-blue-600 space-y-1">
              <li>An authenticator app like Google Authenticator, Authy, or Microsoft Authenticator</li>
              <li>A few minutes to complete the setup process</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={startSetup} disabled={isLoading} className="w-full">
            {isLoading ? "Starting Setup..." : "Begin Setup"}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (step === "setup") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Scan QR Code</CardTitle>
          <CardDescription>Scan this QR code with your authenticator app</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col items-center mb-6">
            {qrCodeUrl && (
              <div className="bg-white p-4 rounded-md mb-4">
                <QRCode value={qrCodeUrl} size={200} />
              </div>
            )}

            <p className="text-sm text-gray-500 mb-2">Can't scan the QR code?</p>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded break-all">{secret}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verification-code">Enter the 6-digit code from your app</Label>
            <Input
              id="verification-code"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setStep("intro")} disabled={isLoading}>
            Back
          </Button>
          <Button onClick={verifySetup} disabled={isLoading || verificationCode.length !== 6}>
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (step === "backupCodes") {
    return null
  }

  // ## 8. Let's implement security logging and monitoring
}
