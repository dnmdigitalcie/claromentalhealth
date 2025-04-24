import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Search, HelpCircle, FileText, MessageSquare, Mail, Phone } from "lucide-react"

// Sample FAQs
const faqs = [
  {
    question: "How do I reset my password?",
    answer:
      "To reset your password, click on the 'Forgot Password' link on the login page. You'll receive an email with instructions to create a new password. If you don't receive the email, please check your spam folder or contact support.",
  },
  {
    question: "Can I access courses on mobile devices?",
    answer:
      "Yes, our platform is fully responsive and works on all devices including smartphones and tablets. You can access your courses through any modern web browser or download our mobile app for iOS and Android.",
  },
  {
    question: "How long do I have access to a course after purchasing?",
    answer:
      "Once you purchase a course, you have lifetime access to the course materials. You can revisit the content whenever you need to refresh your knowledge.",
  },
  {
    question: "Are the courses self-paced or do they have specific start dates?",
    answer:
      "All our courses are self-paced, allowing you to learn at your own convenience. There are no specific start dates, so you can begin immediately after enrollment.",
  },
  {
    question: "Do you offer certificates upon course completion?",
    answer:
      "Yes, we provide digital certificates for all completed courses. These can be downloaded from your dashboard and shared on professional platforms like LinkedIn.",
  },
  {
    question: "Can I get a refund if I'm not satisfied with a course?",
    answer:
      "We offer a 30-day money-back guarantee for all courses. If you're not satisfied with your purchase, contact our support team within 30 days of enrollment for a full refund.",
  },
  {
    question: "How do I report technical issues with the platform?",
    answer:
      "For technical issues, please email support@claromentalhealth.com with details of the problem you're experiencing. Include screenshots if possible. Our team typically responds within 24 hours.",
  },
  {
    question: "Are the courses accredited or recognized by professional organizations?",
    answer:
      "Many of our courses are accredited by relevant professional organizations. Check the specific course page for accreditation details and continuing education credits offered.",
  },
]

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-calm-blue-50 py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-calm-blue-900">
                Support Center
              </h1>
              <p className="text-xl text-calm-blue-700 max-w-[700px]">
                Find answers to common questions and get the help you need.
              </p>
              <div className="relative w-full max-w-2xl mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-calm-blue-400" />
                <Input
                  placeholder="Search for help articles..."
                  className="pl-10 py-6 text-lg border-calm-blue-200 focus:border-calm-blue-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Support Options */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-calm-blue-800 mb-8 text-center">How Can We Help You?</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-calm-blue-100">
                <CardHeader className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-calm-blue-100 flex items-center justify-center mb-2">
                    <HelpCircle className="h-6 w-6 text-calm-blue-600" />
                  </div>
                  <CardTitle className="text-calm-blue-800">FAQs</CardTitle>
                  <CardDescription>Find answers to commonly asked questions</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="bg-calm-blue-600 hover:bg-calm-blue-700">Browse FAQs</Button>
                </CardContent>
              </Card>

              <Card className="border-calm-blue-100">
                <CardHeader className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-calm-blue-100 flex items-center justify-center mb-2">
                    <FileText className="h-6 w-6 text-calm-blue-600" />
                  </div>
                  <CardTitle className="text-calm-blue-800">Knowledge Base</CardTitle>
                  <CardDescription>Detailed guides and tutorials</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="bg-calm-blue-600 hover:bg-calm-blue-700">Explore Guides</Button>
                </CardContent>
              </Card>

              <Card className="border-calm-blue-100">
                <CardHeader className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-calm-blue-100 flex items-center justify-center mb-2">
                    <MessageSquare className="h-6 w-6 text-calm-blue-600" />
                  </div>
                  <CardTitle className="text-calm-blue-800">Contact Support</CardTitle>
                  <CardDescription>Get personalized assistance</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="bg-calm-blue-600 hover:bg-calm-blue-700">Contact Us</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-12 bg-calm-blue-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-calm-blue-800 mb-8 text-center">Frequently Asked Questions</h2>
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <div className="space-y-4">
                  {faqs.slice(0, 4).map((faq, index) => (
                    <Card key={index} className="border-calm-blue-100">
                      <CardHeader>
                        <CardTitle className="text-lg text-calm-blue-800">{faq.question}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-calm-blue-600">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="courses">
                <div className="space-y-4">
                  {faqs.slice(2, 6).map((faq, index) => (
                    <Card key={index} className="border-calm-blue-100">
                      <CardHeader>
                        <CardTitle className="text-lg text-calm-blue-800">{faq.question}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-calm-blue-600">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              {/* Similar TabsContent for other tabs */}
            </Tabs>
            <div className="mt-8 text-center">
              <Link href="/faqs">
                <Button variant="outline" className="border-calm-blue-200 text-calm-blue-700 hover:bg-calm-blue-50">
                  View All FAQs
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-calm-blue-800 mb-8 text-center">Still Need Help?</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-calm-blue-100">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-calm-blue-100 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-calm-blue-600" />
                    </div>
                    <CardTitle className="text-calm-blue-800">Email Support</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-calm-blue-600 mb-4">Send us an email and we'll get back to you within 24 hours.</p>
                  <p className="font-medium text-calm-blue-800">support@claromentalhealth.com</p>
                </CardContent>
              </Card>

              <Card className="border-calm-blue-100">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-calm-blue-100 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-calm-blue-600" />
                    </div>
                    <CardTitle className="text-calm-blue-800">Phone Support</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-calm-blue-600 mb-4">Available Monday to Friday, 9:00 AM - 5:00 PM (PST).</p>
                  <p className="font-medium text-calm-blue-800">+1 (555) 123-4567</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-8 text-center">
              <Link href="/contact">
                <Button className="bg-calm-blue-600 hover:bg-calm-blue-700">Contact Us</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
