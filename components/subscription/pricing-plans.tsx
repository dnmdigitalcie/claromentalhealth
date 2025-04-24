"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useSubscription } from "@/contexts/subscription-context"
import { getSubscriptionPlans, type SubscriptionPlan } from "@/lib/subscription-service"
import { Loader2, CheckCircle } from "lucide-react"
import { useEffect } from "react"

export function PricingPlans() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const { subscription, refreshSubscription } = useSubscription()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true)
      try {
        const subscriptionPlans = await getSubscriptionPlans()
        setPlans(subscriptionPlans)
      } catch (error) {
        console.error("Error fetching plans:", error)
        toast({
          title: "Error",
          description: "Failed to load subscription plans.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [toast])

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      return router.push(`/login?returnTo=${encodeURIComponent("/pricing")}`)
    }

    setProcessingPlanId(planId)

    try {
      const response = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create subscription")
      }

      toast({
        title: "Success",
        description: "Your subscription has been activated.",
      })

      await refreshSubscription()
      router.push("/account")
    } catch (error) {
      console.error("Error subscribing:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create subscription",
        variant: "destructive",
      })
    } finally {
      setProcessingPlanId(null)
    }
  }

  const handleChangePlan = async (planId: string) => {
    setProcessingPlanId(planId)

    try {
      const response = await fetch("/api/subscriptions/change-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to change subscription plan")
      }

      toast({
        title: "Success",
        description: "Your subscription plan has been updated.",
      })

      await refreshSubscription()
      router.push("/account")
    } catch (error) {
      console.error("Error changing plan:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to change subscription plan",
        variant: "destructive",
      })
    } finally {
      setProcessingPlanId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-calm-blue-600" />
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-calm-blue-900 mb-4">Subscription Plans</h2>
        <p className="text-xl text-calm-blue-700 max-w-2xl mx-auto">
          Choose the plan that best fits your needs and unlock premium mental health resources.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const isCurrentPlan = subscription?.plan_id === plan.id

          return (
            <Card key={plan.id} className={`border-calm-blue-100 ${isCurrentPlan ? "ring-2 ring-calm-blue-500" : ""}`}>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-calm-blue-800">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-calm-blue-900">${plan.price.toFixed(2)}</span>
                  <span className="text-calm-blue-600 ml-1">/{plan.interval}</span>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-calm-blue-600 mr-2 mt-0.5" />
                      <span className="text-calm-blue-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() =>
                    isCurrentPlan ? null : subscription ? handleChangePlan(plan.id) : handleSubscribe(plan.id)
                  }
                  disabled={isCurrentPlan || processingPlanId === plan.id}
                  className="w-full bg-calm-blue-600 hover:bg-calm-blue-700"
                >
                  {processingPlanId === plan.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isCurrentPlan ? "Current Plan" : subscription ? "Change to this Plan" : "Subscribe"}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
