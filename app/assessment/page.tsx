"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"

// Sample assessment questions
const questions = [
  {
    id: 1,
    question: "What is your primary role?",
    options: [
      { id: "a", text: "Mental health professional (therapist, counselor, etc.)" },
      { id: "b", text: "Healthcare provider (doctor, nurse, etc.)" },
      { id: "c", text: "Educator or school staff" },
      { id: "d", text: "Workplace leader or HR professional" },
      { id: "e", text: "Community support worker" },
      { id: "f", text: "Personal interest / self-development" },
    ],
  },
  {
    id: 2,
    question: "What is your current level of mental health knowledge?",
    options: [
      { id: "a", text: "Beginner - Limited formal training" },
      { id: "b", text: "Intermediate - Some training or education" },
      { id: "c", text: "Advanced - Extensive training or education" },
    ],
  },
  {
    id: 3,
    question: "What is your primary goal for mental health education?",
    options: [
      { id: "a", text: "Supporting others professionally" },
      { id: "b", text: "Creating mentally healthy environments" },
      { id: "c", text: "Personal skill development" },
      { id: "d", text: "Meeting professional requirements" },
    ],
  },
  {
    id: 4,
    question: "Which mental health topics are you most interested in?",
    options: [
      { id: "a", text: "Anxiety and stress management" },
      { id: "b", text: "Depression and mood disorders" },
      { id: "c", text: "Trauma-informed approaches" },
      { id: "d", text: "Youth mental health" },
      { id: "e", text: "Workplace mental health" },
      { id: "f", text: "Crisis intervention" },
    ],
  },
  {
    id: 5,
    question: "How much time can you dedicate to learning each week?",
    options: [
      { id: "a", text: "Less than 2 hours" },
      { id: "b", text: "2-5 hours" },
      { id: "c", text: "More than 5 hours" },
    ],
  },
]

// Sample learning paths based on assessment
const learningPaths = [
  {
    id: 1,
    title: "Mental Health Professional Path",
    description: "Advanced training for mental health practitioners",
    courses: [
      "Advanced Therapeutic Approaches",
      "Clinical Assessment Skills",
      "Professional Ethics in Mental Health",
      "Specialized Intervention Techniques",
    ],
  },
  {
    id: 2,
    title: "Workplace Mental Health Leader",
    description: "Creating psychologically safe work environments",
    courses: [
      "Mental Health in the Workplace",
      "Supporting Employee Mental Health",
      "Creating Inclusive Workplace Cultures",
      "Return-to-Work Planning",
    ],
  },
  {
    id: 3,
    title: "Educator's Mental Health Support Path",
    description: "Supporting student and youth mental wellbeing",
    courses: [
      "Youth Mental Health Foundations",
      "Classroom Strategies for Mental Wellbeing",
      "Identifying Students at Risk",
      "Building Resilience in Young People",
    ],
  },
]

export default function AssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (questionId: number, answerId: string) => {
    setAnswers({
      ...answers,
      [questionId]: answerId,
    })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-calm-blue-50 py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-calm-blue-900">
                Find Your Learning Path
              </h1>
              <p className="text-xl text-calm-blue-700 max-w-[700px]">
                Answer a few questions to get personalized course recommendations tailored to your goals and experience.
              </p>
            </div>
          </div>
        </section>

        {/* Assessment Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            {!showResults ? (
              <Card className="max-w-2xl mx-auto border-calm-blue-100">
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-calm-blue-600">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <span className="text-sm font-medium bg-calm-blue-100 text-calm-blue-700 px-2 py-1 rounded-full">
                      {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-calm-blue-100 rounded-full h-2">
                    <div
                      className="bg-calm-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-calm-blue-800 mt-4">
                    {questions[currentQuestion].question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={answers[questions[currentQuestion].id] || ""}
                    onValueChange={(value) => handleAnswer(questions[currentQuestion].id, value)}
                  >
                    <div className="space-y-3">
                      {questions[currentQuestion].options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={option.id}
                            id={`option-${option.id}`}
                            className="border-calm-blue-300 text-calm-blue-600"
                          />
                          <Label htmlFor={`option-${option.id}`} className="text-calm-blue-700 cursor-pointer">
                            {option.text}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="border-calm-blue-200 text-calm-blue-700 hover:bg-calm-blue-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!answers[questions[currentQuestion].id]}
                    className="bg-calm-blue-600 hover:bg-calm-blue-700"
                  >
                    {currentQuestion === questions.length - 1 ? "See Results" : "Next"}
                    {currentQuestion !== questions.length - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="max-w-4xl mx-auto">
                <Card className="border-calm-blue-100 mb-8">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-calm-blue-800">
                      Your Personalized Learning Path
                    </CardTitle>
                    <CardDescription>
                      Based on your responses, we recommend the following learning path:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-calm-blue-50 p-6 rounded-lg mb-6">
                      <h3 className="text-xl font-semibold text-calm-blue-800 mb-2">{learningPaths[0].title}</h3>
                      <p className="text-calm-blue-600 mb-4">{learningPaths[0].description}</p>
                      <h4 className="font-medium text-calm-blue-700 mb-2">Recommended Courses:</h4>
                      <ul className="space-y-2">
                        {learningPaths[0].courses.map((course, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-calm-blue-600 mr-2 mt-0.5" />
                            <span className="text-calm-blue-700">{course}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-calm-blue-800">
                        Other Paths You Might Be Interested In:
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {learningPaths.slice(1).map((path) => (
                          <div key={path.id} className="border border-calm-blue-100 rounded-lg p-4">
                            <h4 className="font-semibold text-calm-blue-800 mb-1">{path.title}</h4>
                            <p className="text-sm text-calm-blue-600 mb-2">{path.description}</p>
                            <Link href={`/learning-paths/${path.id}`}>
                              <Button variant="link" className="p-0 h-auto text-calm-blue-600">
                                Learn more
                              </Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-4">
                    <Link href="/courses" className="w-full sm:w-auto">
                      <Button className="w-full bg-calm-blue-600 hover:bg-calm-blue-700">
                        Browse Recommended Courses
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={handleRestart}
                      className="w-full sm:w-auto border-calm-blue-200 text-calm-blue-700 hover:bg-calm-blue-50"
                    >
                      Retake Assessment
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
