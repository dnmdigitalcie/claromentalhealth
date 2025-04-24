import crypto from "crypto"

// Environment variables for encryption keys
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-encryption-key-32-characters"
const ENCRYPTION_IV = process.env.ENCRYPTION_IV || "default-iv-16chr"

// Ensure key and IV are the correct length
const key = Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32))
const iv = Buffer.from(ENCRYPTION_IV.padEnd(16).slice(0, 16))

export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  return encrypted
}

export function decrypt(encryptedText: string): string {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv)
  let decrypted = decipher.update(encryptedText, "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}

export function hashData(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex")
}

export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString("hex")
}
