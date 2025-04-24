import WellnessTrackerDashboard from "@/components/wellness-tracker/dashboard"
import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function WellnessTrackerPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <ProtectedRoute>
          <div className="container mx-auto py-6">
            <Suspense fallback={<div className="flex justify-center items-center min-h-[200px]">Loading...</div>}>
              <WellnessTrackerDashboard />
            </Suspense>
          </div>
        </ProtectedRoute>
      </main>
      <Footer />
    </div>
  )
}
