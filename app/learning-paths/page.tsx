import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Users, BookOpen, Brain, CheckCircle } from "lucide-react"

// Sample learning paths
const learningPaths = [
  {
    id: 1,
    title: "Mental Health Professional",
    description: "For therapists, counselors, and clinical professionals seeking to enhance their practice.",
    icon: <Users className="h-8 w-8 text-calm-blue-600" />,
    courses: 12,
    hours: 48,
    features: [
      "Evidence-based therapeutic approaches",
      "Advanced assessment techniques",
      "Clinical supervision skills",
      "Professional ethics and boundaries",
    ],
  },
  {
    id: 2,
    title: "Workplace Mental Health Leader",
    description: "For HR professionals and managers supporting mental health in organizational settings.",
    icon: <BookOpen className="h-8 w-8 text-calm-blue-600" />,
    courses: 8,
    hours: 32,
    features: [
      "Creating psychologically safe workplaces",
      "Mental health policy development",
      "Supporting employees in distress",
      "Return-to-work planning",
    ],
  },
  {
    id: 3,
    title: "Youth Mental Health Supporter",
    description: "For educators, parents, and youth workers supporting young people's mental wellbeing.",
    icon: <Brain className="h-8 w-8 text-calm-blue-600" />,
    courses: 10,
    hours: 40,
    features: [
      "Adolescent development and mental health",
      "Early intervention strategies",
      "Digital wellbeing for youth",
      "Supporting neurodiversity",
    ],
  },
]

export default function LearningPathsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-calm-blue-50 py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-calm-blue-900">
                Learning Paths
              </h1>
              <p className="text-xl text-calm-blue-700 max-w-[700px]">
                Discover structured learning journeys tailored to your professional goals and experience level.
              </p>
            </div>
          </div>
        </section>

        {/* Learning Paths Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-3">
              {learningPaths.map((path) => (
                <Card key={path.id} className="border-calm-blue-100">
                  <CardContent className="p-6">
                    <div className="h-16 w-16 rounded-full bg-calm-blue-100 flex items-center justify-center mb-4">
                      {path.icon}
                    </div>
                    <h2 className="text-2xl font-semibold text-calm-blue-800 mb-2">{path.title}</h2>
                    <p className="text-calm-blue-600 mb-4">{path.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-calm-blue-500">{path.courses} Courses</span>
                      <span className="text-sm text-calm-blue-500">{path.hours} Hours</span>
                    </div>
                    <div className="space-y-2 mb-6">
                      {path.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-calm-blue-600 mr-2" />
                          <span className="text-calm-blue-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link href={`/learning-paths/${path.id}`}>
                      <Button className="w-full bg-calm-blue-600 hover:bg-calm-blue-700">Explore Path</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Assessment CTA Section */}
        <section className="py-16 bg-calm-blue-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-calm-blue-900 mb-4">Not Sure Where to Start?</h2>
                <p className="text-calm-blue-700 text-lg mb-6">
                  Take our guided assessment to discover the perfect learning path for your specific goals and
                  experience level.
                </p>
                <Link href="/assessment">
                  <Button size="lg" className="bg-calm-blue-600 hover:bg-calm-blue-700">
                    Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-sm border border-calm-blue-100">
                <h3 className="text-xl font-semibold text-calm-blue-800 mb-4">Our Assessment Helps You:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-calm-blue-600 mr-2 mt-0.5" />
                    <span className="text-calm-blue-700">Identify your current skill level and knowledge gaps</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-calm-blue-600 mr-2 mt-0.5" />
                    <span className="text-calm-blue-700">Clarify your professional development goals</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-calm-blue-600 mr-2 mt-0.5" />
                    <span className="text-calm-blue-700">Receive personalized course recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-calm-blue-600 mr-2 mt-0.5" />
                    <span className="text-calm-blue-700">Create a structured learning plan with clear milestones</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
