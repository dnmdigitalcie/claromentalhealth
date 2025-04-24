/**
 * Dependency Check Script
 *
 * This script checks for potential issues with dependencies that might cause deployment problems.
 */

import fs from "fs"
import path from "path"
import { execSync } from "child_process"

// Configuration
const rootDir = process.cwd()
const packageJsonPath = path.join(rootDir, "package.json")

console.log("🔍 Checking dependencies...")

// Check if package.json exists
if (!fs.existsSync(packageJsonPath)) {
  console.error("❌ package.json not found!")
  process.exit(1)
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

// Check for problematic dependencies
const problematicDeps = [
  { name: "react", version: "^18.3.0", reason: "Experimental version with unstable features" },
  { name: "react-dom", version: "^18.3.0", reason: "Experimental version with unstable features" },
]

let hasProblems = false

for (const dep of problematicDeps) {
  const installedVersion = packageJson.dependencies?.[dep.name]
  if (installedVersion && installedVersion === dep.version) {
    console.error(`❌ Problematic dependency: ${dep.name}@${dep.version} - ${dep.reason}`)
    hasProblems = true
  }
}

if (!hasProblems) {
  console.log("✅ No problematic dependencies found.")
}

// Check for duplicate dependencies
console.log("🔍 Checking for duplicate dependencies...")
try {
  execSync("npm ls --depth=0", { stdio: "pipe" })
  console.log("✅ No duplicate dependencies found.")
} catch (error) {
  console.warn("⚠️ Potential duplicate dependencies found:")
  console.log(error.stdout.toString())
}

// Check for outdated dependencies
console.log("🔍 Checking for outdated dependencies...")
try {
  const outdated = execSync("npm outdated --json", { stdio: "pipe" }).toString()
  const outdatedDeps = JSON.parse(outdated)

  if (Object.keys(outdatedDeps).length > 0) {
    console.warn("⚠️ Outdated dependencies found:")
    for (const [name, info] of Object.entries(outdatedDeps)) {
      console.log(`  - ${name}: ${(info as any).current} → ${(info as any).latest}`)
    }
  } else {
    console.log("✅ All dependencies are up to date.")
  }
} catch (error) {
  if (error.stdout && error.stdout.toString().trim() !== "{}") {
    console.warn("⚠️ Outdated dependencies found:")
    console.log(error.stdout.toString())
  } else {
    console.log("✅ All dependencies are up to date.")
  }
}

console.log("✅ Dependency check completed!")
