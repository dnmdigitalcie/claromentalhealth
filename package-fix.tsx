// This is a utility to check and fix package.json

import fs from "fs"
import path from "path"

function fixPackageJson() {
  const packageJsonPath = path.join(process.cwd(), "package.json")

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

    // Check React version
    const reactVersion = packageJson.dependencies?.react
    console.log(`Current React version: ${reactVersion}`)

    // useEffectEvent is available in React 18.3+
    if (!reactVersion || !reactVersion.startsWith("^18.3")) {
      console.log("Updating React version to 18.3.0")
      packageJson.dependencies = packageJson.dependencies || {}
      packageJson.dependencies.react = "^18.3.0"
      packageJson.dependencies["react-dom"] = "^18.3.0"
    }

    // Write updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log("package.json updated successfully")
  } catch (error) {
    console.error("Error updating package.json:", error)
  }
}

fixPackageJson()
