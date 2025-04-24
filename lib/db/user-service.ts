import { supabase } from "@/lib/supabase"
import type { UserWithoutPassword, UserRole } from "@/types/auth"
import { generateId } from "@/lib/utils"
import bcrypt from "bcryptjs"
import { logSecurityEvent } from "./security-service"
import { getClientInfo } from "@/lib/utils"

const MAX_PASSWORD_HISTORY = 5
const MAX_FAILED_ATTEMPTS = 5
const ACCOUNT_LOCKOUT_MINUTES = 30

export async function createUser(
  email: string,
  password: string,
  name: string | null,
  role: UserRole = "student",
): Promise<UserWithoutPassword | null> {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email.toLowerCase()).single()

    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Hash password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // Generate verification token
    const verificationToken = generateId(32)
    const verificationTokenExpiry = new Date()
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24) // 24 hour expiry

    const userId = generateId(24)
    const now = new Date()

    // Create user
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        id: userId,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name,
        role,
        email_verified: false,
        verification_token: verificationToken,
        verification_token_expiry: verificationTokenExpiry.toISOString(),
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        password_history: JSON.stringify([{ hash: passwordHash, created_at: now.toISOString() }]),
      })
      .select("id, email, name, role, email_verified, last_login, created_at, updated_at, mfa_enabled")
      .single()

    if (error) {
      console.error("Error creating user:", error)
      throw error
    }

    // Log the user creation event
    await logSecurityEvent("user_created", {
      userId: newUser.id,
      email: newUser.email,
    })

    // Transform to camelCase
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      emailVerified: newUser.email_verified,
      lastLogin: newUser.last_login ? new Date(newUser.last_login) : null,
      createdAt: new Date(newUser.created_at),
      updatedAt: new Date(newUser.updated_at),
      mfaEnabled: newUser.mfa_enabled || false,
    }
  } catch (error) {
    console.error("Error in createUser:", error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<UserWithoutPassword | null> {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, name, role, email_verified, last_login, created_at, updated_at, mfa_enabled")
      .eq("email", email.toLowerCase())
      .single()

    if (error || !user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.email_verified,
      lastLogin: user.last_login ? new Date(user.last_login) : null,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
      mfaEnabled: user.mfa_enabled || false,
    }
  } catch (error) {
    console.error("Error in getUserByEmail:", error)
    return null
  }
}

export async function getUserById(id: string): Promise<UserWithoutPassword | null> {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, name, role, email_verified, last_login, created_at, updated_at, mfa_enabled")
      .eq("id", id)
      .single()

    if (error || !user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.email_verified,
      lastLogin: user.last_login ? new Date(user.last_login) : null,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
      mfaEnabled: user.mfa_enabled || false,
    }
  } catch (error) {
    console.error("Error in getUserById:", error)
    return null
  }
}

export async function verifyUserPassword(
  email: string,
  password: string,
  request?: Request,
): Promise<UserWithoutPassword | null> {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select(
        "id, email, name, role, password_hash, email_verified, last_login, created_at, updated_at, mfa_enabled, account_locked, account_locked_until, failed_login_attempts",
      )
      .eq("email", email.toLowerCase())
      .single()

    if (error || !user) {
      return null
    }

    // Check if account is locked
    if (user.account_locked) {
      const lockedUntil = user.account_locked_until ? new Date(user.account_locked_until) : null
      const now = new Date()

      if (lockedUntil && lockedUntil > now) {
        // Account is still locked
        const clientInfo = request ? getClientInfo(request) : { ipAddress: null, userAgent: null }

        await logSecurityEvent("login_failure", {
          userId: user.id,
          email: user.email,
          ipAddress: clientInfo.ipAddress || undefined,
          userAgent: clientInfo.userAgent || undefined,
          additionalDetails: { reason: "account_locked" },
        })

        return null
      } else {
        // Lock period expired, unlock the account
        await supabase
          .from("users")
          .update({
            account_locked: false,
            account_locked_until: null,
            failed_login_attempts: 0,
            updated_at: now.toISOString(),
          })
          .eq("id", user.id)
      }
    }

    const passwordValid = await bcrypt.compare(password, user.password_hash)

    const clientInfo = request ? getClientInfo(request) : { ipAddress: null, userAgent: null }

    if (!passwordValid) {
      // Increment failed login attempts
      const failedAttempts = (user.failed_login_attempts || 0) + 1
      const updates: any = {
        failed_login_attempts: failedAttempts,
        updated_at: new Date().toISOString(),
      }

      // Lock account if max attempts reached
      if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockUntil = new Date()
        lockUntil.setMinutes(lockUntil.getMinutes() + ACCOUNT_LOCKOUT_MINUTES)

        updates.account_locked = true
        updates.account_locked_until = lockUntil.toISOString()

        await logSecurityEvent("account_locked", {
          userId: user.id,
          email: user.email,
          ipAddress: clientInfo.ipAddress || undefined,
          userAgent: clientInfo.userAgent || undefined,
          additionalDetails: { reason: "max_failed_attempts", lockUntil: lockUntil.toISOString() },
        })
      }

      await supabase.from("users").update(updates).eq("id", user.id)

      await logSecurityEvent("login_failure", {
        userId: user.id,
        email: user.email,
        ipAddress: clientInfo.ipAddress || undefined,
        userAgent: clientInfo.userAgent || undefined,
        additionalDetails: { reason: "invalid_password", attemptNumber: failedAttempts },
      })

      return null
    }

    // Update last login time and reset failed attempts
    const now = new Date()
    await supabase
      .from("users")
      .update({
        last_login: now.toISOString(),
        updated_at: now.toISOString(),
        failed_login_attempts: 0,
      })
      .eq("id", user.id)

    // Log successful login
    await logSecurityEvent("login_success", {
      userId: user.id,
      email: user.email,
      ipAddress: clientInfo.ipAddress || undefined,
      userAgent: clientInfo.userAgent || undefined,
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.email_verified,
      lastLogin: now,
      createdAt: new Date(user.created_at),
      updatedAt: now,
      mfaEnabled: user.mfa_enabled || false,
    }
  } catch (error) {
    console.error("Error in verifyUserPassword:", error)
    return null
  }
}

export async function updateUserPassword(userId: string, newPassword: string, oldPassword?: string): Promise<boolean> {
  try {
    // If oldPassword is provided, verify it first
    if (oldPassword) {
      const { data: user } = await supabase
        .from("users")
        .select("password_hash, password_history")
        .eq("id", userId)
        .single()

      if (!user) return false

      const isCurrentPasswordValid = await bcrypt.compare(oldPassword, user.password_hash)
      if (!isCurrentPasswordValid) {
        await logSecurityEvent("password_change", {
          userId,
          additionalDetails: { success: false, reason: "invalid_current_password" },
        })
        return false
      }

      // Check if new password is in password history
      const passwordHistory = user.password_history ? JSON.parse(user.password_history) : []

      for (const entry of passwordHistory) {
        const isPasswordReused = await bcrypt.compare(newPassword, entry.hash)
        if (isPasswordReused) {
          await logSecurityEvent("password_change", {
            userId,
            additionalDetails: { success: false, reason: "password_reuse" },
          })
          return false
        }
      }
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(newPassword, salt)
    const now = new Date()

    // Get current password history
    const { data: user } = await supabase.from("users").select("password_history").eq("id", userId).single()

    let passwordHistory = []
    if (user && user.password_history) {
      try {
        passwordHistory = JSON.parse(user.password_history)
      } catch (e) {
        passwordHistory = []
      }
    }

    // Add new password to history
    passwordHistory.unshift({ hash: passwordHash, created_at: now.toISOString() })

    // Keep only the most recent passwords
    if (passwordHistory.length > MAX_PASSWORD_HISTORY) {
      passwordHistory = passwordHistory.slice(0, MAX_PASSWORD_HISTORY)
    }

    const { error } = await supabase
      .from("users")
      .update({
        password_hash: passwordHash,
        updated_at: now.toISOString(),
        reset_token: null,
        reset_token_expiry: null,
        password_history: JSON.stringify(passwordHistory),
      })
      .eq("id", userId)

    if (error) {
      console.error("Error updating password:", error)
      return false
    }

    await logSecurityEvent("password_change", {
      userId,
      additionalDetails: { success: true },
    })

    return true
  } catch (error) {
    console.error("Error in updateUserPassword:", error)
    return false
  }
}

export async function createPasswordResetToken(email: string): Promise<string | null> {
  try {
    const { data: user, error } = await supabase.from("users").select("id").eq("email", email.toLowerCase()).single()

    if (error || !user) {
      return null
    }

    const resetToken = generateId(32)
    const resetTokenExpiry = new Date()
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1) // 1 hour expiry
    const now = new Date()

    const { error: updateError } = await supabase
      .from("users")
      .update({
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("Error updating reset token:", updateError)
      return null
    }

    await logSecurityEvent("password_reset_request", {
      userId: user.id,
      email: email.toLowerCase(),
      additionalDetails: { expiry: resetTokenExpiry.toISOString() },
    })

    return resetToken
  } catch (error) {
    console.error("Error in createPasswordResetToken:", error)
    return null
  }
}

export async function verifyResetToken(token: string): Promise<string | null> {
  try {
    const now = new Date()

    const { data: user, error } = await supabase
      .from("users")
      .select("id, reset_token_expiry, email")
      .eq("reset_token", token)
      .single()

    if (error || !user) {
      return null
    }

    const tokenExpiry = new Date(user.reset_token_expiry)
    if (tokenExpiry < now) {
      await logSecurityEvent("password_reset_failure", {
        userId: user.id,
        email: user.email,
        additionalDetails: { reason: "token_expired" },
      })
      return null // Token expired
    }

    return user.id
  } catch (error) {
    console.error("Error in verifyResetToken:", error)
    return null
  }
}

export async function verifyEmailToken(token: string): Promise<boolean> {
  try {
    const now = new Date()

    const { data: user, error } = await supabase
      .from("users")
      .select("id, verification_token_expiry, email")
      .eq("verification_token", token)
      .single()

    if (error || !user) {
      return false
    }

    const tokenExpiry = new Date(user.verification_token_expiry)
    if (tokenExpiry < now) {
      await logSecurityEvent("email_verification", {
        userId: user.id,
        email: user.email,
        additionalDetails: { success: false, reason: "token_expired" },
      })
      return false // Token expired
    }

    // Mark email as verified
    const { error: updateError } = await supabase
      .from("users")
      .update({
        email_verified: true,
        verification_token: null,
        verification_token_expiry: null,
        updated_at: now.toISOString(),
      })
      .eq("id", user.id)

    if (!updateError) {
      await logSecurityEvent("email_verification", {
        userId: user.id,
        email: user.email,
        additionalDetails: { success: true },
      })
    }

    return !updateError
  } catch (error) {
    console.error("Error in verifyEmailToken:", error)
    return false
  }
}

export async function updateUserRole(userId: string, role: UserRole, adminUserId: string): Promise<boolean> {
  try {
    const now = new Date()

    const { error } = await supabase
      .from("users")
      .update({
        role,
        updated_at: now.toISOString(),
      })
      .eq("id", userId)

    if (!error) {
      await logSecurityEvent("role_change", {
        userId,
        additionalDetails: {
          newRole: role,
          changedBy: adminUserId,
        },
      })
    }

    return !error
  } catch (error) {
    console.error("Error in updateUserRole:", error)
    return false
  }
}

export async function logLoginAttempt(
  email: string,
  ipAddress: string,
  userAgent: string,
  successful: boolean,
  failureReason?: string,
): Promise<void> {
  try {
    const now = new Date()

    await supabase.from("login_attempts").insert({
      id: generateId(24),
      email: email.toLowerCase(),
      ip_address: ipAddress,
      user_agent: userAgent,
      successful,
      failure_reason: failureReason,
      created_at: now.toISOString(),
    })
  } catch (error) {
    console.error("Error logging login attempt:", error)
  }
}

export async function checkLoginAttempts(email: string, ipAddress: string): Promise<boolean> {
  try {
    const timeWindow = new Date()
    timeWindow.setMinutes(timeWindow.getMinutes() - 15) // 15 minute window

    const { data, error } = await supabase
      .from("login_attempts")
      .select("id")
      .eq("email", email.toLowerCase())
      .eq("ip_address", ipAddress)
      .eq("successful", false)
      .gte("created_at", timeWindow.toISOString())

    if (error) {
      console.error("Error checking login attempts:", error)
      return false // Allow login on error
    }

    // If there are 5 or more failed attempts in the last 15 minutes, block the login
    return data.length < 5
  } catch (error) {
    console.error("Error in checkLoginAttempts:", error)
    return false
  }
}

export async function unlockAccount(userId: string, adminUserId: string): Promise<boolean> {
  try {
    const now = new Date()

    const { error } = await supabase
      .from("users")
      .update({
        account_locked: false,
        account_locked_until: null,
        failed_login_attempts: 0,
        updated_at: now.toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("Error unlocking account:", error)
      return false
    }

    await logSecurityEvent("account_unlocked", {
      userId,
      additionalDetails: { unlockedBy: adminUserId },
    })

    return true
  } catch (error) {
    console.error("Error in unlockAccount:", error)
    return false
  }
}

export async function deleteUser(userId: string, adminUserId?: string): Promise<boolean> {
  try {
    // Get user email for logging
    const { data: user } = await supabase.from("users").select("email").eq("id", userId).single()

    if (!user) return false

    // Delete user
    const { error } = await supabase.from("users").delete().eq("id", userId)

    if (error) {
      console.error("Error deleting user:", error)
      return false
    }

    await logSecurityEvent("user_deleted", {
      email: user.email,
      additionalDetails: {
        deletedBy: adminUserId || userId,
        selfDeleted: !adminUserId || adminUserId === userId,
      },
    })

    return true
  } catch (error) {
    console.error("Error in deleteUser:", error)
    return false
  }
}
