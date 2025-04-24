#!/usr/bin/env node

/**
 * Automated security scanning script
 *
 * This script performs various security checks on the codebase:
 * - Checks for outdated dependencies with known vulnerabilities
 * - Scans for hardcoded secrets
 * - Validates security headers
 * - Tests for common security misconfigurations
 *
 * Usage: npm run security-scan
 */

import fs from "fs"
import path from "path"
import { execSync } from "child_process"

// Configuration
const config = {
  secretPatterns: [
    /(['"])(?:api|jwt|token|secret|password|passwd|pwd|key).*?\1\s*(?::|=>|=)\s*(['"])(?!process\.env)[^2]+?\2/i,
    /(['"])(?:aws|stripe|twilio|sendgrid|mailgun|auth0).*?id['"]?\s*(?::|=>|=)\s*(['"])[^2]+?\2/i,
  ],
  ignoreFiles: ["node_modules", ".git", ".next", "dist", "build", "security-scan.ts"],
  securityHeaders: [
    "Content-Security-Policy",
    "X-Content-Type-Options",
    "X-Frame-Options",
    "X-XSS-Protection",
    "Referrer-Policy",
    "Permissions-Policy",
    "Strict-Transport-Security",
  ],
}

// ANSI color codes for output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
}

// Main function
async function main() {
  console.log(`${colors.cyan}Starting security scan...${colors.reset}\n`)

  let exitCode = 0

  try {
    // Check for outdated dependencies
    await checkDependencies()

    // Scan for hardcoded secrets
    const secretsFound = await scanForSecrets()
    if (secretsFound > 0) exitCode = 1

    // Validate security headers
    const headersValid = await validateSecurityHeaders()
    if (!headersValid) exitCode = 1

    // Check for common security misconfigurations
    const configsValid = await checkSecurityConfigs()
    if (!configsValid) exitCode = 1

    console.log(`\n${colors.cyan}Security scan complete.${colors.reset}`)

    if (exitCode === 0) {
      console.log(`${colors.green}All checks passed!${colors.reset}`)
    } else {
      console.log(`${colors.red}Some security issues were found. Please address them before deploying.${colors.reset}`)
    }
  } catch (error) {
    console.error(`${colors.red}Error during security scan:${colors.reset}`, error)
    exitCode = 1
  }

  process.exit(exitCode)
}

// Check for outdated dependencies with vulnerabilities
async function checkDependencies() {
  console.log(`${colors.blue}Checking for vulnerable dependencies...${colors.reset}`)

  try {
    console.log("Running npm audit...")
    const auditOutput = execSync("npm audit --json", { encoding: "utf8" })
    const auditResult = JSON.parse(auditOutput)

    if (auditResult.metadata.vulnerabilities.total > 0) {
      console.log(`${colors.red}Found ${auditResult.metadata.vulnerabilities.total} vulnerabilities:${colors.reset}`)
      console.log(`  Critical: ${auditResult.metadata.vulnerabilities.critical}`)
      console.log(`  High: ${auditResult.metadata.vulnerabilities.high}`)
      console.log(`  Moderate: ${auditResult.metadata.vulnerabilities.moderate}`)
      console.log(`  Low: ${auditResult.metadata.vulnerabilities.low}`)
      console.log("\nRun npm audit fix to resolve issues or npm audit for details")
    } else {
      console.log(`${colors.green}No vulnerabilities found in dependencies.${colors.reset}`)
    }
  } catch (error) {
    console.error(`${colors.red}Error checking dependencies:${colors.reset}`, error.message)
    console.log("Run npm audit manually to check for vulnerabilities")
  }
}

// Scan for hardcoded secrets in the codebase
async function scanForSecrets() {
  console.log(`\n${colors.blue}Scanning for hardcoded secrets...${colors.reset}`)

  let secretsFound = 0
  const rootDir = process.cwd()

  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      // Skip ignored directories and files
      if (config.ignoreFiles.some((pattern) => fullPath.includes(pattern))) {
        continue
      }

      if (entry.isDirectory()) {
        scanDir(fullPath)
      } else if (entry.isFile() && /\.(js|jsx|ts|tsx|json|env)$/i.test(entry.name)) {
        try {
          const content = fs.readFileSync(fullPath, "utf8")

          for (const pattern of config.secretPatterns) {
            const matches = content.match(new RegExp(pattern, "g"))
            if (matches) {
              secretsFound += matches.length
              console.log(
                `${colors.red}Potential secret found in ${colors.yellow}${path.relative(rootDir, fullPath)}${colors.reset}`,
              )

              for (const match of matches) {
                console.log(`  ${match}`)
              }
            }
          }
        } catch (error) {
          console.error(`Error reading file ${fullPath}:`, error.message)
        }
      }
    }
  }

  scanDir(rootDir)

  if (secretsFound === 0) {
    console.log(`${colors.green}No hardcoded secrets found.${colors.reset}`)
  } else {
    console.log(`${colors.red}Found ${secretsFound} potential hardcoded secrets.${colors.reset}`)
  }

  return secretsFound
}

// Validate security headers
async function validateSecurityHeaders() {
  console.log(`\n${colors.blue}Validating security headers...${colors.reset}`)

  try {
    // Check if security headers are defined in the codebase
    const middlewarePath = path.join(process.cwd(), "middleware.ts")
    const securityHeadersPath = path.join(process.cwd(), "lib", "security-headers.ts")

    let headersImplemented = false

    if (fs.existsSync(securityHeadersPath)) {
      console.log(`${colors.green}Security headers file found.${colors.reset}`)
      headersImplemented = true
    } else {
      console.log(`${colors.yellow}Security headers file not found at ${securityHeadersPath}${colors.reset}`)
    }

    if (fs.existsSync(middlewarePath)) {
      const middlewareContent = fs.readFileSync(middlewarePath, "utf8")
      if (middlewareContent.includes("security") && middlewareContent.includes("headers")) {
        console.log(`${colors.green}Security headers appear to be implemented in middleware.${colors.reset}`)
        headersImplemented = true
      }
    }

    if (!headersImplemented) {
      console.log(`${colors.red}Security headers don't appear to be properly implemented.${colors.reset}`)
      console.log("Recommendation: Implement security headers in middleware.ts or a dedicated module.")
      return false
    }

    return true
  } catch (error) {
    console.error(`${colors.red}Error validating security headers:${colors.reset}`, error.message)
    return false
  }
}

// Check for common security misconfigurations
async function checkSecurityConfigs() {
  console.log(`\n${colors.blue}Checking for security misconfigurations...${colors.reset}`)

  let allValid = true

  // Check for CORS configuration
  try {
    const nextConfigPath = path.join(process.cwd(), "next.config.js")
    if (fs.existsSync(nextConfigPath)) {
      const nextConfig = fs.readFileSync(nextConfigPath, "utf8")
      if (nextConfig.includes("cors") && !nextConfig.includes("origin:")) {
        console.log(
          `${colors.yellow}Warning: CORS configuration found but origins may not be restricted.${colors.reset}`,
        )
        allValid = false
      }
    }
  } catch (error) {
    console.error(`Error checking CORS configuration:`, error.message)
  }

  // Check for proper authentication middleware
  try {
    const middlewarePath = path.join(process.cwd(), "middleware.ts")
    if (fs.existsSync(middlewarePath)) {
      const middleware = fs.readFileSync(middlewarePath, "utf8")
      if (!middleware.includes("auth") && !middleware.includes("session")) {
        console.log(`${colors.yellow}Warning: Authentication checks may be missing in middleware.${colors.reset}`)
        allValid = false
      }
    }
  } catch (error) {
    console.error(`Error checking authentication middleware:`, error.message)
  }

  // Check for environment variables in .env.example
  try {
    const envExamplePath = path.join(process.cwd(), ".env.example")
    if (fs.existsSync(envExamplePath)) {
      const envExample = fs.readFileSync(envExamplePath, "utf8")
      if (!envExample.includes("SECRET") && !envExample.includes("KEY")) {
        console.log(
          `${colors.yellow}Warning: .env.example may be missing security-related environment variables.${colors.reset}`,
        )
        allValid = false
      }
    } else {
      console.log(`${colors.yellow}Warning: .env.example file not found.${colors.reset}`)
      allValid = false
    }
  } catch (error) {
    console.error(`Error checking .env.example:`, error.message)
  }

  if (allValid) {
    console.log(`${colors.green}No obvious security misconfigurations found.${colors.reset}`)
  }

  return allValid
}

// Run the script
main().catch((error) => {
  console.error("Unhandled error:", error)
  process.exit(1)
})
