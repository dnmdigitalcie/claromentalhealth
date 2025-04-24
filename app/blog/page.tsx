import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarIcon, Clock, User, ArrowRight } from "lucide-react"

// Sample blog posts
const blogPosts = [
  {
    id: 1,
    title: "Understanding the Link Between Physical and Mental Health",
    excerpt:
      "Exploring the bidirectional relationship between physical health and mental wellbeing, and strategies for improving both.",
    author: "Dr. Sarah Johnson",
    date: "June 15, 2023",
    readTime: "8 min read",
    category: "Wellbeing",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 2,
    title: "The Role of Sleep in Mental Health",
    excerpt:
      "How sleep affects mental health and practical tips for improving sleep quality to support psychological wellbeing.",
    author: "Michael Chen, MSc",
    date: "May 28, 2023",
    readTime: "6 min read",
    category: "Self-Care",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 3,
    title: "Supporting a Loved One with Depression",
    excerpt:
      "Practical guidance for providing effective support to someone experiencing depression while maintaining your own wellbeing.",
    author: "Dr. Amara Okafor",
    date: "May 12, 2023",
    readTime: "10 min read",
    category: "Support Strategies",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 4,
    title: "Mindfulness Practices for Everyday Life",
    excerpt:
      "Simple mindfulness techniques that can be incorporated into daily routines to reduce stress and improve mental clarity.",
    author: "James Rodriguez, LMHC",
    date: "April 30, 2023",
    readTime: "7 min read",
    category: "Mindfulness",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 5,
    title: "Digital Detox: Finding Balance in a Connected World",
    excerpt:
      "Strategies for managing digital consumption and creating healthy boundaries with technology for better mental health.",
    author: "Emma Wilson, PhD",
    date: "April 15, 2023",
    readTime: "9 min read",
    category: "Digital Wellbeing",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 6,
    title: "The Science of Happiness: What Research Tells Us",
    excerpt:
      "Exploring the latest research on happiness and wellbeing, and evidence-based strategies for increasing life satisfaction.",
    author: "Dr. Thomas Lee",
    date: "March 28, 2023",
    readTime: "12 min read",
    category: "Research",
    image: "/placeholder.svg?height=200&width=400",
  },
]

// Blog categories
const categories = [
  "All Categories",
  "Wellbeing",
  "Self-Care",
  "Support Strategies",
  "Mindfulness",
  "Digital Wellbeing",
  "Research",
  "Workplace Mental Health",
  "Youth Mental Health",
]

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-calm-blue-50 py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-calm-blue-900">
                Mental Health Blog
              </h1>
              <p className="text-xl text-calm-blue-700 max-w-[700px]">
                Insights, research, and practical advice for understanding and improving mental wellbeing.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 border-b">
          <div className="container px-4 md:px-6">
            <div className="overflow-x-auto">
              <div className="flex space-x-2 min-w-max pb-2">
                {categories.map((category, index) => (
                  <Button
                    key={index}
                    variant={index === 0 ? "default" : "outline"}
                    className={index === 0 ? "bg-calm-blue-600" : "border-calm-blue-200 text-calm-blue-700"}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-calm-blue-800 mb-8">Featured Post</h2>
            <Card className="border-calm-blue-100 overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="bg-calm-blue-100 aspect-video md:aspect-auto md:h-full relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-calm-blue-600 font-medium">Featured Image</span>
                  </div>
                </div>
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-2 text-calm-blue-600 text-sm mb-2">
                    <span className="bg-calm-blue-100 px-2 py-1 rounded-full">Research</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> 12 min read
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-calm-blue-900 mb-4">
                    The Science of Happiness: What Research Tells Us
                  </h3>
                  <p className="text-calm-blue-700 mb-6">
                    Exploring the latest research on happiness and wellbeing, and evidence-based strategies for
                    increasing life satisfaction. This comprehensive article examines the psychological, neurological,
                    and social factors that contribute to happiness.
                  </p>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-10 w-10 rounded-full bg-calm-blue-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-calm-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-calm-blue-800">Dr. Thomas Lee</p>
                      <p className="text-sm text-calm-blue-600">March 28, 2023</p>
                    </div>
                  </div>
                  <Link href="/blog/6">
                    <Button className="bg-calm-blue-600 hover:bg-calm-blue-700">
                      Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>

        {/* Latest Posts */}
        <section className="py-12 bg-calm-blue-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-calm-blue-800 mb-8">Latest Posts</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.slice(0, 5).map((post) => (
                <Card key={post.id} className="border-calm-blue-100 overflow-hidden">
                  <div className="aspect-video w-full bg-calm-blue-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-calm-blue-600 font-medium">Post Image</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium bg-calm-blue-100 text-calm-blue-700 px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-calm-blue-600 flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-calm-blue-800 mb-2">{post.title}</h3>
                    <p className="text-calm-blue-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-calm-blue-200 flex items-center justify-center">
                          <User className="h-4 w-4 text-calm-blue-600" />
                        </div>
                        <span className="text-sm text-calm-blue-700">{post.author}</span>
                      </div>
                      <span className="text-xs text-calm-blue-500 flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" /> {post.date}
                      </span>
                    </div>
                    <Link href={`/blog/${post.id}`} className="block mt-4">
                      <Button
                        variant="outline"
                        className="w-full border-calm-blue-200 text-calm-blue-700 hover:bg-calm-blue-50"
                      >
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Button variant="outline" className="border-calm-blue-200 text-calm-blue-700 hover:bg-calm-blue-50">
                Load More Articles
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="bg-calm-blue-800 text-white rounded-lg p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
                  <p className="text-calm-blue-100 max-w-[500px]">
                    Get the latest mental health insights, research updates, and practical tips delivered to your inbox.
                  </p>
                </div>
                <div className="w-full md:w-auto">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="px-4 py-2 rounded-md w-full sm:w-64 text-calm-blue-800"
                    />
                    <Button className="bg-white text-calm-blue-800 hover:bg-calm-blue-50">Subscribe</Button>
                  </div>
                  <p className="text-xs text-calm-blue-200 mt-2">We respect your privacy. Unsubscribe at any time.</p>
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
