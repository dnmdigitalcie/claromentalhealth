import { createClient } from "@supabase/supabase-js"

// Use environment variables or fallback to the provided values if needed
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ckdfylvgnmwypfxqezlf.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrZGZ5bHZnbm13eXBmeHFlemxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MDkzMDEsImV4cCI6MjA2MDI4NTMwMX0.JF8KvQEyX46JAMk4XLBCP3VbeaM3GrCQ4NJ0OxyH6Dw"

// Create a singleton instance of the Supabase client
let supabaseClient: ReturnType<typeof createClient> | undefined

export const getSupabaseClient = () => {
  if (supabaseClient) return supabaseClient

  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
    return supabaseClient
  } catch (error) {
    console.error("Error initializing Supabase client:", error)
    throw new Error("Failed to initialize Supabase client")
  }
}

// Export a default client for convenience
export const supabase = getSupabaseClient()
