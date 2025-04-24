"use client"

import React from "react"

import { useEffect } from "react"

export default function CheckForIssues() {
  useEffect(() => {
    console.log("Checking for potential deployment issues...")

    // Check React version
    console.log("React version:", React.version)

    // Check for experimental features
    const reactFeatures = Object.keys(React).filter(
      (key) => key.startsWith("experimental") || key.startsWith("unstable") || key === "useEffectEvent",
    )

    if (reactFeatures.length > 0) {
      console.warn("Potentially problematic React features found:", reactFeatures)
    } else {
      console.log("No experimental React features found")
    }

    // Check for other potential issues
    console.log("Environment:", process.env.NODE_ENV)
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Deployment Issue Checker</h1>
      <p>Check the console for potential issues</p>
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-800">
          If you're seeing build errors related to <code>useEffectEvent</code>, make sure you're not using this
          experimental React feature.
        </p>
      </div>
    </div>
  )
}
