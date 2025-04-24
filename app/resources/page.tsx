import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, ExternalLink, BookOpen, Video, FileSpreadsheet } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample resources
const resources = {
  guides: [
    {
      id: 1,
      title: "Mental Health Conversation Guide",
      description: "A practical guide for having supportive conversations about mental health.",
      type: "PDF",
      icon: <FileText className="h-6 w-6 text-calm-blue-600" />,
      downloadable: true,
    },
    {
      id: 2,
      title: "Crisis Response Protocol",
      description: "Step-by-step protocol for responding to mental health crises.",
      type: "PDF",
      icon: <FileText className="h-6 w-6 text-calm-blue-600" />,
      downloadable: true,
    },
    {
      id: 3,
      title: "Self-Care Assessment Tool",
      description: "Evaluate your current self-care practices and identify areas for improvement.",
      type: "Worksheet",
      icon: <FileSpreadsheet className="h-6 w-6 text-calm-blue-600" />,
      downloadable: true,
    },
  ],
  videos: [
    {
      id: 1,
      title: "Understanding Trauma-Informed Care",
      description: "An introduction to trauma-informed approaches in mental health support.",
      duration: "15 minutes",
      icon: <Video className="h-6 w-6 text-calm-blue-600" />,
    },
    {
      id: 2,
      title: "De-escalation Techniques",
      description: "Practical demonstration of techniques to de-escalate emotional situations.",
      duration: "22 minutes",
      icon: <Video className="h-6 w-6 text-calm-blue-600" />,
    },
    {
      id: 3,
      title: "Mindfulness Practices for Professionals",
      description: "Simple mindfulness exercises to incorporate into your professional practice.",
      duration: "18 minutes",
      icon: <Video className="h-6 w-6 text-calm-blue-600" />,
    },
  ],
  articles: [
    {
      id: 1,
      title: "The Impact of Digital Technology on Mental Health",
      description: "Exploring the relationship between technology use and mental wellbeing.",
      readTime: "8 min read",
      icon: <BookOpen className="h-6 w-6 text-calm-blue-600" />,
    },
    {
      id: 2,
      title: "Cultural Considerations in Mental Health Support",
      description: "Understanding how cultural factors influence mental health experiences and support needs.",
      readTime: "12 min read",
      icon: <BookOpen className="h-6 w-6 text-calm-blue-600" />,
    },
    {
      id: 3,
      title: "Supporting Colleagues Through Mental Health Challenges",
      description: "Best practices for creating supportive workplace environments.",
      readTime: "10 min read",
      icon: <BookOpen className="h-6 w-6 text-calm-blue-600" />,
    },
  ],
}

export default function ResourcesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-calm-blue-50 py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-calm-blue-900">
                Mental Health Resources
              </h1>
              <p className="text-xl text-calm-blue-700 max-w-[700px]">
                Free tools, guides, and materials to support your mental health practice and knowledge.
              </p>
            </div>
          </div>
        </section>

        {/* Resources Tabs Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="guides" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="guides">Guides & Worksheets</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="articles">Articles</TabsTrigger>
              </TabsList>

              <TabsContent value="guides">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {resources.guides.map((resource) => (
                    <Card key={resource.id} className="border-calm-blue-100">
                      <CardContent className="p-6">
                        <div className="h-12 w-12 rounded-full bg-calm-blue-50 flex items-center justify-center mb-4">
                          {resource.icon}
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-semibold text-calm-blue-800">{resource.title}</h3>
                          <span className="text-xs font-medium bg-calm-blue-100 text-calm-blue-700 px-2 py-1 rounded-full">
                            {resource.type}
                          </span>
                        </div>
                        <p className="text-calm-blue-600 mb-6">{resource.description}</p>
                        <Button className="w-full bg-calm-blue-600 hover:bg-calm-blue-700">
                          {resource.downloadable ? (
                            <>
                              <Download className="mr-2 h-4 w-4" /> Download Resource
                            </>
                          ) : (
                            <>
                              <ExternalLink className="mr-2 h-4 w-4" /> View Resource
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="videos">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {resources.videos.map((resource) => (
                    <Card key={resource.id} className="border-calm-blue-100">
                      <div className="aspect-video w-full bg-calm-blue-100 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-16 w-16 rounded-full bg-calm-blue-600 flex items-center justify-center">
                            <div className="h-0 w-0 border-y-8 border-y-transparent border-l-12 border-l-white ml-1"></div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-semibold text-calm-blue-800">{resource.title}</h3>
                          <span className="text-xs font-medium text-calm-blue-600">{resource.duration}</span>
                        </div>
                        <p className="text-calm-blue-600 mb-6">{resource.description}</p>
                        <Button className="w-full bg-calm-blue-600 hover:bg-calm-blue-700">
                          <Video className="mr-2 h-4 w-4" /> Watch Video
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="articles">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {resources.articles.map((resource) => (
                    <Card key={resource.id} className="border-calm-blue-100">
                      <CardContent className="p-6">
                        <div className="h-12 w-12 rounded-full bg-calm-blue-50 flex items-center justify-center mb-4">
                          {resource.icon}
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-semibold text-calm-blue-800">{resource.title}</h3>
                          <span className="text-xs font-medium text-calm-blue-500">{resource.readTime}</span>
                        </div>
                        <p className="text-calm-blue-600 mb-6">{resource.description}</p>
                        <Button className="w-full bg-calm-blue-600 hover:bg-calm-blue-700">
                          <BookOpen className="mr-2 h-4 w-4" /> Read Article
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-calm-blue-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 max-w-[600px] mx-auto">
              <h2 className="text-2xl font-bold text-calm-blue-900">Stay Updated</h2>
              <p className="text-calm-blue-700">
                Subscribe to our newsletter to receive the latest mental health resources, research updates, and course
                announcements.
              </p>
              <div className="flex w-full max-w-md gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 rounded-md border border-calm-blue-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-calm-blue-500"
                />
                <Button className="bg-calm-blue-600 hover:bg-calm-blue-700">Subscribe</Button>
              </div>
              <p className="text-xs text-calm-blue-500">We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
