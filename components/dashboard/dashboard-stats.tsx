"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"
import { BookOpen, Clock, Award, TrendingUp } from "lucide-react"

export function DashboardStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    currentStreak: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUserStats() {
      if (!user) return

      try {
        // Get course stats
        const { data: courseData, error: courseError } = await supabase
          .from("user_course_progress")
          .select(`
            course_id,
            completed,
            courses (
              duration
            )
          `)
          .eq("user_id", user.id)

        if (courseError) throw courseError

        // Calculate stats
        const totalCourses = courseData.length
        const completedCourses = courseData.filter((item) => item.completed).length
        const totalHours =
          courseData.reduce((acc, item) => {
            return acc + (item.courses?.duration || 0)
          }, 0) / 60 // Convert minutes to hours

        // Get streak data (simplified version)
        const { data: moodData, error: moodError } = await supabase
          .from("wellness_moods")
          .select("created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(30)

        if (moodError) throw moodError

        // Calculate streak (simplified)
        let currentStreak = 0
        if (moodData.length > 0) {
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)

          // Check if there's an entry for today
          const hasEntryToday = moodData.some((entry) => {
            const entryDate = new Date(entry.created_at)
            entryDate.setHours(0, 0, 0, 0)
            return entryDate.getTime() === today.getTime()
          })

          if (hasEntryToday) {
            currentStreak = 1

            // Count consecutive days
            const checkDate = yesterday
            let index = 0

            while (index < moodData.length) {
              const hasEntryOnDate = moodData.some((entry) => {
                const entryDate = new Date(entry.created_at)
                entryDate.setHours(0, 0, 0, 0)
                return entryDate.getTime() === checkDate.getTime()
              })

              if (hasEntryOnDate) {
                currentStreak++
                checkDate.setDate(checkDate.getDate() - 1)
              } else {
                break
              }

              index++
            }
          }
        }

        setStats({
          totalCourses,
          completedCourses,
          totalHours: Math.round(totalHours * 10) / 10, // Round to 1 decimal place
          currentStreak,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserStats()
  }, [user])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="flex items-center p-6">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Courses</p>
            <h3 className="text-2xl font-bold">{isLoading ? "-" : stats.totalCourses}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
            <Award className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Completed</p>
            <h3 className="text-2xl font-bold">{isLoading ? "-" : stats.completedCourses}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Learning Hours</p>
            <h3 className="text-2xl font-bold">{isLoading ? "-" : stats.totalHours}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
            <h3 className="text-2xl font-bold">{isLoading ? "-" : stats.currentStreak} days</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
