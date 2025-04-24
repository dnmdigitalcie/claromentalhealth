import fs from "fs"
import path from "path"

function checkNextConfig() {
  const nextConfigPath = path.join(process.cwd(), "next.config.mjs")

  try {
    if (fs.existsSync(nextConfigPath)) {
      const content = fs.readFileSync(nextConfigPath, "utf8")
      console.log("Checking next.config.mjs...")

      // Check for potential issues
      if (content.includes("experimental")) {
        console.log("Warning: next.config.mjs contains experimental features that might cause issues")
      }

      if (content.includes("webpack")) {
        console.log("Warning: next.config.mjs contains webpack configuration that might need review")
      }
    } else {
      console.log("next.config.mjs not found")
    }
  } catch (error) {
    console.error("Error checking next.config.mjs:", error)
  }
}

checkNextConfig()
