import { type NextRequest, NextResponse } from "next/server"
import { validateSession } from "@/lib/db/session-service"

export async function GET(request: NextRequest) {
  // Get the session token from cookies
  const sessionToken = request.cookies.get("auth_session")?.value

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Validate the session
  const userId = await validateSession(sessionToken)

  if (!userId) {
    return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
  }

  // Access is granted, return protected data
  return NextResponse.json({
    message: "This is protected data",
    user: userId,
    // Include any other data you want to return
  })
}
