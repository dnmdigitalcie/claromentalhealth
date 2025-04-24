import { authenticator } from "otplib"
import { generateId } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { logSecurityEvent } from "@/lib/db/security-service"
import { encrypt, decrypt } from "@/lib/encryption"

// Configure OTP library
authenticator.options = {
  window: 1, // Allow 1 step before and after current step (30 seconds window)
}

export async function generateMfaSecret(userId: string) {
  try {
    // Generate a secret
    const secret = authenticator.generateSecret()

    // Encrypt the secret before storing
    const encryptedSecret = encrypt(secret)

    // Generate backup codes
    const backupCodes = Array(10)
      .fill(0)
      .map(() => generateId(10))

    // Hash backup codes before storing
    const hashedBackupCodes = backupCodes.map((code) => encrypt(code))

    // Update user with MFA secret and backup codes
    const { error } = await supabase
      .from("users")
      .update({
        mfa_secret: encryptedSecret,
        backup_codes: hashedBackupCodes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("Error storing MFA secret:", error)
      return { success: false, error: "Failed to store MFA secret" }
    }

    return {
      success: true,
      secret,
      backupCodes,
    }
  } catch (error) {
    console.error("Error in generateMfaSecret:", error)
    return { success: false, error: "Failed to generate MFA secret" }
  }
}

export async function verifyMfaToken(userId: string, token: string) {
  try {
    // Get user's MFA secret
    const { data: user, error } = await supabase
      .from("users")
      .select("mfa_secret, backup_codes")
      .eq("id", userId)
      .single()

    if (error || !user || !user.mfa_secret) {
      return false
    }

    // Decrypt the secret
    const secret = decrypt(user.mfa_secret)

    // Verify the token
    const isValid = authenticator.verify({ token, secret })

    if (isValid) {
      // Log successful verification
      await logSecurityEvent("mfa_verification_success", { userId })
      return true
    }

    // Check if token matches a backup code
    if (user.backup_codes && Array.isArray(user.backup_codes)) {
      for (let i = 0; i < user.backup_codes.length; i++) {
        const encryptedCode = user.backup_codes[i]
        if (!encryptedCode) continue

        const backupCode = decrypt(encryptedCode)
        if (token === backupCode) {
          // Remove used backup code
          const updatedBackupCodes = [...user.backup_codes]
          updatedBackupCodes[i] = null

          await supabase
            .from("users")
            .update({
              backup_codes: updatedBackupCodes,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId)

          // Log successful verification with backup code
          await logSecurityEvent("mfa_verification_success", {
            userId,
            additionalDetails: { method: "backup_code" },
          })

          return true
        }
      }
    }

    // Log failed verification
    await logSecurityEvent("mfa_verification_failure", { userId })
    return false
  } catch (error) {
    console.error("Error in verifyMfaToken:", error)
    return false
  }
}

export async function enableMfa(userId: string) {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        mfa_enabled: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("Error enabling MFA:", error)
      return false
    }

    await logSecurityEvent("mfa_enabled", { userId })
    return true
  } catch (error) {
    console.error("Error in enableMfa:", error)
    return false
  }
}

export async function disableMfa(userId: string) {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        mfa_enabled: false,
        mfa_secret: null,
        backup_codes: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("Error disabling MFA:", error)
      return false
    }

    await logSecurityEvent("mfa_disabled", { userId })
    return true
  } catch (error) {
    console.error("Error in disableMfa:", error)
    return false
  }
}

export function generateQrCodeUri(email: string, secret: string) {
  const appName = "Claro Mental Health"
  return authenticator.keyuri(email, appName, secret)
}
