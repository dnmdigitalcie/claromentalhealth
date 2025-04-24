import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Users, Brain } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-calm-blue-50 py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-calm-blue-900">
                About Claro Mental Health
              </h1>
              <p className="text-xl text-calm-blue-700 max-w-[700px]">
                Our mission is to improve mental health support through evidence-based education and training.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold text-calm-blue-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-calm-blue-700">
                  <p>
                    Claro Mental Health was founded in 2020 by a team of mental health professionals who recognized the
                    need for accessible, high-quality education in mental health support.
                  </p>
                  <p>
                    We saw that many professionals wanted to better support mental health but lacked the specific
                    training and confidence to do so effectively. Our platform bridges this gap by providing
                    evidence-based, practical training that can be applied in real-world settings.
                  </p>
                  <p>
                    Today, Claro serves thousands of professionals across healthcare, education, workplace settings, and
                    community support roles, equipping them with the knowledge and skills to make a positive difference
                    in mental health.
                  </p>
                </div>
              </div>
              <div className="bg-calm-blue-100 h-80 rounded-lg flex items-center justify-center">
                <div className="text-calm-blue-600 text-lg font-medium">Team Image Placeholder</div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 bg-calm-blue-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-calm-blue-900 mb-12 text-center">Our Values</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-calm-blue-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-calm-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-calm-blue-800 mb-2">Evidence-Based</h3>
                <p className="text-calm-blue-600">
                  We ground all our educational content in the latest research and best practices in mental health.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-calm-blue-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-calm-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-calm-blue-800 mb-2">Inclusive</h3>
                <p className="text-calm-blue-600">
                  We recognize diversity in mental health experiences and ensure our content is culturally responsive
                  and accessible.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-calm-blue-100 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-calm-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-calm-blue-800 mb-2">Practical</h3>
                <p className="text-calm-blue-600">
                  We focus on applicable skills and knowledge that can be immediately implemented in real-world
                  settings.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-calm-blue-900 mb-12 text-center">Our Team</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Team Member 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-calm-blue-100 mb-4 flex items-center justify-center">
                  <span className="text-calm-blue-600">Photo</span>
                </div>
                <h3 className="text-xl font-semibold text-calm-blue-800">Dr. Sarah Johnson</h3>
                <p className="text-calm-blue-600 font-medium">Founder & Clinical Director</p>
                <p className="text-calm-blue-500 mt-2">
                  Clinical Psychologist with 15+ years of experience in mental health education.
                </p>
              </div>
              {/* Team Member 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-calm-blue-100 mb-4 flex items-center justify-center">
                  <span className="text-calm-blue-600">Photo</span>
                </div>
                <h3 className="text-xl font-semibold text-calm-blue-800">Michael Chen</h3>
                <p className="text-calm-blue-600 font-medium">Head of Curriculum</p>
                <p className="text-calm-blue-500 mt-2">
                  Specialist in educational psychology and mental health training program development.
                </p>
              </div>
              {/* Team Member 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-calm-blue-100 mb-4 flex items-center justify-center">
                  <span className="text-calm-blue-600">Photo</span>
                </div>
                <h3 className="text-xl font-semibold text-calm-blue-800">Dr. Amara Okafor</h3>
                <p className="text-calm-blue-600 font-medium">Research Director</p>
                <p className="text-calm-blue-500 mt-2">
                  Leads our evidence-based approach and ensures content reflects current research.
                </p>
              </div>
              {/* Team Member 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-calm-blue-100 mb-4 flex items-center justify-center">
                  <span className="text-calm-blue-600">Photo</span>
                </div>
                <h3 className="text-xl font-semibold text-calm-blue-800">James Rodriguez</h3>
                <p className="text-calm-blue-600 font-medium">Community Engagement</p>
                <p className="text-calm-blue-500 mt-2">
                  Focuses on building our learning community and supporting student success.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-16 bg-calm-blue-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-calm-blue-900 mb-6 text-center">Our Partners</h2>
            <p className="text-calm-blue-700 text-center max-w-[700px] mx-auto mb-12">
              We collaborate with leading organizations to ensure our content meets the highest standards and addresses
              real-world needs.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="h-24 bg-white rounded-lg flex items-center justify-center">
                <span className="text-calm-blue-400 font-medium">Partner Logo</span>
              </div>
              <div className="h-24 bg-white rounded-lg flex items-center justify-center">
                <span className="text-calm-blue-400 font-medium">Partner Logo</span>
              </div>
              <div className="h-24 bg-white rounded-lg flex items-center justify-center">
                <span className="text-calm-blue-400 font-medium">Partner Logo</span>
              </div>
              <div className="h-24 bg-white rounded-lg flex items-center justify-center">
                <span className="text-calm-blue-400 font-medium">Partner Logo</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="bg-calm-blue-800 text-white rounded-lg p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
                  <p className="text-calm-blue-100 max-w-[500px]">
                    Start your mental health learning journey today and make a positive impact in your professional
                    practice.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signup">
                    <Button size="lg" className="bg-white text-calm-blue-800 hover:bg-calm-blue-50">
                      Sign Up Now
                    </Button>
                  </Link>
                  <Link href="/courses">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-calm-blue-700">
                      Browse Courses
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
