import { NextResponse } from "next/server"
import { runScheduledTasks } from "@/lib/scheduled-tasks"
import { logSecurityEvent, SecurityEventType } from "@/lib/security-logger"

export async function POST(request: Request) {
  try {
    // In a real application, you would verify that the request is coming from an authorized source
    // For example, check for an admin token or API key

    // Run the scheduled tasks
    await runScheduledTasks()

    // Log the action
    await logSecurityEvent(SecurityEventType.ADMIN_ACTION, "system", "system@example.com", {
      action: "run_scheduled_tasks",
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: "Scheduled tasks executed successfully",
    })
  } catch (error) {
    console.error("Error running scheduled tasks:", error)
    return NextResponse.json({ success: false, error: "Failed to run scheduled tasks" }, { status: 500 })
  }
}
