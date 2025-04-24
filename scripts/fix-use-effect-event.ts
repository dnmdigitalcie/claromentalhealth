"use client"

import fs from "fs"
import path from "path"

// Function to fix useEffectEvent in a file
function fixUseEffectEventInFile(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, "utf8")
    let modified = false

    // Check if useEffectEvent is imported
    if (content.includes("useEffectEvent")) {
      console.log(`Found useEffectEvent in ${filePath}`)

      // Replace import
      let newContent = content.replace(
        /import\s+{(.*?)\s*useEffectEvent\s*(?:,\s*|\s*})?(.*?)}\s+from\s+['"]react['"]/g,
        (match, before, after) => {
          modified = true
          let newImport = `import {${before}${before && after ? ", " : ""}${after}} from 'react'`
          newImport = newImport.replace(/,\s*,/g, ",") // Remove any double commas
          newImport = newImport.replace(/{\s*,/g, "{") // Remove any spaces after opening brace
          newImport = newImport.replace(/,\s*}/g, "}") // Remove any spaces before closing brace
          return newImport
        },
      )

      // Replace usage with useCallback
      const useCallbackRegex = /const\s+(\w+)\s+=\s+useEffectEvent\s*$([^)]*)$\s*=>\s*\{([\s\S]*?)\}/g
      newContent = newContent.replace(useCallbackRegex, (match, funcName, params, body) => {
        modified = true
        return `const ${funcName} = useCallback(${params} => {${body}}, [])`
      })

      // Replace usage with useCallback (alternative pattern)
      const veryFinalContent = newContent.replace(
        /const\s+(\w+)\s+=\s+useEffectEvent([^=]*?)=>\s+{([\s\S]*?)}/g,
        (match, funcName, params, body) => {
          modified = true
          return `const ${funcName} = useCallback(${params}=> {${body}}, [])`
        },
      )

      if (modified) {
        // Add useCallback import if not already present
        if (!veryFinalContent.includes("useCallback")) {
          newContent = veryFinalContent.replace(/import\s+{(.*?)}\s+from\s+['"]react['"]/, (match, imports) => {
            return `import {${imports}, useCallback} from 'react'`
          })
        } else {
          newContent = veryFinalContent
        }
        fs.writeFileSync(filePath, newContent)
        console.log(`Fixed ${filePath}`)
      }
    }

    return modified
  } catch (error) {
    console.error(`Error fixing file ${filePath}:`, error)
    return false
  }
}

// Function to recursively search and fix directories
function searchAndFixDirectory(dir: string, fileExtensions: string[]): string[] {
  const fixedFiles: string[] = []

  try {
    const files = fs.readdirSync(dir)

    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        // Recursively search subdirectories
        if (!filePath.includes("node_modules") && !filePath.includes(".next")) {
          fixedFiles.push(...searchAndFixDirectory(filePath, fileExtensions))
        }
      } else if (fileExtensions.some((ext) => file.endsWith(ext))) {
        // Check and fix file if it has one of the specified extensions
        if (fixUseEffectEventInFile(filePath)) {
          fixedFiles.push(filePath)
        }
      }
    }
  } catch (error) {
    console.error(`Error searching directory ${dir}:`, error)
  }

  return fixedFiles
}

// Main function
function fixAllUseEffectEvent() {
  const rootDir = process.cwd()
  const fileExtensions = [".js", ".jsx", ".ts", ".tsx"]

  console.log("Searching for and fixing files containing useEffectEvent...")
  const fixedFiles = searchAndFixDirectory(rootDir, fileExtensions)

  if (fixedFiles.length === 0) {
    console.log("No files needed fixing for useEffectEvent.")
  } else {
    console.log("Fixed files containing useEffectEvent:")
    fixedFiles.forEach((file) => {
      console.log(`- ${path.relative(rootDir, file)}`)
    })
  }
}

fixAllUseEffectEvent()
