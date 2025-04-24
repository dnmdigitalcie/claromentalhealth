"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"
import { Loader2, BookOpen } from "lucide-react"
import Link from "next/link"
import { WellnessTracker } from "@/components/wellness/wellness-tracker"
import { CourseProgress } from "@/components/courses/course-progress"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"

export default function DashboardPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUserCourses() {
      if (!user) return

      try {
        // Get courses the user is enrolled in
        const { data, error } = await supabase
          .from("user_course_progress")
          .select(`
            course_id,
            progress,
            completed,
            last_accessed,
            courses (
              id,
              title,
              description,
              image_url,
              duration,
              level,
              category
            )
          `)
          .eq("user_id", user.id)
          .order("last_accessed", { ascending: false })

        if (error) throw error

        const formattedCourses = data.map((item) => ({
          id: item.course_id,
          progress: item.progress,
          completed: item.completed,
          lastAccessed: item.last_accessed,
          ...item.courses,
        }))

        setCourses(formattedCourses)
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserCourses()
  }, [user])

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <ProtectedRoute>
          <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-calm-blue-900">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user?.name || "there"}!</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link href="/courses">
                  <Button>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </div>

            <DashboardStats />

            <Tabs defaultValue="courses" className="mt-8">
              <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
                <TabsTrigger value="courses">My Courses</TabsTrigger>
                <TabsTrigger value="wellness">Wellness</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="courses" className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : courses.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                      <CourseProgress key={course.id} course={course} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">No courses yet</h3>
                      <p className="text-muted-foreground text-center mb-6">
                        You haven't enrolled in any courses yet. Browse our catalog to get started.
                      </p>
                      <Link href="/courses">
                        <Button>Browse Courses</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="wellness" className="mt-6">
                <WellnessTracker />
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <RecentActivity />
              </TabsContent>
            </Tabs>
          </div>
        </ProtectedRoute>
      </main>
      <Footer />
    </div>
  )
}
