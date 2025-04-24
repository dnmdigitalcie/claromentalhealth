import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, BookOpen, Search, Filter, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

async function getCourses() {
  try {
    // First, check if the courses table exists
    const { error: checkError } = await supabase.from("courses").select("id").limit(1)

    if (checkError && checkError.code === "42P01") {
      // Table doesn't exist
      return { data: [], error: "Database tables not initialized" }
    }

    const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Error fetching courses:", error)
    return { data: [], error: "Failed to fetch courses" }
  }
}

// Sample course data for demonstration
const sampleCourses = [
  {
    id: 1,
    name: "Understanding Anxiety",
    description:
      "Learn about the different types of anxiety disorders, their symptoms, and effective coping strategies.",
    level: "Beginner",
    modules: 8,
    duration: "6 hours",
    category: "Mental Health Foundations",
  },
  {
    id: 2,
    name: "Mindfulness Basics",
    description: "Discover the fundamentals of mindfulness practice and how it can improve your mental wellbeing.",
    level: "Beginner",
    modules: 10,
    duration: "8 hours",
    category: "Self-Care",
  },
  {
    id: 3,
    name: "Stress Management",
    description: "Practical techniques and strategies to manage stress in your daily life and improve resilience.",
    level: "Intermediate",
    modules: 12,
    duration: "10 hours",
    category: "Self-Care",
  },
  {
    id: 4,
    name: "Depression: Understanding and Support",
    description: "Learn how to recognize signs of depression and provide effective support to those experiencing it.",
    level: "Intermediate",
    modules: 9,
    duration: "7 hours",
    category: "Mental Health Foundations",
  },
  {
    id: 5,
    name: "Crisis Intervention Skills",
    description: "Develop essential skills for supporting individuals during mental health crises.",
    level: "Advanced",
    modules: 14,
    duration: "12 hours",
    category: "Crisis Intervention",
  },
  {
    id: 6,
    name: "Youth Mental Health First Aid",
    description: "Learn how to provide initial support to young people experiencing mental health challenges.",
    level: "Intermediate",
    modules: 11,
    duration: "9 hours",
    category: "Youth Mental Health",
  },
]

export default async function CoursesPage() {
  const { data: courses, error } = await getCourses()

  // Use sample courses for demonstration
  const displayCourses = courses && courses.length > 0 ? courses : sampleCourses

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-calm-blue-50 py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-calm-blue-900">
                Mental Health Courses
              </h1>
              <p className="text-xl text-calm-blue-700 max-w-[700px]">
                Discover expert-led courses designed to help you understand, support, and improve mental wellbeing.
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-calm-blue-400" />
                <Input
                  placeholder="Search courses..."
                  className="pl-10 border-calm-blue-200 focus:border-calm-blue-500"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button variant="outline" className="border-calm-blue-200 text-calm-blue-700">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
                <Button variant="outline" className="border-calm-blue-200 text-calm-blue-700">
                  <ArrowUpDown className="mr-2 h-4 w-4" /> Sort
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="py-8">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-5 mb-8">
                <TabsTrigger value="all">All Courses</TabsTrigger>
                <TabsTrigger value="foundations">Foundations</TabsTrigger>
                <TabsTrigger value="self-care">Self-Care</TabsTrigger>
                <TabsTrigger value="crisis">Crisis Intervention</TabsTrigger>
                <TabsTrigger value="youth">Youth Mental Health</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                {error && error !== "Database tables not initialized" && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {error === "Database tables not initialized" && (
                  <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Using Sample Data</AlertTitle>
                    <AlertDescription>
                      Displaying sample courses. To use your own data, please visit the{" "}
                      <Link href="/admin/init-db" className="font-medium underline">
                        database initialization page
                      </Link>{" "}
                      to set up the database.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {displayCourses.map((course) => (
                    <Card key={course.id} className="border-calm-blue-100 overflow-hidden">
                      <div className="aspect-video w-full bg-calm-blue-100 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-calm-blue-600" />
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-medium bg-calm-blue-100 text-calm-blue-700 px-2 py-1 rounded-full">
                            {course.level}
                          </span>
                          <span className="text-xs font-medium text-calm-blue-600">{course.modules} Modules</span>
                        </div>
                        <h3 className="text-xl font-semibold text-calm-blue-800 mb-2">{course.name}</h3>
                        <p className="text-calm-blue-600 mb-4">{course.description}</p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-calm-blue-500">{course.category}</span>
                          <span className="text-sm text-calm-blue-500">{course.duration}</span>
                        </div>
                        <Link href={`/courses/${course.id}`}>
                          <Button className="w-full bg-calm-blue-600 hover:bg-calm-blue-700">View Course</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="foundations">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {displayCourses
                    .filter((course) => course.category === "Mental Health Foundations")
                    .map((course) => (
                      <Card key={course.id} className="border-calm-blue-100 overflow-hidden">
                        <div className="aspect-video w-full bg-calm-blue-100 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-calm-blue-600" />
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-medium bg-calm-blue-100 text-calm-blue-700 px-2 py-1 rounded-full">
                              {course.level}
                            </span>
                            <span className="text-xs font-medium text-calm-blue-600">{course.modules} Modules</span>
                          </div>
                          <h3 className="text-xl font-semibold text-calm-blue-800 mb-2">{course.name}</h3>
                          <p className="text-calm-blue-600 mb-4">{course.description}</p>
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-calm-blue-500">{course.category}</span>
                            <span className="text-sm text-calm-blue-500">{course.duration}</span>
                          </div>
                          <Link href={`/courses/${course.id}`}>
                            <Button className="w-full bg-calm-blue-600 hover:bg-calm-blue-700">View Course</Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
              {/* Similar TabsContent for other categories */}
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
