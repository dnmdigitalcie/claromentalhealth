import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-calm-blue-900 mb-4">Access Denied</h1>
          <p className="text-calm-blue-700 mb-6">
            You don't have permission to access this page. If you believe this is an error, please contact support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="bg-calm-blue-600 hover:bg-calm-blue-700">Go to Dashboard</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-calm-blue-200 text-calm-blue-700 hover:bg-calm-blue-50">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
