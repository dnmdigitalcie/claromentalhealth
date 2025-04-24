"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface CourseProgressProps {
  course: {
    id: string
    title: string
    description: string | null
    image_url: string | null
    duration: number | null
    progress: number
    completed: boolean
  }
}

export function CourseProgress({ course }: CourseProgressProps) {
  const progressPercentage = Math.round(course.progress * 100)

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative h-40 w-full">
        {course.image_url ? (
          <Image src={course.image_url || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">No image</p>
          </div>
        )}
        {course.completed && (
          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
            <CheckCircle className="h-5 w-5" />
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <Clock className="h-4 w-4 mr-1" />
          <span>{course.duration ? `${course.duration} min` : "Duration not specified"}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/courses/${course.id}`} className="w-full">
          <Button variant={course.completed ? "outline" : "default"} className="w-full">
            {course.completed ? "Review Course" : "Continue Learning"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
