import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Create a new Supabase client for each server request
export const createServerSupabaseClient = () => {
  const cookieStore = cookies()

  const supabaseUrl = process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables for server client. Check your .env.local file.")
  }

  try {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        cookies: {
          get: (name) => cookieStore.get(name)?.value,
        },
      },
    })
  } catch (error) {
    console.error("Error creating server Supabase client:", error)
    throw new Error("Failed to initialize server Supabase client")
  }
}
