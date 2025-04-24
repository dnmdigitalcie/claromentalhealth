"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import type { SubscriptionWithPrice, Price, Product } from "@/types/subscription"

export function useSubscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<SubscriptionWithPrice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setSubscription(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Get the user's active subscription
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from("subscriptions")
          .select("*, prices(*, products(*))")
          .eq("user_id", user.id)
          .in("status", ["trialing", "active"])
          .single()

        if (subscriptionError) {
          throw subscriptionError
        }

        setSubscription(subscriptionData as unknown as SubscriptionWithPrice)
      } catch (err) {
        console.error("Error loading subscription:", err)
        setError(err instanceof Error ? err : new Error("Failed to load subscription"))
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [user])

  return {
    subscription,
    loading,
    error,
  }
}

export function useAvailablePlans() {
  const [products, setProducts] = useState<Product[]>([])
  const [prices, setPrices] = useState<Price[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get all active products
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("active", true)
          .order("name")

        if (productsError) {
          throw productsError
        }

        // Get all active prices
        const { data: pricesData, error: pricesError } = await supabase
          .from("prices")
          .select("*")
          .eq("active", true)
          .order("unit_amount")

        if (pricesError) {
          throw pricesError
        }

        setProducts(productsData as Product[])
        setPrices(pricesData as Price[])
      } catch (err) {
        console.error("Error loading plans:", err)
        setError(err instanceof Error ? err : new Error("Failed to load plans"))
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  return {
    products,
    prices,
    loading,
    error,
  }
}
