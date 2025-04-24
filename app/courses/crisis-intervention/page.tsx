import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Clock, Users, AlertTriangle } from "lucide-react"

// Sample courses for this category
const courses = [
  {
    id: 1,
    title: "Crisis Intervention Skills",
    description: "Develop essential skills for supporting individuals during mental health crises.",
    level: "Advanced",
    modules: 14,
    duration: "12 hours",
    students: 1876,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 2,
    title: "Suicide Prevention and Response",
    description: "Evidence-based approaches to identifying suicide risk and providing appropriate support.",
    level: "Advanced",
    modules: 10,
    duration: "8 hours",
    students: 2134,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 3,
    title: "De-escalation Techniques",
    description: "Practical strategies for de-escalating emotional and behavioral crises safely and effectively.",
    level: "Intermediate",
    modules: 8,
    duration: "7 hours",
    students: 1543,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 4,
    title: "Trauma-Informed Crisis Response",
    description: "Applying trauma-informed principles to crisis intervention and emergency mental health support.",
    level: "Advanced",
    modules: 12,
    duration: "10 hours",
    students: 987,
    image: "/placeholder.svg?height=200&width=400",
  },
]

export default function CrisisInterventionPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-calm-blue-50 py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-calm-blue-900">
                Crisis Intervention
              </h1>
              <p className="text-xl text-calm-blue-700 max-w-[700px]">
                Develop skills to respond effectively to mental health crises and provide immediate support.
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
                  Crisis Intervention courses provide advanced training for professionals who may encounter individuals
                  experiencing mental health crises. These courses focus on immediate response strategies, risk
                  assessment, de-escalation techniques, and safety planning.
                </p>
                <p className="text-calm-blue-600 mb-4">
                  Designed for healthcare providers, first responders, counselors, and others in helping roles, these
                  courses offer evidence-based approaches to supporting individuals during their most vulnerable
                  moments.
                </p>
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-2 text-calm-blue-700">
                    <BookOpen className="h-5 w-5 text-calm-blue-600" />
                    <span>4 Courses</span>
                  </div>
                  <div className="flex items-center gap-2 text-calm-blue-700">
                    <Clock className="h-5 w-5 text-calm-blue-600" />
                    <span>37+ Hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-calm-blue-700">
                    <Users className="h-5 w-5 text-calm-blue-600" />
                    <span>6,500+ Students</span>
                  </div>
                </div>
              </div>
              <div className="bg-calm-blue-100 h-64 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-24 w-24 text-calm-blue-600" />
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
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Be Prepared for Critical Moments</h2>
                  <p className="text-calm-blue-100 max-w-[500px]">
                    Develop the skills to respond effectively when someone is experiencing a mental health crisis.
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
