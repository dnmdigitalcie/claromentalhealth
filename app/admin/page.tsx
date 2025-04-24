import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-calm-blue-100">
              <CardHeader>
                <CardTitle className="text-calm-blue-800">Create SQL Function</CardTitle>
                <CardDescription>Create the SQL execution function in Supabase</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-calm-blue-700">
                  This creates a stored procedure in your Supabase database that allows executing SQL queries. This is
                  required for database initialization.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/create-sql-function" className="w-full">
                  <Button className="w-full bg-calm-blue-600 hover:bg-calm-blue-700">Create SQL Function</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-calm-blue-100">
              <CardHeader>
                <CardTitle className="text-calm-blue-800">Initialize Database</CardTitle>
                <CardDescription>Set up database tables and sample data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-calm-blue-700">
                  This will create all necessary tables in the public schema and populate them with sample data for the
                  Claro Mental Health application.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/init-db" className="w-full">
                  <Button className="w-full bg-calm-blue-600 hover:bg-calm-blue-700">Initialize Database</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-calm-blue-100">
              <CardHeader>
                <CardTitle className="text-calm-blue-800">View Courses</CardTitle>
                <CardDescription>Go to the courses page</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-calm-blue-700">
                  View the courses page to see if the database initialization was successful.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/courses" className="w-full">
                  <Button
                    className="w-full border-calm-blue-200 text-calm-blue-700 hover:bg-calm-blue-50"
                    variant="outline"
                  >
                    View Courses
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
