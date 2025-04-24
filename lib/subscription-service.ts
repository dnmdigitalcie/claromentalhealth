import { supabase } from "@/lib/supabase"
import { generateId } from "@/lib/utils"

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  interval: string
  features: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserSubscription {
  id: string
  user_id: string
  plan_id: string
  status: "active" | "canceled" | "past_due"
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
  plan?: SubscriptionPlan
}

export interface SubscriptionPayment {
  id: string
  subscription_id: string
  amount: number
  status: "succeeded" | "pending" | "failed"
  payment_method: string
  payment_details: Record<string, any>
  created_at: string
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const { data, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true)
      .order("price", { ascending: true })

    if (error) {
      console.error("Error fetching subscription plans:", error)
      return []
    }

    return data.map((plan) => ({
      ...plan,
      features: typeof plan.features === "string" ? JSON.parse(plan.features) : plan.features,
    }))
  } catch (error) {
    console.error("Error in getSubscriptionPlans:", error)
    return []
  }
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("*, plan:plan_id(*)")
      .eq("user_id", userId)
      .eq("status", "active")
      .single()

    if (error) {
      if (error.code !== "PGRST116") {
        // PGRST116 is "no rows returned" - not an error for us
        console.error("Error fetching user subscription:", error)
      }
      return null
    }

    if (data.plan && typeof data.plan.features === "string") {
      data.plan.features = JSON.parse(data.plan.features)
    }

    return data
  } catch (error) {
    console.error("Error in getUserSubscription:", error)
    return null
  }
}

export async function createSubscription(
  userId: string,
  planId: string,
  paymentDetails: Record<string, any> = {},
): Promise<{ success: boolean; subscription?: UserSubscription; error?: string }> {
  try {
    // Get the plan details
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", planId)
      .single()

    if (planError || !plan) {
      return { success: false, error: "Subscription plan not found" }
    }

    // Calculate subscription period
    const now = new Date()
    const periodEnd = new Date(now)

    if (plan.interval === "month") {
      periodEnd.setMonth(periodEnd.getMonth() + 1)
    } else if (plan.interval === "year") {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1)
    } else {
      // Default to 30 days
      periodEnd.setDate(periodEnd.getDate() + 30)
    }

    // Create the subscription
    const subscriptionId = generateId(24)
    const subscription = {
      id: subscriptionId,
      user_id: userId,
      plan_id: planId,
      status: "active",
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      cancel_at_period_end: false,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    }

    const { error: subscriptionError } = await supabase.from("user_subscriptions").insert(subscription)

    if (subscriptionError) {
      console.error("Error creating subscription:", subscriptionError)
      return { success: false, error: "Failed to create subscription" }
    }

    // Record the payment
    const payment = {
      id: generateId(24),
      subscription_id: subscriptionId,
      amount: plan.price,
      status: "succeeded",
      payment_method: "manual",
      payment_details: paymentDetails,
      created_at: now.toISOString(),
    }

    const { error: paymentError } = await supabase.from("subscription_payments").insert(payment)

    if (paymentError) {
      console.error("Error recording payment:", paymentError)
      // We don't fail the whole operation if just the payment record fails
    }

    // Get the full subscription with plan details
    const { data: fullSubscription, error: fetchError } = await supabase
      .from("user_subscriptions")
      .select("*, plan:plan_id(*)")
      .eq("id", subscriptionId)
      .single()

    if (fetchError) {
      console.error("Error fetching created subscription:", fetchError)
      return { success: true, subscription: { ...subscription, plan } }
    }

    return { success: true, subscription: fullSubscription }
  } catch (error) {
    console.error("Error in createSubscription:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function cancelSubscription(
  subscriptionId: string,
  cancelImmediately = false,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (cancelImmediately) {
      // Cancel immediately
      const { error } = await supabase
        .from("user_subscriptions")
        .update({
          status: "canceled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", subscriptionId)

      if (error) {
        console.error("Error canceling subscription:", error)
        return { success: false, error: "Failed to cancel subscription" }
      }
    } else {
      // Cancel at period end
      const { error } = await supabase
        .from("user_subscriptions")
        .update({
          cancel_at_period_end: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", subscriptionId)

      if (error) {
        console.error("Error setting subscription to cancel at period end:", error)
        return { success: false, error: "Failed to update subscription" }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in cancelSubscription:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function renewSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Get the subscription
    const { data: subscription, error: fetchError } = await supabase
      .from("user_subscriptions")
      .select("*, plan:plan_id(*)")
      .eq("id", subscriptionId)
      .single()

    if (fetchError || !subscription) {
      return { success: false, error: "Subscription not found" }
    }

    // Calculate new period
    const now = new Date()
    const periodEnd = new Date(now)

    if (subscription.plan.interval === "month") {
      periodEnd.setMonth(periodEnd.getMonth() + 1)
    } else if (subscription.plan.interval === "year") {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1)
    } else {
      // Default to 30 days
      periodEnd.setDate(periodEnd.getDate() + 30)
    }

    // Update the subscription
    const { error: updateError } = await supabase
      .from("user_subscriptions")
      .update({
        status: "active",
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        cancel_at_period_end: false,
        updated_at: now.toISOString(),
      })
      .eq("id", subscriptionId)

    if (updateError) {
      console.error("Error renewing subscription:", updateError)
      return { success: false, error: "Failed to renew subscription" }
    }

    // Record the payment
    const payment = {
      id: generateId(24),
      subscription_id: subscriptionId,
      amount: subscription.plan.price,
      status: "succeeded",
      payment_method: "manual",
      payment_details: {},
      created_at: now.toISOString(),
    }

    const { error: paymentError } = await supabase.from("subscription_payments").insert(payment)

    if (paymentError) {
      console.error("Error recording renewal payment:", paymentError)
      // We don't fail the whole operation if just the payment record fails
    }

    return { success: true }
  } catch (error) {
    console.error("Error in renewSubscription:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function changeSubscriptionPlan(
  subscriptionId: string,
  newPlanId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get the new plan details
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", newPlanId)
      .single()

    if (planError || !plan) {
      return { success: false, error: "New subscription plan not found" }
    }

    // Update the subscription
    const { error: updateError } = await supabase
      .from("user_subscriptions")
      .update({
        plan_id: newPlanId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscriptionId)

    if (updateError) {
      console.error("Error changing subscription plan:", updateError)
      return { success: false, error: "Failed to change subscription plan" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in changeSubscriptionPlan:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Function to check for and process expired subscriptions
export async function processExpiredSubscriptions(): Promise<void> {
  try {
    const now = new Date().toISOString()

    // Find subscriptions that have ended and should be canceled
    const { data: expiredSubscriptions, error } = await supabase
      .from("user_subscriptions")
      .select("id")
      .eq("status", "active")
      .lt("current_period_end", now)
      .eq("cancel_at_period_end", true)

    if (error) {
      console.error("Error fetching expired subscriptions:", error)
      return
    }

    if (expiredSubscriptions.length === 0) {
      return
    }

    // Update all expired subscriptions to canceled
    const subscriptionIds = expiredSubscriptions.map((sub) => sub.id)
    const { error: updateError } = await supabase
      .from("user_subscriptions")
      .update({
        status: "canceled",
        updated_at: now,
      })
      .in("id", subscriptionIds)

    if (updateError) {
      console.error("Error updating expired subscriptions:", updateError)
    }
  } catch (error) {
    console.error("Error in processExpiredSubscriptions:", error)
  }
}
