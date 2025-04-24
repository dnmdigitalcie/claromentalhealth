"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useSubscription } from "@/contexts/subscription-context"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function AccountForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { subscription, isLoading, refreshSubscription } = useSubscription()
  const [isCanceling, setIsCanceling] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelImmediately, setCancelImmediately] = useState(false)

  const handleCancelSubscription = async () => {
    setIsCanceling(true)
    try {
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cancelImmediately }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel subscription")
      }

      toast({
        title: "Success",
        description: cancelImmediately
          ? "Your subscription has been canceled."
          : "Your subscription will be canceled at the end of the billing period.",
      })

      await refreshSubscription()
      setShowCancelDialog(false)
    } catch (error) {
      console.error("Error canceling subscription:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel subscription",
        variant: "destructive",
      })
    } finally {
      setIsCanceling(false)
    }
  }

  return (
    <Card className="border-calm-blue-100">
      <CardHeader>
        <CardTitle className="text-calm-blue-800">Your Subscription</CardTitle>
        <CardDescription>Manage your subscription and billing details</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-calm-blue-600" />
          </div>
        ) : subscription ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-calm-blue-500">Plan</p>
                <p className="text-lg font-semibold text-calm-blue-800">{subscription.plan?.name || "Unknown Plan"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-calm-blue-500">Price</p>
                <p className="text-lg font-semibold text-calm-blue-800">
                  ${subscription.plan?.price.toFixed(2) || "0.00"}/{subscription.plan?.interval}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-calm-blue-500">Status</p>
              <p className="text-lg font-semibold text-calm-blue-800 capitalize">{subscription.status}</p>
              {subscription.cancel_at_period_end && (
                <p className="text-sm text-amber-600">
                  Your subscription will be canceled at the end of the current billing period.
                </p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-calm-blue-500">Current Period</p>
              <p className="text-lg font-semibold text-calm-blue-800">
                {new Date(subscription.current_period_start).toLocaleDateString()} to{" "}
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <Alert>
            <AlertDescription>
              You don't have an active subscription. Visit our pricing page to subscribe.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {subscription ? (
          <>
            <Button onClick={() => router.push("/pricing")} className="w-full bg-calm-blue-600 hover:bg-calm-blue-700">
              Change Plan
            </Button>
            <Button
              onClick={() => setShowCancelDialog(true)}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
            >
              Cancel Subscription
            </Button>
          </>
        ) : (
          <Button onClick={() => router.push("/pricing")} className="w-full bg-calm-blue-600 hover:bg-calm-blue-700">
            View Pricing Plans
          </Button>
        )}
      </CardFooter>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="cancel-immediately"
                checked={cancelImmediately}
                onChange={(e) => setCancelImmediately(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="cancel-immediately" className="text-sm text-gray-700">
                Cancel immediately (otherwise, your subscription will end at the current billing period)
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)} disabled={isCanceling}>
              Keep Subscription
            </Button>
            <Button variant="destructive" onClick={handleCancelSubscription} disabled={isCanceling}>
              {isCanceling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isCanceling ? "Canceling..." : "Cancel Subscription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
