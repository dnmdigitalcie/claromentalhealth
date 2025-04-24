import { NextResponse } from "next/server"
import { logSecurityEvent, SecurityEventType } from "@/lib/security-logger"

export async function POST(request: Request) {
  try {
    // Check if the user has admin permissions
    // In a real app, you would verify the user's role here

    // Get the alert type from the request
    const { eventType = SecurityEventType.SUSPICIOUS_ACTIVITY } = await request.json()

    // Log a test security event
    await logSecurityEvent(eventType as SecurityEventType, "test-user-id", "test@example.com", {
      message: "This is a test security alert",
      timestamp: new Date().toISOString(),
      test: true,
    })

    return NextResponse.json({
      success: true,
      message: "Test security alert sent successfully",
    })
  } catch (error) {
    console.error("Error sending test security alert:", error)
    return NextResponse.json({ success: false, error: "Failed to send test security alert" }, { status: 500 })
  }
}
