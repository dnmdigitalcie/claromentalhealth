"use client"

// Check and fix auth-context.tsx
import fs from "fs"
import path from "path"

function fixAuthContext() {
  const filePath = path.join(process.cwd(), "contexts/auth-context.tsx")

  try {
    let content = fs.readFileSync(filePath, "utf8")

    // Check if useEffectEvent is imported
    if (content.includes("useEffectEvent")) {
      console.log("Found useEffectEvent in auth-context.tsx, replacing with useCallback")

      // Replace import
      content = content.replace(/import {.*?useEffectEvent.*?} from ['"]react['"]/, (match) =>
        match.replace("useEffectEvent", ""),
      )

      // Replace usage with useCallback
      content = content.replace(
        /const\s+(\w+)\s+=\s+useEffectEvent$$\(([^)]*)$$\s+=>\s+{([\s\S]*?)}\)/g,
        "const $1 = useCallback(($2) => {$3}, [])",
      )

      fs.writeFileSync(filePath, content)
      console.log("Fixed auth-context.tsx")
    } else {
      console.log("No useEffectEvent found in auth-context.tsx")
    }
  } catch (error) {
    console.error("Error fixing auth-context.tsx:", error)
  }
}

fixAuthContext()
