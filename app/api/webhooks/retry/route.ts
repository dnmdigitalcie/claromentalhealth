import { type NextRequest, NextResponse } from "next/server"
import { retryWebhookEvent } from "@/lib/webhook-service"

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing webhook event ID" }, { status: 400 })
    }

    const success = await retryWebhookEvent(id)

    if (!success) {
      return NextResponse.json({ error: "Failed to retry webhook event" }, { status: 500 })
    }

    // Redirect back to the webhook event page
    return NextResponse.redirect(new URL(`/admin/webhooks/events/${id}`, request.url))
  } catch (error) {
    console.error("Error retrying webhook event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
