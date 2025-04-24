import { cookies } from "next/headers"
import { cache } from "react"
import { createClient } from "@/lib/supabase/server"

const getSession = async () => {
  const supabase = createClient(cookies())
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export const getServerSession = cache(getSession)
