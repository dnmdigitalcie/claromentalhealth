import { type NextRequest, NextResponse } from "next/server"
import { verifyResetToken, updateUserPassword } from "@/lib/db/user-service"
import { isStrongPassword } from "@/lib/utils"
import { z } from "zod"

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = resetPasswordSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 })
    }

    const { token, password } = result.data

    // Validate password strength
    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          error:
            "Password is not strong enough. It must contain at least 8 characters, including uppercase, lowercase, number, and special character.",
        },
        { status: 400 },
      )
    }

    // Verify reset token
    const userId = await verifyResetToken(token)

    if (!userId) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Update password
    const success = await updateUserPassword(userId, password)

    if (!success) {
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Password updated successfully",
    })
  } catch (error) {
    console.error("Reset password error:", error)

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
