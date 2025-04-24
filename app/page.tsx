import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-calm-blue-50 to-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl font-bold text-calm-blue-900 md:text-5xl lg:text-6xl">
              Your Journey to Better Mental Health Starts Here
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-calm-blue-700">
              Claro Mental Health provides evidence-based courses, tools, and resources to help you understand and
              improve your mental wellbeing.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link href="/signup">
                <Button size="lg" className="bg-calm-blue-600 text-white hover:bg-calm-blue-700">
                  Get Started
                </Button>
              </Link>
              <Link href="/courses">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-calm-blue-600 text-calm-blue-600 hover:bg-calm-blue-50"
                >
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-calm-blue-900">
              How Claro Mental Health Helps You
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-4 text-xl font-semibold text-calm-blue-800">Learn</h3>
                <p className="text-calm-blue-600">
                  Access evidence-based courses designed by mental health professionals to help you understand and
                  manage your mental health.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-4 text-xl font-semibold text-calm-blue-800">Track</h3>
                <p className="text-calm-blue-600">
                  Monitor your mood, sleep, and other wellness metrics to identify patterns and track your progress over
                  time.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-4 text-xl font-semibold text-calm-blue-800">Connect</h3>
                <p className="text-calm-blue-600">
                  Join a supportive community of individuals on similar journeys and connect with mental health
                  professionals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-calm-blue-900 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold">Ready to Start Your Mental Health Journey?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg">
              Join thousands of others who have taken the first step toward better mental wellbeing with Claro Mental
              Health.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-white text-calm-blue-900 hover:bg-gray-100">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
