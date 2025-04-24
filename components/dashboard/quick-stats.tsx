"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, CheckCircle, Clock } from "lucide-react"

interface QuickStatsProps {
  coursesEnrolled?: number
  coursesCompleted?: number
  totalHours?: number
}

export function QuickStats({ coursesEnrolled = 0, coursesCompleted = 0, totalHours = 0 }: QuickStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-calm-blue-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-calm-blue-500">Courses Enrolled</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 text-calm-blue-600 mr-2" aria-hidden="true" />
            <span className="text-2xl font-bold text-calm-blue-900">{coursesEnrolled}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-calm-blue-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-calm-blue-500">Courses Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-calm-blue-600 mr-2" aria-hidden="true" />
            <span className="text-2xl font-bold text-calm-blue-900">{coursesCompleted}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-calm-blue-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-calm-blue-500">Learning Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-calm-blue-600 mr-2" aria-hidden="true" />
            <span className="text-2xl font-bold text-calm-blue-900">{totalHours}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
