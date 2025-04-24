"use client"

import type { ReactNode } from "react"
import { useSubscription } from "@/contexts/subscription-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface SubscriptionGuardProps {
  children: ReactNode
  requiredFeature?: string
  fallback?: ReactNode
}

export function SubscriptionGuard({ children, requiredFeature, fallback }: SubscriptionGuardProps) {
  const router = useRouter()
  const { isSubscribed, isLoading, hasFeature } = useSubscription()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-calm-blue-600" />
      </div>
    )
  }

  // If no specific feature is required, just check for an active subscription
  const hasAccess = requiredFeature ? hasFeature(requiredFeature) : isSubscribed

  if (hasAccess) {
    return <>{children}</>
  }

  // If a custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>
  }

  // Default fallback UI
  return (
    <Card className="border-calm-blue-100 my-8">
      <CardHeader>
        <CardTitle className="text-calm-blue-800">Premium Content</CardTitle>
        <CardDescription>This content is available to subscribers only.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-calm-blue-600 mb-4">
          Subscribe to access this premium content and unlock all features of Claro Mental Health.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => router.push("/pricing")} className="w-full bg-calm-blue-600 hover:bg-calm-blue-700">
          View Subscription Plans
        </Button>
      </CardFooter>
    </Card>
  )
}
