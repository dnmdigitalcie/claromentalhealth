"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"
import { Loader2, Calendar, Save } from "lucide-react"
import { format } from "date-fns"
import { MoodChart } from "./mood-chart"

export function WellnessTracker() {
  const { user } = useAuth()
  const [mood, setMood] = useState<number>(5)
  const [note, setNote] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [todaysMood, setTodaysMood] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [moodHistory, setMoodHistory] = useState<any[]>([])

  useEffect(() => {
    async function fetchMoodData() {
      if (!user) return

      try {
        // Get today's date in ISO format (YYYY-MM-DD)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayStr = today.toISOString().split("T")[0]

        // Check if user has already logged mood today
        const { data: todayData, error: todayError } = await supabase
          .from("wellness_moods")
          .select("*")
          .eq("user_id", user.id)
          .gte("created_at", `${todayStr}T00:00:00`)
          .lt("created_at", `${todayStr}T23:59:59`)
          .order("created_at", { ascending: false })
          .limit(1)

        if (todayError) throw todayError

        if (todayData && todayData.length > 0) {
          setTodaysMood(todayData[0])
          setMood(todayData[0].mood)
          setNote(todayData[0].note || "")
        }

        // Get mood history for the past 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const { data: historyData, error: historyError } = await supabase
          .from("wellness_moods")
          .select("*")
          .eq("user_id", user.id)
          .gte("created_at", thirtyDaysAgo.toISOString())
          .order("created_at", { ascending: true })

        if (historyError) throw historyError

        setMoodHistory(historyData || [])
      } catch (error) {
        console.error("Error fetching mood data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMoodData()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)

    try {
      if (todaysMood) {
        // Update today's mood
        const { error } = await supabase
          .from("wellness_moods")
          .update({
            mood,
            note,
            created_at: new Date().toISOString(),
          })
          .eq("id", todaysMood.id)

        if (error) throw error
      } else {
        // Create new mood entry
        const { error } = await supabase.from("wellness_moods").insert({
          user_id: user.id,
          mood,
          note,
          created_at: new Date().toISOString(),
        })

        if (error) throw error
      }

      // Refresh data
      const { data, error } = await supabase
        .from("wellness_moods")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)

      if (error) throw error

      if (data && data.length > 0) {
        setTodaysMood(data[0])
      }

      // Refresh mood history
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: historyData, error: historyError } = await supabase
        .from("wellness_moods")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at", { ascending: true })

      if (historyError) throw historyError

      setMoodHistory(historyData || [])
    } catch (error) {
      console.error("Error saving mood:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getMoodLabel = (value: number) => {
    const labels = [
      "Very Poor",
      "Poor",
      "Below Average",
      "Average",
      "Above Average",
      "Good",
      "Very Good",
      "Excellent",
      "Outstanding",
      "Perfect",
    ]
    return labels[value - 1] || "Average"
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Track Your Mood</CardTitle>
          <CardDescription>
            {todaysMood
              ? `Last updated ${format(new Date(todaysMood.created_at), "h:mm a")}`
              : "How are you feeling today?"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Poor</span>
                <span className="font-medium">{getMoodLabel(mood)}</span>
                <span className="text-sm text-muted-foreground">Excellent</span>
              </div>
              <Slider value={[mood]} min={1} max={10} step={1} onValueChange={(value) => setMood(value[0])} />
            </div>

            <div className="space-y-2">
              <label htmlFor="note" className="text-sm font-medium">
                Notes (optional)
              </label>
              <Textarea
                id="note"
                placeholder="Add any thoughts or reflections..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {todaysMood ? "Update Mood" : "Save Mood"}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mood History</CardTitle>
          <CardDescription>Your mood trends over the past 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {moodHistory.length > 0 ? (
            <MoodChart data={moodHistory} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No mood data yet</h3>
              <p className="text-sm text-muted-foreground text-center">
                Start tracking your mood to see your trends over time
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
