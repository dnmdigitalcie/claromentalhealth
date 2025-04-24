import { type NextRequest, NextResponse } from "next/server"
import { getSessionToken, deleteSession, clearSessionCookie } from "@/lib/db/session-service"

export async function POST(request: NextRequest) {
  try {
    const sessionToken = getSessionToken()

    if (sessionToken) {
      await deleteSession(sessionToken)
    }

    clearSessionCookie()

    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
