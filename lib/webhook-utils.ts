import crypto from "crypto"

/**
 * Generate a secure webhook signature
 *
 * @param payload The raw request body
 * @param secret The webhook secret
 * @returns string The generated signature
 */
export function generateWebhookSignature(payload: string, secret: string): string {
  try {
    // Create HMAC using the secret
    const hmac = crypto.createHmac("sha256", secret)

    // Update with the payload
    hmac.update(payload)

    // Get the computed signature
    return hmac.digest("hex")
  } catch (error) {
    console.error("Error generating webhook signature:", error)
    return ""
  }
}

/**
 * Generate a secure webhook secret
 *
 * @returns string A random webhook secret
 */
export function generateWebhookSecret(): string {
  return crypto.randomBytes(32).toString("hex")
}
