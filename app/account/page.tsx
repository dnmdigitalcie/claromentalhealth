import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AccountForm } from "@/components/subscription/account-form"
import { ProtectedRoute } from "@/components/auth/protected-route"

export const metadata = {
  title: "Account | Claro Mental Health",
  description: "Manage your account and subscription settings.",
}

export default function AccountPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <ProtectedRoute>
          <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
            <div className="grid gap-8 md:grid-cols-2">
              <AccountForm />

              {/* Additional account settings can go here */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-calm-blue-800">Account Information</h2>
                <p className="text-calm-blue-600">
                  Manage your subscription and account settings from this page. You can change your subscription plan,
                  update your payment information, or cancel your subscription at any time.
                </p>
                <p className="text-calm-blue-600">
                  If you have any questions or need assistance, please contact our support team.
                </p>
              </div>
            </div>
          </div>
        </ProtectedRoute>
      </main>
      <Footer />
    </div>
  )
}
