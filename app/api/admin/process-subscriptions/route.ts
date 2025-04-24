import { NextResponse } from "next/server"
import { processExpiredSubscriptions } from "@/lib/subscription-service"

export async function POST(request: Request) {
  try {
    // In a real application, you would verify that the request is coming from an authorized source
    // For example, check for an admin token or secure API key

    // Process expired subscriptions
    await processExpiredSubscriptions()

    return NextResponse.json({
      success: true,
      message: "Expired subscriptions processed successfully",
    })
  } catch (error) {
    console.error("Error processing expired subscriptions:", error)
    return NextResponse.json({ success: false, error: "Failed to process expired subscriptions" }, { status: 500 })
  }
}
