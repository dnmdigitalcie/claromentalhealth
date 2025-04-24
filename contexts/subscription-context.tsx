"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getUserSubscription, type UserSubscription } from "@/lib/subscription-service"

interface SubscriptionContextType {
  subscription: UserSubscription | null
  isLoading: boolean
  isSubscribed: boolean
  hasFeature: (feature: string) => boolean
  refreshSubscription: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  isLoading: true,
  isSubscribed: false,
  hasFeature: () => false,
  refreshSubscription: async () => {},
})

export const useSubscription = () => useContext(SubscriptionContext)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSubscription = async () => {
    if (!user?.id) {
      setSubscription(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const userSubscription = await getUserSubscription(user.id)
      setSubscription(userSubscription)
    } catch (error) {
      console.error("Error fetching subscription:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscription()
  }, [user?.id, isAuthenticated])

  const hasFeature = (feature: string): boolean => {
    if (!subscription || !subscription.plan || !subscription.plan.features) {
      return false
    }

    return subscription.plan.features.includes(feature)
  }

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isLoading,
        isSubscribed: !!subscription && subscription.status === "active",
        hasFeature,
        refreshSubscription: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}
