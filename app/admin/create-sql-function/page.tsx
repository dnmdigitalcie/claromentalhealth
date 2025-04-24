"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { createSqlFunction } from "@/app/actions/create-sql-function"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CreateSqlFunctionPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleCreateFunction = async () => {
    setIsCreating(true)
    try {
      const result = await createSqlFunction()
      setResult(result)
    } catch (error) {
      console.error("Error creating SQL function:", error)
      setResult({ success: false, message: "An unexpected error occurred" })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
      <Header />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Create SQL Function</h1>

        <Card className="max-w-md mx-auto border-calm-blue-100">
          <CardHeader>
            <CardTitle className="text-calm-blue-800">Create SQL Execution Function</CardTitle>
            <CardDescription>
              This will create a function in your Supabase database that allows executing SQL queries.
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
              This function is required for the database initialization process to work correctly.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleCreateFunction}
              disabled={isCreating}
              className="w-full bg-calm-blue-600 hover:bg-calm-blue-700"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create SQL Function"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
