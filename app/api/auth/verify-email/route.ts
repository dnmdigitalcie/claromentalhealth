import { type NextRequest, NextResponse } from "next/server"
import { verifyEmailToken } from "@/lib/db/user-service"
import { z } from "zod"

const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = verifyEmailSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 })
    }

    const { token } = result.data

    // Verify email token
    const success = await verifyEmailToken(token)

    if (!success) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    return NextResponse.json({
      message: "Email verified successfully",
    })
  } catch (error) {
    console.error("Email verification error:", error)

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
