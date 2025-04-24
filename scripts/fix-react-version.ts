/**
 * Fix React Version Script
 *
 * This script updates the React version in package.json to a stable version.
 */

import fs from "fs"
import path from "path"
import { execSync } from "child_process"

// Configuration
const rootDir = process.cwd()
const packageJsonPath = path.join(rootDir, "package.json")

console.log("🔧 Fixing React version...")

// Check if package.json exists
if (!fs.existsSync(packageJsonPath)) {
  console.error("❌ package.json not found!")
  process.exit(1)
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

// Check React version
const reactVersion = packageJson.dependencies?.react
const reactDomVersion = packageJson.dependencies?.["react-dom"]

let needsUpdate = false

if (reactVersion === "^18.3.0") {
  console.log("⚠️ Found experimental React version 18.3.0. Updating to stable version 18.2.0...")
  packageJson.dependencies.react = "^18.2.0"
  needsUpdate = true
}

if (reactDomVersion === "^18.3.0") {
  console.log("⚠️ Found experimental React DOM version 18.3.0. Updating to stable version 18.2.0...")
  packageJson.dependencies["react-dom"] = "^18.2.0"
  needsUpdate = true
}

if (needsUpdate) {
  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  console.log("✅ Updated package.json with stable React versions.")

  // Install dependencies
  console.log("📦 Installing updated dependencies...")
  try {
    execSync("npm install", { stdio: "inherit" })
    console.log("✅ Dependencies installed successfully.")
  } catch (error) {
    console.error("❌ Failed to install dependencies:", error)
    process.exit(1)
  }
} else {
  console.log("✅ React version is already stable.")
}

console.log("✅ React version fix completed!")
