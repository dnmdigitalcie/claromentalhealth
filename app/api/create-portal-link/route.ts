import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createOrRetrieveCustomer } from "@/utils/supabase-admin"
import { createBillingPortalSession } from "@/utils/stripe"
import { getURL } from "@/utils/helpers"
import { validateSession } from "@/lib/db/session-service"

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new NextResponse("Method Not Allowed", { status: 405 })
  }

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

    // Get user email
    const { data: userData } = await fetch("/api/auth/me").then((res) => res.json())
    const email = userData?.email || "user@example.com"

    const customer = await createOrRetrieveCustomer({
      uuid: userId,
      email,
    })

    const { url } = await createBillingPortalSession(customer, getURL())

    return NextResponse.json({ url })
  } catch (error: any) {
    console.log(error)
    return new NextResponse(`Error: ${error.message}`, { status: 500 })
  }
}
