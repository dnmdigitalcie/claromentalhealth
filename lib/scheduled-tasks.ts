import { cleanupExpiredRateLimits } from "@/lib/rate-limit-db"

/**
 * Run scheduled tasks
 * This function should be called periodically
 */
export async function runScheduledTasks(): Promise<void> {
  console.log("Running scheduled tasks...")

  try {
    // Clean up expired rate limits
    await cleanupExpiredRateLimits()

    // Add more scheduled tasks here as needed

    console.log("Scheduled tasks completed successfully")
  } catch (error) {
    console.error("Error running scheduled tasks:", error)
  }
}
