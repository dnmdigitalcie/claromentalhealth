import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Download, ExternalLink, FileText, Search, Filter } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

// Sample research papers
const researchPapers = [
  {
    id: 1,
    title: "The Impact of Digital Mental Health Interventions on Treatment Outcomes",
    authors: "Johnson, S., Chen, M., & Okafor, A.",
    journal: "Journal of Digital Mental Health",
    year: 2023,
    abstract:
      "This systematic review examines the efficacy of digital mental health interventions across various mental health conditions, comparing outcomes with traditional face-to-face therapy approaches.",
    keywords: ["digital interventions", "telehealth", "treatment outcomes", "systematic review"],
    type: "Systematic Review",
    downloadable: true,
  },
  {
    id: 2,
    title: "Workplace Mental Health Programs: A Meta-Analysis of Effectiveness",
    authors: "Rodriguez, J., Wilson, E., & Lee, T.",
    journal: "Occupational Health Psychology",
    year: 2022,
    abstract:
      "This meta-analysis evaluates the effectiveness of workplace mental health programs in reducing symptoms of anxiety and depression, improving productivity, and decreasing absenteeism.",
    keywords: ["workplace mental health", "organizational psychology", "meta-analysis", "employee wellbeing"],
    type: "Meta-Analysis",
    downloadable: true,
  },
  {
    id: 3,
    title: "Early Intervention in Youth Mental Health: Long-term Outcomes",
    authors: "Patel, V., Smith, K., & Nguyen, H.",
    journal: "Journal of Adolescent Mental Health",
    year: 2023,
    abstract:
      "This longitudinal study follows youth who received early mental health interventions, examining outcomes over a 10-year period to assess long-term effectiveness.",
    keywords: ["youth mental health", "early intervention", "longitudinal study", "prevention"],
    type: "Longitudinal Study",
    downloadable: false,
  },
  {
    id: 4,
    title: "Cultural Adaptations of Cognitive Behavioral Therapy: A Comparative Analysis",
    authors: "Garcia, L., Kim, J., & Abadi, M.",
    journal: "International Journal of Psychological Therapies",
    year: 2022,
    abstract:
      "This study compares the effectiveness of culturally adapted cognitive behavioral therapy protocols across different cultural contexts and mental health conditions.",
    keywords: ["cultural adaptation", "cognitive behavioral therapy", "cultural competence", "treatment efficacy"],
    type: "Comparative Analysis",
    downloadable: true,
  },
  {
    id: 5,
    title: "The Neurobiological Mechanisms of Mindfulness Meditation",
    authors: "Thompson, R., Yamada, S., & Cohen, D.",
    journal: "Neuroscience & Behavioral Reviews",
    year: 2023,
    abstract:
      "This review examines the neurobiological mechanisms underlying the effects of mindfulness meditation on stress reduction, emotion regulation, and attention.",
    keywords: ["mindfulness", "neurobiology", "meditation", "neuroimaging", "stress reduction"],
    type: "Literature Review",
    downloadable: true,
  },
  {
    id: 6,
    title: "Digital Phenotyping in Mental Health: Ethical Considerations and Clinical Applications",
    authors: "Blackwell, T., Ramirez, E., & Joshi, P.",
    journal: "Ethics in Mental Health Technology",
    year: 2023,
    abstract:
      "This paper explores the ethical implications of digital phenotyping in mental health assessment and monitoring, and proposes a framework for responsible implementation.",
    keywords: ["digital phenotyping", "ethics", "mental health technology", "privacy", "clinical applications"],
    type: "Position Paper",
    downloadable: false,
  },
]

export default function ResearchPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-calm-blue-50 py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-calm-blue-900">
                Mental Health Research
              </h1>
              <p className="text-xl text-calm-blue-700 max-w-[700px]">
                Explore the latest research and evidence-based insights in mental health.
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-calm-blue-400" />
                <Input
                  placeholder="Search research papers..."
                  className="pl-10 border-calm-blue-200 focus:border-calm-blue-500"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button variant="outline" className="border-calm-blue-200 text-calm-blue-700">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
                <Button variant="outline" className="border-calm-blue-200 text-calm-blue-700">
                  Year <span className="mx-1">▼</span>
                </Button>
                <Button variant="outline" className="border-calm-blue-200 text-calm-blue-700">
                  Type <span className="mx-1">▼</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Research Papers Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="all">All Research</TabsTrigger>
                <TabsTrigger value="reviews">Reviews & Meta-Analyses</TabsTrigger>
                <TabsTrigger value="studies">Original Studies</TabsTrigger>
                <TabsTrigger value="position">Position Papers</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="space-y-6">
                  {researchPapers.map((paper) => (
                    <Card key={paper.id} className="border-calm-blue-100">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold text-calm-blue-800">{paper.title}</h3>
                          <span className="text-xs font-medium bg-calm-blue-100 text-calm-blue-700 px-2 py-1 rounded-full whitespace-nowrap ml-4">
                            {paper.type}
                          </span>
                        </div>
                        <p className="text-calm-blue-700 mb-2">
                          <span className="font-medium">Authors:</span> {paper.authors}
                        </p>
                        <p className="text-calm-blue-700 mb-4">
                          <span className="font-medium">Published in:</span> {paper.journal}, {paper.year}
                        </p>
                        <p className="text-calm-blue-600 mb-4">{paper.abstract}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {paper.keywords.map((keyword, index) => (
                            <span
                              key={index}
                              className="text-xs bg-calm-blue-50 text-calm-blue-600 px-2 py-1 rounded-full"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" className="border-calm-blue-200 text-calm-blue-700">
                            <ExternalLink className="mr-2 h-4 w-4" /> View Abstract
                          </Button>
                          <Button
                            className={
                              paper.downloadable
                                ? "bg-calm-blue-600 hover:bg-calm-blue-700"
                                : "bg-calm-blue-300 cursor-not-allowed"
                            }
                            disabled={!paper.downloadable}
                          >
                            <Download className="mr-2 h-4 w-4" />{" "}
                            {paper.downloadable ? "Download PDF" : "Request Access"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-8 flex justify-center">
                  <Button variant="outline" className="border-calm-blue-200 text-calm-blue-700 hover:bg-calm-blue-50">
                    Load More Papers
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="space-y-6">
                  {researchPapers
                    .filter((paper) => ["Systematic Review", "Meta-Analysis", "Literature Review"].includes(paper.type))
                    .map((paper) => (
                      <Card key={paper.id} className="border-calm-blue-100">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-semibold text-calm-blue-800">{paper.title}</h3>
                            <span className="text-xs font-medium bg-calm-blue-100 text-calm-blue-700 px-2 py-1 rounded-full whitespace-nowrap ml-4">
                              {paper.type}
                            </span>
                          </div>
                          <p className="text-calm-blue-700 mb-2">
                            <span className="font-medium">Authors:</span> {paper.authors}
                          </p>
                          <p className="text-calm-blue-700 mb-4">
                            <span className="font-medium">Published in:</span> {paper.journal}, {paper.year}
                          </p>
                          <p className="text-calm-blue-600 mb-4">{paper.abstract}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {paper.keywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="text-xs bg-calm-blue-50 text-calm-blue-600 px-2 py-1 rounded-full"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" className="border-calm-blue-200 text-calm-blue-700">
                              <ExternalLink className="mr-2 h-4 w-4" /> View Abstract
                            </Button>
                            <Button
                              className={
                                paper.downloadable
                                  ? "bg-calm-blue-600 hover:bg-calm-blue-700"
                                  : "bg-calm-blue-300 cursor-not-allowed"
                              }
                              disabled={!paper.downloadable}
                            >
                              <Download className="mr-2 h-4 w-4" />{" "}
                              {paper.downloadable ? "Download PDF" : "Request Access"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              {/* Similar TabsContent for other tabs */}
            </Tabs>
          </div>
        </section>

        {/* Research Partnerships Section */}
        <section className="py-12 bg-calm-blue-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-calm-blue-800 mb-8 text-center">Our Research Partnerships</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-16 w-16 rounded-full bg-calm-blue-100 flex items-center justify-center mb-4 mx-auto">
                  <FileText className="h-8 w-8 text-calm-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-calm-blue-800 mb-2 text-center">Academic Institutions</h3>
                <p className="text-calm-blue-600 text-center">
                  We collaborate with leading universities and research institutions to advance mental health knowledge
                  and practice.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-16 w-16 rounded-full bg-calm-blue-100 flex items-center justify-center mb-4 mx-auto">
                  <FileText className="h-8 w-8 text-calm-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-calm-blue-800 mb-2 text-center">Healthcare Organizations</h3>
                <p className="text-calm-blue-600 text-center">
                  Our partnerships with healthcare providers help translate research into practical clinical
                  applications.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-16 w-16 rounded-full bg-calm-blue-100 flex items-center justify-center mb-4 mx-auto">
                  <FileText className="h-8 w-8 text-calm-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-calm-blue-800 mb-2 text-center">Community Organizations</h3>
                <p className="text-calm-blue-600 text-center">
                  We work with community groups to ensure our research addresses real-world needs and is accessible to
                  all.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="bg-calm-blue-800 text-white rounded-lg p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Interested in Research Collaboration?</h2>
                  <p className="text-calm-blue-100 max-w-[500px]">
                    We're always looking for research partners who share our commitment to advancing mental health
                    knowledge and practice.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact">
                    <Button size="lg" className="bg-white text-calm-blue-800 hover:bg-calm-blue-50">
                      Contact Research Team
                    </Button>
                  </Link>
                  <Link href="/research/partnerships">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-calm-blue-700">
                      Learn About Partnerships
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
