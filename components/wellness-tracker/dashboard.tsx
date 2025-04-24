"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CalendarIcon, Loader2, AlertTriangle } from "lucide-react"
import { format, isValid } from "date-fns"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import type { MoodEntry } from "@/app/wellness-tracker/actions"
import { useToast } from "@/hooks/use-toast"
// Replace the Auth0 import with our standard auth context
import { useAuth } from "@/contexts/auth-context"

// Sample data for preview mode
const sampleMoodData = [
  { date: "2023-04-10", mood: "Great", mood_value: 5 },
  { date: "2023-04-11", mood: "Good", mood_value: 4 },
  { date: "2023-04-12", mood: "Okay", mood_value: 3 },
  { date: "2023-04-13", mood: "Low", mood_value: 2 },
  { date: "2023-04-14", mood: "Great", mood_value: 5 },
  { date: "2023-04-15", mood: "Good", mood_value: 4 },
  { date: "2023-04-16", mood: "Great", mood_value: 5 },
  { date: "2023-04-17", mood: "Okay", mood_value: 3 },
]

interface WellnessTrackerDashboardProps {
  previewMode?: boolean
  userId?: string
}

// Update the component props to use our new auth system
export default function WellnessTrackerDashboard() {
  const [date, setDate] = useState<Date | null>(new Date())
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [notes, setNotes] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [currentDayEntry, setCurrentDayEntry] = useState<MoodEntry | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  // Use sample data for demonstration
  const sampleMoodData = [
    { date: "2023-04-10", mood: "Great", mood_value: 5 },
    { date: "2023-04-11", mood: "Good", mood_value: 4 },
    { date: "2023-04-12", mood: "Okay", mood_value: 3 },
    { date: "2023-04-13", mood: "Low", mood_value: 2 },
    { date: "2023-04-14", mood: "Great", mood_value: 5 },
    { date: "2023-04-15", mood: "Good", mood_value: 4 },
    { date: "2023-04-16", mood: "Great", mood_value: 5 },
    { date: "2023-04-17", mood: "Okay", mood_value: 3 },
  ]

  // Fetch mood entries when component mounts or date changes
  useEffect(() => {
    // For demo purposes, we'll use sample data
    setMoodEntries(sampleMoodData as MoodEntry[])

    // In a real app, you would fetch data from your API
    // if (user?.id) {
    //   fetchMoodData(user.id, date)
    // }
  }, [date])

  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood)
  }

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast({
        title: "Error",
        description: "Please select a mood",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // In a real app, you would save to your API
      // const result = await saveMoodEntry(user.id, selectedMood, notes)

      // For demo purposes, we'll just show a success message
      setTimeout(() => {
        toast({
          title: "Success!",
          description: "Your mood has been recorded.",
        })

        // Update the current day entry
        setCurrentDayEntry({
          mood: selectedMood,
          mood_value: getMoodValue(selectedMood),
          notes: notes,
          created_at: new Date().toISOString(),
        })

        setIsSubmitting(false)
      }, 1000)
    } catch (err) {
      console.error("Error submitting mood:", err)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
      setError("Failed to save mood entry. Please try again.")
      setIsSubmitting(false)
    }
  }

  // Helper function to get mood value
  const getMoodValue = (mood: string): number => {
    const moodValueMap: Record<string, number> = {
      Great: 5,
      Good: 4,
      Okay: 3,
      Low: 2,
      Bad: 1,
    }
    return moodValueMap[mood] || 3
  }

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate || !isValid(newDate)) {
      setDate(new Date())
      return
    }
    setDate(newDate)
  }

  // Generate chart data
  const generateChartData = () => {
    const moodCounts = {
      Great: 0,
      Good: 0,
      Okay: 0,
      Low: 0,
      Bad: 0,
    }

    if (Array.isArray(moodEntries)) {
      moodEntries.forEach((entry) => {
        if (entry && typeof entry === "object" && "mood" in entry) {
          const mood = entry.mood as keyof typeof moodCounts
          if (moodCounts[mood] !== undefined) {
            moodCounts[mood]++
          }
        }
      })
    }

    return moodCounts
  }

  const chartData = generateChartData()
  const maxCount = Math.max(...Object.values(chartData), 1)

  // Safely format date
  const formatDateSafe = (date: Date | null) => {
    if (!date || !isValid(date)) {
      return format(new Date(), "PPP")
    }
    return format(date, "PPP")
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        Wellness Tracker{" "}
        {/* {previewMode && <span className="text-sm font-normal text-muted-foreground ml-2">(Preview Mode)</span>} */}
      </h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-calm-blue-800">Daily Check-in</CardTitle>
            <CardDescription className="text-calm-blue-600">How are you feeling today?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <Button
                variant="outline"
                className={cn(
                  "flex-1 mx-1 hover:bg-calm-blue-50",
                  selectedMood === "Great" && "bg-calm-blue-100 border-calm-blue-500 text-calm-blue-700",
                )}
                onClick={() => handleMoodSelection("Great")}
                disabled={isSubmitting}
              >
                😊<br />
                Great
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 mx-1 hover:bg-calm-blue-50",
                  selectedMood === "Good" && "bg-calm-blue-100 border-calm-blue-500 text-calm-blue-700",
                )}
                onClick={() => handleMoodSelection("Good")}
                disabled={isSubmitting}
              >
                😌<br />
                Good
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 mx-1 hover:bg-calm-blue-50",
                  selectedMood === "Okay" && "bg-calm-blue-100 border-calm-blue-500 text-calm-blue-700",
                )}
                onClick={() => handleMoodSelection("Okay")}
                disabled={isSubmitting}
              >
                😐<br />
                Okay
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 mx-1 hover:bg-calm-blue-50",
                  selectedMood === "Low" && "bg-calm-blue-100 border-calm-blue-500 text-calm-blue-700",
                )}
                onClick={() => handleMoodSelection("Low")}
                disabled={isSubmitting}
              >
                😔<br />
                Low
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 mx-1 hover:bg-calm-blue-50",
                  selectedMood === "Bad" && "bg-calm-blue-100 border-calm-blue-500 text-calm-blue-700",
                )}
                onClick={() => handleMoodSelection("Bad")}
                disabled={isSubmitting}
              >
                😢<br />
                Bad
              </Button>
            </div>

            <div className="mt-4">
              <Textarea
                placeholder="Add notes about how you're feeling (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-calm-blue-600 hover:bg-calm-blue-700"
              onClick={handleSubmit}
              disabled={!selectedMood || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>Submit Check-in {/* {previewMode && <LockIcon className="ml-2 h-4 w-4" />} */}</>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>View your wellbeing data for a specific date</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? formatDateSafe(date) : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center" sideOffset={10}>
                <Calendar
                  mode="single"
                  selected={date || undefined}
                  onSelect={handleDateChange}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {isLoading ? (
              <div className="mt-4 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : currentDayEntry /* || (previewMode && date && date.getDate() % 5 === 0) */ ? (
              <div className="mt-4 p-4 bg-muted rounded-lg w-full">
                <h3 className="font-medium mb-1">{date ? formatDateSafe(date) : "Today"}</h3>
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full mr-2",
                      currentDayEntry?.mood /* || (previewMode ? "Good" : "") */ === "Great" && "bg-green-500",
                      currentDayEntry?.mood /* || (previewMode ? "Good" : "") */ === "Good" && "bg-blue-500",
                      currentDayEntry?.mood /* || (previewMode ? "Good" : "") */ === "Okay" && "bg-yellow-500",
                      currentDayEntry?.mood /* || (previewMode ? "Good" : "") */ === "Low" && "bg-orange-500",
                      currentDayEntry?.mood /* || (previewMode ? "Good" : "") */ === "Bad" && "bg-red-500",
                    )}
                  ></div>
                  <span>Mood: {currentDayEntry?.mood /* || (previewMode ? "Good" : "") */}</span>
                </div>
                {currentDayEntry?.notes /* || previewMode */ && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {currentDayEntry?.notes /* || (previewMode ? "Sample notes for this day." : "") */}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>No entry for this date</p>
              </div>
            )}

            {/* {previewMode && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>Sample data is available for some dates</p>
              </div>
            )} */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
            <CardDescription>Your mood patterns over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading /* && !previewMode */ ? (
              <div className="h-48 w-full bg-muted rounded-lg flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : /* previewMode || */ moodEntries.length > 0 ? (
              <div className="h-48 w-full bg-muted rounded-lg p-4">
                <div className="h-full flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Great</span>
                    <div
                      className="h-8 bg-green-500 rounded-sm transition-all duration-500"
                      style={{ width: `${(chartData.Great / maxCount) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Good</span>
                    <div
                      className="h-8 bg-blue-500 rounded-sm transition-all duration-500"
                      style={{ width: `${(chartData.Good / maxCount) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Okay</span>
                    <div
                      className="h-8 bg-yellow-500 rounded-sm transition-all duration-500"
                      style={{ width: `${(chartData.Okay / maxCount) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Low</span>
                    <div
                      className="h-8 bg-orange-500 rounded-sm transition-all duration-500"
                      style={{ width: `${(chartData.Low / maxCount) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Bad</span>
                    <div
                      className="h-8 bg-red-500 rounded-sm transition-all duration-500"
                      style={{ width: `${(chartData.Bad / maxCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-48 w-full bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">No mood data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* {previewMode && (
        <div className="mt-8 p-4 bg-calm-blue-50 rounded-lg border border-calm-blue-100">
          <h2 className="text-xl font-semibold mb-2 text-calm-blue-800">Preview Mode Information</h2>
          <p className="mb-2 text-calm-blue-700">
            This is a demonstration version of the Wellness Tracker with limited functionality:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-calm-blue-700">
            <li>You can select moods and interact with the interface</li>
            <li>Data is not saved between sessions</li>
            <li>Sample data is displayed in the charts</li>
            <li>Sign in for full functionality and to save your wellness data</li>
          </ul>
        </div>
      )} */}
    </div>
  )
}
