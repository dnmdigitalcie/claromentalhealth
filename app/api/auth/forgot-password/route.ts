import { type NextRequest, NextResponse } from "next/server"
import { createPasswordResetToken, getUserByEmail } from "@/lib/db/user-service"
import { z } from "zod"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = forgotPasswordSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 })
    }

    const { email } = result.data

    // Check if user exists
    const user = await getUserByEmail(email)

    // We don't want to reveal if the email exists or not for security reasons
    // So we always return a success message
    if (!user) {
      return NextResponse.json({
        message: "If your email is registered, you will receive a password reset link",
      })
    }

    // Create reset token
    const resetToken = await createPasswordResetToken(email)

    if (!resetToken) {
      return NextResponse.json({ error: "Failed to create reset token" }, { status: 500 })
    }

    // In a real application, you would send an email with the reset link
    // For this example, we'll just return the token in the response
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

    // For development purposes only
    console.log("Reset link:", resetLink)

    return NextResponse.json({
      message: "If your email is registered, you will receive a password reset link",
    })
  } catch (error) {
    console.error("Forgot password error:", error)

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
