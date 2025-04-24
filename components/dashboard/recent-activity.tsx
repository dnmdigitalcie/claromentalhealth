"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"
import { BookOpen, BarChart2, CheckCircle } from "lucide-react"

type Activity = {
  id: string
  type: "course_progress" | "lesson_completed" | "mood_tracked"
  title: string
  description: string
  created_at: string
  icon: React.ReactNode
}

export function RecentActivity() {
  const { user } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchActivity() {
      if (!user) return

      try {
        // Fetch recent lesson progress
        const { data: lessonData, error: lessonError } = await supabase
          .from("user_lesson_progress")
          .select(`
            id,
            completed,
            last_accessed,
            lesson_id,
            lessons (
              title,
              course_id,
              courses (
                title
              )
            )
          `)
          .eq("user_id", user.id)
          .order("last_accessed", { ascending: false })
          .limit(5)

        if (lessonError) throw lessonError

        // Fetch recent mood entries
        const { data: moodData, error: moodError } = await supabase
          .from("wellness_moods")
          .select("id, mood, note, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)

        if (moodError) throw moodError

        // Format lesson activities
        const lessonActivities: Activity[] = lessonData.map((item) => ({
          id: `lesson_${item.id}`,
          type: item.completed ? "lesson_completed" : "course_progress",
          title: item.completed ? "Completed Lesson" : "Lesson Progress",
          description: `${item.lessons.title} in ${item.lessons.courses.title}`,
          created_at: item.last_accessed,
          icon: item.completed ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <BookOpen className="h-5 w-5 text-blue-500" />
          ),
        }))

        // Format mood activities
        const moodActivities: Activity[] = moodData.map((item) => ({
          id: `mood_${item.id}`,
          type: "mood_tracked",
          title: "Tracked Mood",
          description: `Mood level: ${item.mood}/10${item.note ? ` - "${item.note}"` : ""}`,
          created_at: item.created_at,
          icon: <BarChart2 className="h-5 w-5 text-purple-500" />,
        }))

        // Combine and sort activities
        const allActivities = [...lessonActivities, ...moodActivities]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 10)

        setActivities(allActivities)
      } catch (error) {
        console.error("Error fetching recent activity:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivity()
  }, [user])

  return (
    <div>
      <h2>Recent Activity</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {activities.map((activity) => (
            <li key={activity.id}>
              {activity.title} - {activity.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
