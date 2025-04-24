// This is a simple script to help identify files using useEffectEvent
// In a real environment, you would run this with Node.js

import fs from "fs"
import path from "path"

// Function to search for useEffectEvent in a file
function searchFileForUseEffectEvent(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, "utf8")
    return content.includes("useEffectEvent")
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return false
  }
}

// Function to recursively search directories
function searchDirectory(dir: string, fileExtensions: string[]): string[] {
  const results: string[] = []

  try {
    const files = fs.readdirSync(dir, { withFileTypes: true })

    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        // Recursively search subdirectories
        results.push(...searchDirectory(filePath, fileExtensions))
      } else if (fileExtensions.some((ext) => file.endsWith(ext))) {
        // Check if file has one of the specified extensions
        if (searchFileForUseEffectEvent(filePath)) {
          results.push(filePath)
        }
      }
    }
  } catch (error) {
    console.error(`Error searching directory ${dir}:`, error)
  }

  return results
}

// Main function
function findFilesWithUseEffectEvent() {
  const rootDir = process.cwd()
  const fileExtensions = [".js", ".jsx", ".ts", ".tsx"]

  console.log("Searching for files containing useEffectEvent...")
  const files = searchDirectory(rootDir, fileExtensions)

  if (files.length === 0) {
    console.log("No files found containing useEffectEvent.")
  } else {
    console.log("Files containing useEffectEvent:")
    files.forEach((file) => {
      console.log(`- ${path.relative(rootDir, file)}`)
    })
  }
}

findFilesWithUseEffectEvent()
