import { supabase } from "@/lib/supabase"
import { logSecurityEvent } from "@/lib/security-logger"
import { createReadStream, createWriteStream } from "fs"
import { pipeline } from "stream/promises"
import { createGzip } from "zlib"
import path from "path"
import fs from "fs/promises"

export interface DataExportOptions {
  includeAuthData?: boolean
  includeCourseData?: boolean
  includeWellnessData?: boolean
  format?: "json" | "csv"
}

export interface DataDeletionOptions {
  deleteAuthData?: boolean
  deleteCourseData?: boolean
  deleteWellnessData?: boolean
  anonymizeOnly?: boolean
}

export async function exportUserData(userId: string, options: DataExportOptions = {}): Promise<string> {
  try {
    const data: Record<string, any> = {}

    // Log the data export request
    await logSecurityEvent("GDPR_DATA_REQUEST", userId, undefined, { options })

    // Get user profile data
    if (options.includeAuthData !== false) {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, email, name, role, email_verified, created_at, updated_at")
        .eq("id", userId)
        .single()

      if (userError) {
        throw new Error(`Error fetching user data: ${userError.message}`)
      }

      data.profile = userData

      // Get login history
      const { data: loginData, error: loginError } = await supabase
        .from("security_logs")
        .select("event_type, ip_address, user_agent, created_at")
        .eq("user_id", userId)
        .in("event_type", ["LOGIN_SUCCESS", "LOGIN_FAILURE"])
        .order("created_at", { ascending: false })

      if (!loginError) {
        data.loginHistory = loginData
      }
    }

    // Get course enrollment and progress data
    if (options.includeCourseData !== false) {
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from("enrollments")
        .select("course_id, enrolled_at")
        .eq("user_id", userId)

      if (!enrollmentError) {
        data.enrollments = enrollmentData

        // Get course details for enrolled courses
        if (enrollmentData && enrollmentData.length > 0) {
          const courseIds = enrollmentData.map((e) => e.course_id)

          const { data: coursesData, error: coursesError } = await supabase
            .from("courses")
            .select("id, name, description")
            .in("id", courseIds)

          if (!coursesError) {
            data.courses = coursesData
          }
        }
      }

      // Get progress data
      const { data: progressData, error: progressError } = await supabase
        .from("progress")
        .select("module_id, lesson_id, assessment_id, is_completed, score, updated_at")
        .eq("user_id", userId)

      if (!progressError) {
        data.progress = progressData
      }
    }

    // Get wellness tracker data
    if (options.includeWellnessData !== false) {
      const { data: wellnessData, error: wellnessError } = await supabase
        .from("wellness_moods")
        .select("mood, mood_value, notes, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (!wellnessError) {
        data.wellness = wellnessData
      }
    }

    // Generate a unique filename for the export
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `user_data_export_${userId}_${timestamp}`
    const exportDir = path.join(process.cwd(), "tmp", "exports")

    // Ensure the export directory exists
    await fs.mkdir(exportDir, { recursive: true })

    // Write the data to a file
    const filePath = path.join(exportDir, `${filename}.json`)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))

    // Compress the file
    const gzipPath = `${filePath}.gz`
    const source = createReadStream(filePath)
    const destination = createWriteStream(gzipPath)
    const gzip = createGzip()

    await pipeline(source, gzip, destination)

    // Delete the uncompressed file
    await fs.unlink(filePath)

    return gzipPath
  } catch (error) {
    console.error("Error exporting user data:", error)
    throw new Error(`Failed to export user data: ${error.message}`)
  }
}

export async function deleteUserData(userId: string, options: DataDeletionOptions = {}): Promise<boolean> {
  try {
    // Log the data deletion request
    await logSecurityEvent("GDPR_DATA_DELETE", userId, undefined, { options })

    // Start a transaction for data deletion
    const { error: transactionError } = await supabase.rpc("begin_transaction")

    if (transactionError) {
      throw new Error(`Failed to start transaction: ${transactionError.message}`)
    }

    try {
      // Delete or anonymize user data based on options
      if (options.deleteAuthData !== false) {
        if (options.anonymizeOnly) {
          // Anonymize user data
          const { error: updateError } = await supabase
            .from("users")
            .update({
              email: `anonymized_${userId}@deleted.user`,
              name: "Anonymized User",
              password_hash: null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId)

          if (updateError) {
            throw new Error(`Failed to anonymize user data: ${updateError.message}`)
          }

          // Anonymize security logs
          const { error: logsError } = await supabase
            .from("security_logs")
            .update({
              email: null,
              ip_address: null,
              user_agent: null,
              details: null,
            })
            .eq("user_id", userId)

          if (logsError) {
            console.warn(`Failed to anonymize security logs: ${logsError.message}`)
          }
        } else {
          // Delete user completely
          const { error: deleteError } = await supabase.from("users").delete().eq("id", userId)

          if (deleteError) {
            throw new Error(`Failed to delete user: ${deleteError.message}`)
          }
        }
      }

      // Delete course data if requested
      if (options.deleteCourseData) {
        // Delete enrollments
        const { error: enrollmentError } = await supabase.from("enrollments").delete().eq("user_id", userId)

        if (enrollmentError) {
          console.warn(`Failed to delete enrollments: ${enrollmentError.message}`)
        }

        // Delete progress
        const { error: progressError } = await supabase.from("progress").delete().eq("user_id", userId)

        if (progressError) {
          console.warn(`Failed to delete progress: ${progressError.message}`)
        }
      }

      // Delete wellness data if requested
      if (options.includeWellnessData) {
        const { error: wellnessError } = await supabase.from("wellness_moods").delete().eq("user_id", userId)

        if (wellnessError) {
          console.warn(`Failed to delete wellness data: ${wellnessError.message}`)
        }
      }

      // Commit the transaction
      const { error: commitError } = await supabase.rpc("commit_transaction")

      if (commitError) {
        throw new Error(`Failed to commit transaction: ${commitError.message}`)
      }

      return true
    } catch (error) {
      // Rollback the transaction on error
      const { error: rollbackError } = await supabase.rpc("rollback_transaction")

      if (rollbackError) {
        console.error("Failed to rollback transaction:", rollbackError)
      }

      throw error
    }
  } catch (error) {
    console.error("Error deleting user data:", error)
    return false
  }
}
