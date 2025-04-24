import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { WebhookDashboard } from "@/components/admin/webhook-dashboard"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function WebhooksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <ProtectedRoute requiredRole="admin">
          <div className="container mx-auto py-8">
            <WebhookDashboard />
          </div>
        </ProtectedRoute>
      </main>
      <Footer />
    </div>
  )
}
