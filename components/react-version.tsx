"use client"

import React from "react"

const ReactVersion = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">React Version Information</h2>
      <p>React version: {React.version}</p>
      <p className="mt-2 text-sm text-gray-600">
        This component displays the current React version being used in the application. React 18.2.0 is the stable
        version recommended for production.
      </p>
    </div>
  )
}

export default ReactVersion
