// Environment variable validation utility
// This helps identify missing or incorrect environment variables early

export function checkRequiredEnvVars() {
  const requiredVars = [
    "SUPABASE_NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ]

  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.error(`
⚠️ Missing required environment variables:
${missingVars.map((v) => `- ${v}`).join("\n")}

Please check your .env.local file and ensure all required variables are set.
    `)

    // In development, we'll just warn; in production this would be more serious
    if (process.env.NODE_ENV === "production") {
      throw new Error("Missing required environment variables in production")
    }
  }

  // Check for common environment variable issues
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (supabaseUrl && !supabaseUrl.startsWith("https://")) {
    console.warn(`
⚠️ NEXT_PUBLIC_SUPABASE_URL should start with https://
Current value: ${supabaseUrl}
    `)
  }

  // Check for placeholder values
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (anonKey && (anonKey.includes("example") || anonKey.length < 20)) {
    console.warn(`
⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid or a placeholder
    `)
  }
}
