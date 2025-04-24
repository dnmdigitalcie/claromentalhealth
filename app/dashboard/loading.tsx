import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-calm-blue-600" />
        <h2 className="text-xl font-semibold text-calm-blue-800">Loading your dashboard...</h2>
        <p className="text-calm-blue-600 mt-2">Please wait while we prepare your personalized dashboard.</p>
      </div>
    </div>
  )
}
