"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { initializeDatabase } from "@/app/actions/db-init"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function InitDbPage() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleInitDb = async () => {
    setIsInitializing(true)
    try {
      const result = await initializeDatabase()
      setResult(result)
    } catch (error) {
      console.error("Error initializing database:", error)
      setResult({ success: false, message: "An unexpected error occurred" })
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <>
      <Header />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Database Initialization</h1>

        <Card className="max-w-md mx-auto border-calm-blue-100">
          <CardHeader>
            <CardTitle className="text-calm-blue-800">Initialize Database</CardTitle>
            <CardDescription>
              This will create all necessary tables and sample data for the Claro Mental Health application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result && (
              <Alert variant={result.success ? "default" : "destructive"} className="mb-4">
                <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            )}
            <p className="text-sm text-calm-blue-600 mb-4">
              This will create all necessary tables in the public schema for the Claro Mental Health application. Sample
              data will be added to demonstrate the functionality.
            </p>
            <div className="bg-calm-blue-50 p-4 rounded-md mb-4">
              <h3 className="font-medium text-calm-blue-800 mb-2">What this will do:</h3>
              <ul className="list-disc pl-5 space-y-1 text-calm-blue-600">
                <li>Create tables for courses, modules, lessons, and assessments</li>
                <li>Create tables for user progress tracking</li>
                <li>Add sample courses and content</li>
                <li>Set up the wellness tracker functionality</li>
              </ul>
            </div>
            <p className="text-sm text-calm-blue-600">
              <strong>Note:</strong> This action will not delete any existing data if the tables already exist.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleInitDb}
              disabled={isInitializing}
              className="w-full bg-calm-blue-600 hover:bg-calm-blue-700"
            >
              {isInitializing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Initializing...
                </>
              ) : (
                "Initialize Database"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
