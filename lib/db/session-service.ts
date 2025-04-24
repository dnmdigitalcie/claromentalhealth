import { supabase } from "@/lib/supabase"
import { generateId } from "@/lib/utils"
import { cookies } from "next/headers"
import { encrypt } from "@/lib/encryption"

const SESSION_COOKIE_NAME = "auth_session"
const SESSION_DURATION_DAYS = 14 // 2 weeks

export async function createSession(userId: string, ipAddress?: string, userAgent?: string): Promise<string | null> {
  try {
    const sessionId = generateId(32)
    const sessionToken = generateId(64)
    const encryptedToken = encrypt(sessionToken)

    const now = new Date()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS)

    const { error } = await supabase.from("sessions").insert({
      id: sessionId,
      user_id: userId,
      token: encryptedToken,
      expires_at: expiresAt.toISOString(),
      ip_address: ipAddress || null,
      user_agent: userAgent || null,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    })

    if (error) {
      console.error("Error creating session:", error)
      return null
    }

    return sessionToken
  } catch (error) {
    console.error("Error in createSession:", error)
    return null
  }
}

export async function validateSession(sessionToken: string): Promise<string | null> {
  try {
    const encryptedToken = encrypt(sessionToken)
    const now = new Date()

    const { data: session, error } = await supabase
      .from("sessions")
      .select("user_id, expires_at")
      .eq("token", encryptedToken)
      .single()

    if (error || !session) {
      return null
    }

    const expiresAt = new Date(session.expires_at)
    if (expiresAt < now) {
      // Session expired, delete it
      await supabase.from("sessions").delete().eq("token", encryptedToken)
      return null
    }

    return session.user_id
  } catch (error) {
    console.error("Error in validateSession:", error)
    return null
  }
}

export async function deleteSession(sessionToken: string): Promise<boolean> {
  try {
    const encryptedToken = encrypt(sessionToken)

    const { error } = await supabase.from("sessions").delete().eq("token", encryptedToken)

    return !error
  } catch (error) {
    console.error("Error in deleteSession:", error)
    return false
  }
}

export async function deleteAllUserSessions(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("sessions").delete().eq("user_id", userId)

    return !error
  } catch (error) {
    console.error("Error in deleteAllUserSessions:", error)
    return false
  }
}

export function setSessionCookie(sessionToken: string): void {
  const cookieStore = cookies()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS)

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: sessionToken,
    expires: expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })
}

export function getSessionToken(): string | undefined {
  const cookieStore = cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value
}

export function clearSessionCookie(): void {
  const cookieStore = cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
