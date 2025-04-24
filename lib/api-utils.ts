"use client"

// Function to make authenticated API requests
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Get auth token from localStorage
  const user = localStorage.getItem("user")
  let token = null

  if (user) {
    try {
      // In a real app, you would have a proper token
      // For demo purposes, we'll create a simple token based on the user
      token = btoa(user) // Base64 encode the user data as a mock token
    } catch (error) {
      console.error("Error getting auth token:", error)
    }
  }

  // If we don't have a token, throw an error
  if (!token) {
    throw new Error("No authentication token available")
  }

  // Add the Authorization header
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  }

  // Make the request
  return fetch(url, {
    ...options,
    headers,
  })
}

// Hook to use in components
export function useAuthFetch() {
  return async (url: string, options: RequestInit = {}) => {
    try {
      return fetchWithAuth(url, options)
    } catch (error) {
      console.error("Error making authenticated request:", error)
      throw error
    }
  }
}
