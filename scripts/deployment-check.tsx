/**
 * Deployment Check Script
 *
 * This script checks for common issues that might cause deployment problems.
 * Run this before deploying to catch potential issues.
 */

import fs from "fs"
import path from "path"
import { execSync } from "child_process"

// Configuration
const rootDir = process.cwd()
const packageJsonPath = path.join(rootDir, "package.json")
const nextConfigPath = path.join(rootDir, "next.config.mjs")

console.log("🔍 Starting deployment check...")

// Check if package.json exists
if (!fs.existsSync(packageJsonPath)) {
  console.error("❌ package.json not found!")
  process.exit(1)
}

// Check if next.config.mjs exists
if (!fs.existsSync(nextConfigPath)) {
  console.warn("⚠️ next.config.mjs not found. Using default Next.js configuration.")
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

// Check React version
const reactVersion = packageJson.dependencies?.react
if (!reactVersion) {
  console.error("❌ React dependency not found in package.json!")
  process.exit(1)
}

console.log(`✅ React version: ${reactVersion}`)

// Check for experimental features
if (fs.existsSync(nextConfigPath)) {
  const nextConfig = fs.readFileSync(nextConfigPath, "utf8")
  if (nextConfig.includes("experimental")) {
    console.warn("⚠️ Next.js config contains experimental features which may cause deployment issues.")
  } else {
    console.log("✅ No experimental features detected in Next.js config.")
  }
}

// Check for useEffectEvent usage
console.log("🔍 Checking for useEffectEvent usage...")
let foundUseEffectEvent = false

function searchInDirectory(dir: string) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory() && !filePath.includes("node_modules") && !filePath.includes(".next")) {
      searchInDirectory(filePath)
    } else if (
      stat.isFile() &&
      (filePath.endsWith(".tsx") || filePath.endsWith(".ts") || filePath.endsWith(".jsx") || filePath.endsWith(".js"))
    ) {
      const content = fs.readFileSync(filePath, "utf8")
      if (content.includes("useEffectEvent")) {
        console.error(`❌ Found useEffectEvent in ${filePath}`)
        foundUseEffectEvent = true
      }
    }
  }
}

try {
  searchInDirectory(rootDir)
  if (!foundUseEffectEvent) {
    console.log("✅ No useEffectEvent usage found.")
  }
} catch (error) {
  console.error("Error searching for useEffectEvent:", error)
}

// Check for build issues
console.log("🔍 Running build check...")
try {
  execSync("npm run build --dry-run", { stdio: "inherit" })
  console.log("✅ Build check passed.")
} catch (error) {
  console.error("❌ Build check failed. Fix the issues before deploying.")
  process.exit(1)
}

console.log("✅ Deployment check completed successfully!")
