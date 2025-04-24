import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/db/user-service"
import { sanitizeInput, isValidEmail, isStrongPassword } from "@/lib/utils"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 })
    }

    const { email, password, name } = result.data

    // Additional validation
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          error:
            "Password is not strong enough. It must contain at least 8 characters, including uppercase, lowercase, number, and special character.",
        },
        { status: 400 },
      )
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name)

    // Create user
    const user = await createUser(email, password, sanitizedName)

    if (!user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // In a real application, you would send a verification email here

    return NextResponse.json(
      { message: "User registered successfully. Please check your email to verify your account." },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Registration error:", error)

    if (error.message === "User with this email already exists") {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
