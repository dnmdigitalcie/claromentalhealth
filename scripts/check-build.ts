/**
 * Build Check Script
 *
 * This script performs a dry run build to check for any issues that might cause deployment problems.
 */

import { execSync } from "child_process"

console.log("🔍 Running build check...")

try {
  // Clean any previous build artifacts
  console.log("🧹 Cleaning previous build...")
  execSync("rm -rf .next", { stdio: "inherit" })

  // Run a production build
  console.log("🏗️ Running production build...")
  execSync("npm run build", { stdio: "inherit" })

  console.log("✅ Build completed successfully!")
} catch (error) {
  console.error("❌ Build failed. Fix the issues before deploying.")
  process.exit(1)
}
