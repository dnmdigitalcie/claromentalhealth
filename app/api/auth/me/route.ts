import { type NextRequest, NextResponse } from "next/server"
import { getSessionToken, validateSession } from "@/lib/db/session-service"
import { getUserById } from "@/lib/db/user-service"

export async function GET(request: NextRequest) {
  try {
    const sessionToken = getSessionToken()

    if (!sessionToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = await validateSession(sessionToken)

    if (!userId) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
    }

    const user = await getUserById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
