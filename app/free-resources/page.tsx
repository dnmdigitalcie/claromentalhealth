import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, FileSpreadsheet, Video, BookOpen } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample resources
const resources = {
  worksheets: [
    {
      id: 1,
      title: "Self-Care Assessment Tool",
      description: "Evaluate your current self-care practices and identify areas for improvement.",
      type: "Worksheet",
      category: "Self-Care",
      downloadable: true,
      icon: <FileSpreadsheet className="h-6 w-6 text-calm-blue-600" />,
    },
    {
      id: 2,
      title: "Stress Triggers Worksheet",
      description: "Identify your personal stress triggers and develop strategies to manage them.",
      type: "Worksheet",
      category: "Stress Management",
      downloadable: true,
      icon: <FileSpreadsheet className="h-6 w-6 text-calm-blue-600" />,
    },
    {
      id: 3,
      title: "Thought Record Journal",
      description: "Track and challenge negative thought patterns to improve mental wellbeing.",
      type: "Worksheet",
      category: "Cognitive Techniques",
      downloadable: true,
      icon: <FileSpreadsheet className="h-6 w-6 text-calm-blue-600" />,
    },
    {
      id: 4,
      title: "Weekly Mood Tracker",
      description: "Monitor your mood patterns to identify trends and improve self-awareness.",
      type: "Worksheet",
      category: "Self-Monitoring",
      downloadable: true,
      icon: <FileSpreadsheet className="h-6 w-6 text-calm-blue-600" />,
    },
  ],
  guides: [
    {
      id: 1,
      title: "Mental Health Conversation Guide",
      description: "A practical guide for having supportive conversations about mental health.",
      type: "PDF",
      category: "Communication",
      downloadable: true,
      icon: <FileText className="h-6 w-6 text-calm-blue-600" />,
    },
    {
      id: 2,
      title: "Crisis Response Protocol",
      description: "Step-by-step protocol for responding to mental health crises.",
      type: "PDF",
      category: "Crisis Support",
      downloadable: true,
      icon: <FileText className="h-6 w-6 text-calm-blue-600" />,
    },
    {
      id: 3,
      title: "Workplace Wellbeing Guide",
      description: "Strategies for promoting mental health in workplace settings.",
      type: "PDF",
      category: "Workplace Mental Health",
      downloadable: true,
      icon: <FileText className="h-6 w-6 text-calm-blue-600" />,
    },
    {
      id: 4,
      title: "Supporting Youth Mental Health",
      description: "A guide for parents and educators on supporting young people's mental wellbeing.",
      type: "PDF",
      category: "Youth Mental Health",
      downloadable: true,
      icon: <FileText className="h-6 w-6 text-calm-blue-600" />,
    },
  ],
  videos: [
    {
      id: 1,
      title: "Introduction to Mindfulness",
      description: "A beginner-friendly introduction to mindfulness practices for mental wellbeing.",
      duration: "12 minutes",
      category: "Mindfulness",
      icon: <Video className="h-6 w-6 text-calm-blue-600" />,
    },
    {
      id: 2,
      title: "Understanding Anxiety",
      description: "Learn about the nature of anxiety and simple techniques to manage anxious feelings.",
      duration: "15 minutes",
      category: "Anxiety",
      icon: <Video className="h-6 w-6 text-calm-blue-600" />,
    },
    {
      id: 3,
      title: "De-escalation Techniques",
      description: "Practical demonstration of techniques to de-escalate emotional situations.",
      duration: "18 minutes",
      category: "Crisis Support",
      icon: <Video className="h-6 w-6 text-calm-blue-600" />,
    },
    {
      id: 4,
      title: "Self-Compassion Practice",
      description: "Guided practice for developing greater self-compassion and reducing self-criticism.",
      duration: "10 minutes",
      category: "Self-Compassion",
      icon: <Video className="h-6 w-6 text-calm-blue-600" />,
    },
  ],
  articles: [
    {
      id: 1,
      title: "The Science of Stress and Relaxation",
      description: "Understanding how stress affects the body and mind, and evidence-based relaxation techniques.",
      readTime: "8 min read",
      category: "Stress Management",
      icon: <BookOpen className="h-6 w-6 text-calm-blue-600" />,
    },
    {
      id: 2,
      title: "Building Resilience in Challenging Times",
      description: "Strategies for developing psychological resilience during periods of difficulty and uncertainty.",
      readTime: "10 min read",
      category: "Resilience",
      icon: <BookOpen className="h-6 w-6 text-calm-blue-600" />,
    },
    {
      id: 3,
      title: "Sleep and Mental Health",
      description:
        "Exploring the relationship between sleep quality and mental wellbeing, with practical sleep hygiene tips.",
      readTime: "7 min read",
      category: "Sleep",
      icon: <BookOpen className="h-6 w-6 text-calm-blue-600" />,
    },
    {
      id: 4,
      title: "Digital Wellbeing in a Connected World",
      description: "How to maintain healthy boundaries with technology for better mental health.",
      readTime: "9 min read",
      category: "Digital Wellbeing",
      icon: <BookOpen className="h-6 w-6 text-calm-blue-600" />,
    },
  ],
}

export default function FreeResourcesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-calm-blue-50 py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-calm-blue-900">
                Free Mental Health Resources
              </h1>
              <p className="text-xl text-calm-blue-700 max-w-[700px]">
                Access our collection of free tools, guides, and materials to support mental wellbeing.
              </p>
            </div>
          </div>
        </section>

        {/* Resources Tabs Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="worksheets" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="worksheets">Worksheets</TabsTrigger>
                <TabsTrigger value="guides">Guides</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="articles">Articles</TabsTrigger>
              </TabsList>

              <TabsContent value="worksheets">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {resources.worksheets.map((resource) => (
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
                        <p className="text-calm-blue-600 mb-2">{resource.description}</p>
                        <div className="text-xs text-calm-blue-500 mb-4">{resource.category}</div>
                        <Button className="w-full bg-calm-blue-600 hover:bg-calm-blue-700">
                          <Download className="mr-2 h-4 w-4" /> Download Worksheet
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

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
                        <p className="text-calm-blue-600 mb-2">{resource.description}</p>
                        <div className="text-xs text-calm-blue-500 mb-4">{resource.category}</div>
                        <Button className="w-full bg-calm-blue-600 hover:bg-calm-blue-700">
                          <Download className="mr-2 h-4 w-4" /> Download Guide
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="videos">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {resources.videos.map((resource) => (
                    <Card key={resource.id} className="border-calm-blue-100 overflow-hidden">
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
                        <p className="text-calm-blue-600 mb-2">{resource.description}</p>
                        <div className="text-xs text-calm-blue-500 mb-4">{resource.category}</div>
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
                        <p className="text-calm-blue-600 mb-2">{resource.description}</p>
                        <div className="text-xs text-calm-blue-500 mb-4">{resource.category}</div>
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
        <section className="py-12 bg-calm-blue-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 max-w-[600px] mx-auto">
              <h2 className="text-2xl font-bold text-calm-blue-900">Get More Resources</h2>
              <p className="text-calm-blue-700">
                Subscribe to our newsletter to receive new mental health resources, articles, and tips directly in your
                inbox.
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

        {/* Resource Categories */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-calm-blue-800 mb-8 text-center">Browse by Category</h2>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {[
                "Anxiety",
                "Depression",
                "Stress Management",
                "Self-Care",
                "Mindfulness",
                "Sleep",
                "Workplace Mental Health",
                "Youth Mental Health",
                "Crisis Support",
                "Resilience",
                "Digital Wellbeing",
                "Communication",
              ].map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className="border-calm-blue-200 text-calm-blue-700 hover:bg-calm-blue-50"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
