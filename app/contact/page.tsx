import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-calm-blue-50 py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-calm-blue-900">
                Contact Us
              </h1>
              <p className="text-xl text-calm-blue-700 max-w-[700px]">
                Have questions or need assistance? We're here to help.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-calm-blue-100">
                <CardHeader>
                  <CardTitle className="text-calm-blue-800">Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" placeholder="Enter your first name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" placeholder="Enter your last name" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email address" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input id="phone" placeholder="Enter your phone number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="courses">Course Information</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="partnerships">Partnership Opportunities</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Enter your message" rows={5} />
                    </div>
                    <Button className="w-full bg-calm-blue-600 hover:bg-calm-blue-700">Send Message</Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-calm-blue-800 mb-4">Contact Information</h2>
                  <p className="text-calm-blue-600 mb-6">
                    You can reach out to us through the contact form or using the information below.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-calm-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-calm-blue-800">Email</h3>
                        <p className="text-calm-blue-600">support@claromentalhealth.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-calm-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-calm-blue-800">Phone</h3>
                        <p className="text-calm-blue-600">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-calm-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-calm-blue-800">Address</h3>
                        <p className="text-calm-blue-600">
                          123 Wellness Street
                          <br />
                          Suite 456
                          <br />
                          San Francisco, CA 94103
                          <br />
                          United States
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-calm-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-calm-blue-800">Hours</h3>
                        <p className="text-calm-blue-600">
                          Monday - Friday: 9:00 AM - 5:00 PM (PST)
                          <br />
                          Saturday - Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="border-calm-blue-100">
                  <CardHeader>
                    <CardTitle className="text-calm-blue-800">Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium text-calm-blue-800">How do I enroll in a course?</h3>
                      <p className="text-calm-blue-600">
                        You can browse our courses and enroll directly through our website. Simply create an account,
                        select your desired course, and follow the enrollment instructions.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-calm-blue-800">
                        Are certificates provided upon course completion?
                      </h3>
                      <p className="text-calm-blue-600">
                        Yes, we provide digital certificates for all completed courses. These can be downloaded from
                        your dashboard and shared on professional platforms.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-calm-blue-800">How can I request technical support?</h3>
                      <p className="text-calm-blue-600">
                        For technical issues, please email support@claromentalhealth.com with details of the problem
                        you're experiencing. Our team typically responds within 24 hours.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-calm-blue-200 text-calm-blue-700 hover:bg-calm-blue-50"
                    >
                      View All FAQs
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 bg-calm-blue-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-calm-blue-800 mb-8 text-center">Our Location</h2>
            <div className="h-96 bg-white rounded-lg border border-calm-blue-100 flex items-center justify-center">
              <div className="text-calm-blue-600 text-lg font-medium">Map Placeholder</div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
