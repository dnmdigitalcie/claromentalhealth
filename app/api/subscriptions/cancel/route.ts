import { NextResponse } from "next/server"
import { cancelSubscription, getUserSubscription } from "@/lib/subscription-service"
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

    // Get the user's subscription
    const subscription = await getUserSubscription(userId)

    if (!subscription) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 })
    }

    // Get cancelImmediately from the request body
    const { cancelImmediately = false } = await request.json()

    // Cancel the subscription
    const result = await cancelSubscription(subscription.id, cancelImmediately)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error canceling subscription:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
