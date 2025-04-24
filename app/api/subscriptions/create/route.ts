import { NextResponse } from "next/server"
import { createSubscription } from "@/lib/subscription-service"
import { validateSession } from "@/lib/db/session-service"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    // Get the session token from cookies
    const cookieStore = cookies()
    const sessionToken = cookieStore.get("auth_session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate the session
    const userId = await validateSession(sessionToken)

    if (!userId) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
    }

    // Get the plan ID from the request body
    const { planId, paymentDetails } = await request.json()

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    // Create the subscription
    const result = await createSubscription(userId, planId, paymentDetails)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true, subscription: result.subscription })
  } catch (error) {
    console.error("Error creating subscription:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
