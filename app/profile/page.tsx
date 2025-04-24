"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProfileManager } from "@/components/auth/profile-manager"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
// Replace the Auth0 import with our standard auth context
import { useAuth } from "@/contexts/auth-context"

export default function ProfilePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // useEffect authentication check is replaced by ProtectedRoute

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-calm-blue-600" />
            <p className="text-calm-blue-800">Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // If not authenticated and not loading, the useEffect will handle redirection
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <ProtectedRoute>
          <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6 text-calm-blue-900">Your Profile</h1>
            <div className="max-w-md mx-auto">
              <ProfileManager />
            </div>
          </div>
        </ProtectedRoute>
      </main>
      <Footer />
    </div>
  )
}
