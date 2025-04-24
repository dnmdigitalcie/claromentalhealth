import { nanoid } from "nanoid"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(length = 16): string {
  return nanoid(length)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isStrongPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

export function sanitizeInput(input: string): string {
  // Basic sanitization to prevent XSS
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

export function getClientInfo(request: Request): { ipAddress: string; userAgent: string } {
  const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

  const userAgent = request.headers.get("user-agent") || "unknown"

  return {
    ipAddress: typeof ipAddress === "string" ? ipAddress.split(",")[0].trim() : "unknown",
    userAgent,
  }
}

export function generateCSRFToken(): string {
  return nanoid(32)
}

export function validateCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken
}
