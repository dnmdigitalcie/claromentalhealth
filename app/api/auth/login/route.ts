import { type NextRequest, NextResponse } from "next/server"
import { verifyUserPassword, logLoginAttempt, checkLoginAttempts } from "@/lib/db/user-service"
import { createSession, setSessionCookie } from "@/lib/db/session-service"
import { getClientInfo } from "@/lib/utils"
import { detectSuspiciousActivity } from "@/lib/db/security-service"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  mfaToken: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 })
    }

    const { email, password, mfaToken } = result.data
    const { ipAddress, userAgent } = getClientInfo(request)

    // Check for too many failed login attempts
    const canLogin = await checkLoginAttempts(email, ipAddress)
    if (!canLogin) {
      await logLoginAttempt(email, ipAddress, userAgent, false, "too_many_attempts")

      return NextResponse.json({ error: "Too many failed login attempts. Please try again later." }, { status: 429 })
    }

    // Verify credentials
    const user = await verifyUserPassword(email, password, request)

    if (!user) {
      await logLoginAttempt(email, ipAddress, userAgent, false, "invalid_credentials")

      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check if email is verified
    if (!user.emailVerified) {
      await logLoginAttempt(email, ipAddress, userAgent, false, "email_not_verified")

      return NextResponse.json({ error: "Please verify your email before logging in" }, { status: 403 })
    }

    // Check if MFA is enabled for the user
    if (user.mfaEnabled) {
      // If MFA is enabled but no token provided, return a challenge
      if (!mfaToken) {
        return NextResponse.json(
          {
            requiresMfa: true,
            message: "MFA verification required",
            userId: user.id,
          },
          { status: 200 },
        )
      }

      // Verify MFA token
      const { verifyMfaToken } = await import("@/lib/mfa")
      const isMfaValid = await verifyMfaToken(user.id, mfaToken)

      if (!isMfaValid) {
        await logLoginAttempt(email, ipAddress, userAgent, false, "invalid_mfa")

        return NextResponse.json(
          {
            requiresMfa: true,
            error: "Invalid MFA token",
            userId: user.id,
          },
          { status: 401 },
        )
      }
    }

    // Check for suspicious activity
    const isSuspicious = await detectSuspiciousActivity(user.id, ipAddress, userAgent)

    // Log successful login
    await logLoginAttempt(email, ipAddress, userAgent, true)

    // Create session
    const sessionToken = await createSession(user.id, ipAddress, userAgent)

    if (!sessionToken) {
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    // Set session cookie
    setSessionCookie(sessionToken)

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      suspiciousActivity: isSuspicious,
    })
  } catch (error) {
    console.error("Login error:", error)

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
