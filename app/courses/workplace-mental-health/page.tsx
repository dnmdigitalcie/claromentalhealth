import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Clock, Users, Building } from "lucide-react"

// Sample courses for this category
const courses = [
  {
    id: 1,
    title: "Creating Psychologically Safe Workplaces",
    description:
      "Learn how to foster environments where employees feel safe to take risks, speak up, and be themselves.",
    level: "Intermediate",
    modules: 8,
    duration: "7 hours",
    students: 1542,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 2,
    title: "Mental Health First Aid for Managers",
    description: "Essential skills for recognizing and responding to mental health challenges in the workplace.",
    level: "Beginner",
    modules: 10,
    duration: "8 hours",
    students: 2187,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 3,
    title: "Return-to-Work Planning After Mental Health Leave",
    description: "Strategies for supporting employees returning to work after mental health-related absences.",
    level: "Advanced",
    modules: 6,
    duration: "5 hours",
    students: 876,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 4,
    title: "Workplace Stress Management",
    description:
      "Practical approaches to identifying and addressing workplace stressors at individual and organizational levels.",
    level: "Intermediate",
    modules: 9,
    duration: "7 hours",
    students: 1654,
    image: "/placeholder.svg?height=200&width=400",
  },
]

export default function WorkplaceMentalHealthPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-calm-blue-50 py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-calm-blue-900">
                Workplace Mental Health
              </h1>
              <p className="text-xl text-calm-blue-700 max-w-[700px]">
                Create supportive work environments and develop skills to address mental health in organizational
                settings.
              </p>
            </div>
          </div>
        </section>

        {/* Category Description */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-2xl font-bold text-calm-blue-800 mb-4">About This Category</h2>
                <p className="text-calm-blue-600 mb-4">
                  Workplace Mental Health courses are designed for HR professionals, managers, and organizational
                  leaders who want to create psychologically healthy work environments. These courses provide practical
                  strategies for supporting employee mental wellbeing and addressing mental health challenges in the
                  workplace.
                </p>
                <p className="text-calm-blue-600 mb-4">
                  Learn how to develop mental health policies, support employees in distress, facilitate return-to-work
                  processes, and create cultures that prioritize psychological safety and wellbeing.
                </p>
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-2 text-calm-blue-700">
                    <BookOpen className="h-5 w-5 text-calm-blue-600" />
                    <span>4 Courses</span>
                  </div>
                  <div className="flex items-center gap-2 text-calm-blue-700">
                    <Clock className="h-5 w-5 text-calm-blue-600" />
                    <span>27+ Hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-calm-blue-700">
                    <Users className="h-5 w-5 text-calm-blue-600" />
                    <span>6,200+ Students</span>
                  </div>
                </div>
              </div>
              <div className="bg-calm-blue-100 h-64 rounded-lg flex items-center justify-center">
                <Building className="h-24 w-24 text-calm-blue-600" />
              </div>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section className="py-12 bg-calm-blue-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-calm-blue-800 mb-8">Available Courses</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {courses.map((course) => (
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
                    <h3 className="text-xl font-semibold text-calm-blue-800 mb-2">{course.title}</h3>
                    <p className="text-calm-blue-600 mb-4">{course.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-calm-blue-500">{course.duration}</span>
                      <span className="text-sm text-calm-blue-500">{course.students} Students</span>
                    </div>
                    <Link href={`/courses/${course.id}`}>
                      <Button className="w-full bg-calm-blue-600 hover:bg-calm-blue-700">View Course</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="bg-calm-blue-800 text-white rounded-lg p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Transform Your Workplace Culture</h2>
                  <p className="text-calm-blue-100 max-w-[500px]">
                    Develop the skills to create mentally healthy work environments and support employee wellbeing.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/assessment">
                    <Button size="lg" className="bg-white text-calm-blue-800 hover:bg-calm-blue-50">
                      Take Assessment
                    </Button>
                  </Link>
                  <Link href="/courses">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-calm-blue-700">
                      Browse All Courses
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
