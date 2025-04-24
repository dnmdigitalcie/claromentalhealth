export interface User {
  id: string
  email: string
  name: string | null
  passwordHash: string
  role: UserRole
  emailVerified: boolean
  verificationToken: string | null
  verificationTokenExpiry: Date | null
  resetToken: string | null
  resetTokenExpiry: Date | null
  lastLogin: Date | null
  createdAt: Date
  updatedAt: Date
  mfaEnabled: boolean
  mfaSecret: string | null
  backupCodes: string[] | null
}

export type UserRole = "admin" | "instructor" | "student"

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
  ipAddress: string | null
  userAgent: string | null
  lastActive: Date
  absoluteExpiry: Date
}

export interface LoginAttempt {
  id: string
  email: string
  ipAddress: string
  userAgent: string
  successful: boolean
  createdAt: Date
  failureReason?: string
}

export interface UserWithoutPassword {
  id: string
  email: string
  name: string | null
  role: UserRole
  emailVerified: boolean
  lastLogin: Date | null
  createdAt: Date
  updatedAt: Date
  mfaEnabled: boolean
}

export interface SecurityLog {
  id: string
  userId: string | null
  email: string | null
  eventType: SecurityEventType
  ipAddress: string | null
  userAgent: string | null
  details: Record<string, any> | null
  createdAt: Date
}

export type SecurityEventType =
  | "login_success"
  | "login_failure"
  | "logout"
  | "password_reset_request"
  | "password_reset_success"
  | "password_change"
  | "email_verification"
  | "mfa_enabled"
  | "mfa_disabled"
  | "mfa_verification_success"
  | "mfa_verification_failure"
  | "account_locked"
  | "account_unlocked"
  | "role_change"
  | "user_created"
  | "user_deleted"
  | "data_export"
  | "data_deletion_request"
  | "data_deleted"
  | "suspicious_activity"
  | "session_expired"
  | "session_revoked"

export interface MfaVerification {
  token: string
  verified: boolean
}

export interface DataExportRequest {
  id: string
  userId: string
  status: "pending" | "processing" | "completed" | "failed"
  requestedAt: Date
  completedAt: Date | null
  downloadUrl: string | null
  expiresAt: Date | null
}

export interface DataDeletionRequest {
  id: string
  userId: string
  status: "pending" | "processing" | "completed" | "cancelled"
  requestedAt: Date
  scheduledDeletionAt: Date
  completedAt: Date | null
  cancellationReason: string | null
}
