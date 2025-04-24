"use client"

import { CardFooter } from "@/components/ui/card"

import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Users, CheckCircle, AlertTriangle, Clock, Download, UserPlus, Building, ClipboardList } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Footer } from "@/components/layout/footer"
import CheckForIssues from "@/components/check-for-issues"

export default function DashboardClientPage() {
  const { user, hasRole } = useAuth()
  const isAdmin = hasRole("admin")

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1 py-8">
        <ProtectedRoute>
          <div className="container mx-auto px-4 sm:px-6">
            <CheckForIssues />
            <section aria-labelledby="dashboard-heading" className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                <div>
                  <h1 id="dashboard-heading" className="text-3xl font-bold text-calm-blue-900">
                    Training Manager Dashboard
                  </h1>
                  <p className="text-calm-blue-600 mt-1">
                    Monitor, manage, and measure your workplace mental health training
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex gap-3">
                  <Link href="/reports/export">
                    <Button variant="outline" className="border-calm-blue-200 text-calm-blue-700">
                      <Download className="mr-2 h-4 w-4" />
                      Export Reports
                    </Button>
                  </Link>
                  <Link href="/team/invite">
                    <Button className="bg-calm-blue-600 hover:bg-calm-blue-700">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite Team Members
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="bg-calm-blue-50 p-6 rounded-lg mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-calm-blue-800">
                      Welcome back, <span className="text-calm-blue-900">{user?.name || user?.email || "Manager"}</span>
                      !
                    </h2>
                    <p className="text-calm-blue-600 mt-1">
                      Your organization has completed 68% of assigned training this month
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Link href="/training/assign">
                      <Button className="bg-calm-blue-600 hover:bg-calm-blue-700">Assign New Training</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Key Metrics Section */}
            <section aria-labelledby="metrics-heading" className="mb-8">
              <h2 id="metrics-heading" className="text-xl font-semibold text-calm-blue-800 mb-4">
                Key Metrics
              </h2>
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-calm-blue-100">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-calm-blue-500">Completion Rate</p>
                        <p className="text-2xl font-bold text-calm-blue-900">68%</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-calm-blue-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-calm-blue-600" />
                      </div>
                    </div>
                    <Progress value={68} className="h-2 mt-4" />
                    <p className="text-xs text-calm-blue-500 mt-2">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card className="border-calm-blue-100">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-calm-blue-500">Team Members</p>
                        <p className="text-2xl font-bold text-calm-blue-900">124</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-calm-blue-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-calm-blue-600" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-calm-blue-500">98 Active</span>
                      <div className="h-2 w-2 rounded-full bg-amber-500 ml-2"></div>
                      <span className="text-xs text-calm-blue-500">26 Pending</span>
                    </div>
                    <p className="text-xs text-calm-blue-500 mt-2">8 new members this month</p>
                  </CardContent>
                </Card>

                <Card className="border-calm-blue-100">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-calm-blue-500">Overdue Assignments</p>
                        <p className="text-2xl font-bold text-calm-blue-900">12</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span className="text-xs text-calm-blue-500">5 Critical</span>
                      <div className="h-2 w-2 rounded-full bg-amber-500 ml-2"></div>
                      <span className="text-xs text-calm-blue-500">7 Standard</span>
                    </div>
                    <p className="text-xs text-calm-blue-500 mt-2">-3 from last week</p>
                  </CardContent>
                </Card>

                <Card className="border-calm-blue-100">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-calm-blue-500">Avg. Completion Time</p>
                        <p className="text-2xl font-bold text-calm-blue-900">3.2 hrs</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-calm-blue-100 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-calm-blue-600" />
                      </div>
                    </div>
                    <Progress value={75} className="h-2 mt-4" />
                    <p className="text-xs text-calm-blue-500 mt-2">-0.5 hrs from benchmark</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Team Progress Section */}
            <section aria-labelledby="team-progress-heading" className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h2 id="team-progress-heading" className="text-xl font-semibold text-calm-blue-800">
                  Team Progress
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-calm-blue-200 text-calm-blue-700">
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="border-calm-blue-200 text-calm-blue-700">
                    Sort
                  </Button>
                </div>
              </div>

              <Card className="border-calm-blue-100">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-calm-blue-100">
                          <th className="text-left p-4 text-calm-blue-700 font-medium">Department</th>
                          <th className="text-left p-4 text-calm-blue-700 font-medium">Team Members</th>
                          <th className="text-left p-4 text-calm-blue-700 font-medium">Completion</th>
                          <th className="text-left p-4 text-calm-blue-700 font-medium">Avg. Score</th>
                          <th className="text-left p-4 text-calm-blue-700 font-medium">Status</th>
                          <th className="text-left p-4 text-calm-blue-700 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-calm-blue-100">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Building className="h-5 w-5 text-calm-blue-600" />
                              <span className="font-medium">Human Resources</span>
                            </div>
                          </td>
                          <td className="p-4">24</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Progress value={92} className="h-2 w-24" />
                              <span>92%</span>
                            </div>
                          </td>
                          <td className="p-4">94%</td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">On Track</span>
                          </td>
                          <td className="p-4">
                            <Button variant="outline" size="sm" className="border-calm-blue-200 text-calm-blue-700">
                              View Details
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b border-calm-blue-100">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Building className="h-5 w-5 text-calm-blue-600" />
                              <span className="font-medium">Sales</span>
                            </div>
                          </td>
                          <td className="p-4">36</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Progress value={78} className="h-2 w-24" />
                              <span>78%</span>
                            </div>
                          </td>
                          <td className="p-4">86%</td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                              Needs Attention
                            </span>
                          </td>
                          <td className="p-4">
                            <Button variant="outline" size="sm" className="border-calm-blue-200 text-calm-blue-700">
                              View Details
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b border-calm-blue-100">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Building className="h-5 w-5 text-calm-blue-600" />
                              <span className="font-medium">Engineering</span>
                            </div>
                          </td>
                          <td className="p-4">42</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Progress value={45} className="h-2 w-24" />
                              <span>45%</span>
                            </div>
                          </td>
                          <td className="p-4">82%</td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">At Risk</span>
                          </td>
                          <td className="p-4">
                            <Button variant="outline" size="sm" className="border-calm-blue-200 text-calm-blue-700">
                              View Details
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Building className="h-5 w-5 text-calm-blue-600" />
                              <span className="font-medium">Customer Support</span>
                            </div>
                          </td>
                          <td className="p-4">22</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Progress value={88} className="h-2 w-24" />
                              <span>88%</span>
                            </div>
                          </td>
                          <td className="p-4">91%</td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">On Track</span>
                          </td>
                          <td className="p-4">
                            <Button variant="outline" size="sm" className="border-calm-blue-200 text-calm-blue-700">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              <div className="mt-4 text-right">
                <Link href="/team/departments">
                  <Button variant="link" className="text-calm-blue-600">
                    View All Departments
                  </Button>
                </Link>
              </div>
            </section>

            {/* Training Programs Section */}
            <section aria-labelledby="training-programs-heading" className="mb-8">
              <h2 id="training-programs-heading" className="text-xl font-semibold text-calm-blue-800 mb-4">
                Training Programs
              </h2>

              <Tabs defaultValue="active">
                <TabsList className="mb-4">
                  <TabsTrigger value="active">Active Programs</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="active">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-calm-blue-100">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-semibold text-calm-blue-800">
                            Recognizing Mental Health Issues
                          </CardTitle>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            In Progress
                          </span>
                        </div>
                        <CardDescription>For managers and team leaders</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-calm-blue-600">Completion</span>
                              <span className="text-calm-blue-800 font-medium">72%</span>
                            </div>
                            <Progress value={72} className="h-2" />
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-calm-blue-600">Assigned to</span>
                            <span className="text-calm-blue-800 font-medium">42 team members</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-calm-blue-600">Due date</span>
                            <span className="text-calm-blue-800 font-medium">June 15, 2023</span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm" className="border-calm-blue-200 text-calm-blue-700">
                            View Program
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-calm-blue-100">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-semibold text-calm-blue-800">
                            Having Supportive Conversations
                          </CardTitle>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            In Progress
                          </span>
                        </div>
                        <CardDescription>For all employees</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-calm-blue-600">Completion</span>
                              <span className="text-calm-blue-800 font-medium">64%</span>
                            </div>
                            <Progress value={64} className="h-2" />
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-calm-blue-600">Assigned to</span>
                            <span className="text-calm-blue-800 font-medium">124 team members</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-calm-blue-600">Due date</span>
                            <span className="text-calm-blue-800 font-medium">July 30, 2023</span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm" className="border-calm-blue-200 text-calm-blue-700">
                            View Program
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-calm-blue-100">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-semibold text-calm-blue-800">
                            Legal & Ethical Considerations
                          </CardTitle>
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                            Needs Attention
                          </span>
                        </div>
                        <CardDescription>For designated first aiders</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-calm-blue-600">Completion</span>
                              <span className="text-calm-blue-800 font-medium">38%</span>
                            </div>
                            <Progress value={38} className="h-2" />
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-calm-blue-600">Assigned to</span>
                            <span className="text-calm-blue-800 font-medium">18 team members</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-calm-blue-600">Due date</span>
                            <span className="text-calm-blue-800 font-medium">May 30, 2023</span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm" className="border-calm-blue-200 text-calm-blue-700">
                            View Program
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="upcoming">
                  <div className="bg-calm-blue-50 p-6 rounded-lg text-center">
                    <ClipboardList className="h-12 w-12 text-calm-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-calm-blue-800 mb-2">Plan Your Next Training</h3>
                    <p className="text-calm-blue-600 mb-4">
                      Schedule and prepare your upcoming mental health training programs
                    </p>
                    <Button className="bg-calm-blue-600 hover:bg-calm-blue-700">Schedule New Program</Button>
                  </div>
                </TabsContent>

                <TabsContent value="completed">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-calm-blue-100">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-semibold text-calm-blue-800">Stress Management</CardTitle>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Completed</span>
                        </div>
                        <CardDescription>For all employees</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-calm-blue-600">Completion</span>
                              <span className="text-calm-blue-800 font-medium">98%</span>
                            </div>
                            <Progress value={98} className="h-2" />
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-calm-blue-600">Average score</span>
                            <span className="text-calm-blue-800 font-medium">92%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-calm-blue-600">Completed on</span>
                            <span className="text-calm-blue-800 font-medium">April 15, 2023</span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm" className="border-calm-blue-200 text-calm-blue-700">
                            View Report
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </section>

            {/* ROI Metrics Section */}
            <section aria-labelledby="roi-metrics-heading" className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h2 id="roi-metrics-heading" className="text-xl font-semibold text-calm-blue-800">
                  Business Impact Metrics
                </h2>
                <Button variant="outline" size="sm" className="border-calm-blue-200 text-calm-blue-700">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>

              <Card className="border-calm-blue-100">
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <h3 className="text-lg font-semibold text-calm-blue-800 mb-4">Productivity Metrics</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-calm-blue-600">Absenteeism Reduction</span>
                            <span className="text-green-600 font-medium">-32%</span>
                          </div>
                          <Progress value={32} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-calm-blue-600">Engagement Increase</span>
                            <span className="text-green-600 font-medium">+24%</span>
                          </div>
                          <Progress value={24} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-calm-blue-600">Retention Improvement</span>
                            <span className="text-green-600 font-medium">+18%</span>
                          </div>
                          <Progress value={18} className="h-2" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-calm-blue-800 mb-4">Financial Impact</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-calm-blue-600">Healthcare Cost Savings</span>
                            <span className="text-green-600 font-medium">$86,400</span>
                          </div>
                          <Progress value={72} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-calm-blue-600">Productivity Gains</span>
                            <span className="text-green-600 font-medium">$124,800</span>
                          </div>
                          <Progress value={62} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-calm-blue-600">Total ROI</span>
                            <span className="text-green-600 font-medium">4.2x</span>
                          </div>
                          <Progress value={84} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-calm-blue-100">
                    <h3 className="text-lg font-semibold text-calm-blue-800 mb-4">Year-over-Year Comparison</h3>
                    <div className="h-64 bg-calm-blue-50 rounded-lg flex items-center justify-center">
                      <p className="text-calm-blue-600">Chart visualization would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Action Items Section */}
            <section aria-labelledby="action-items-heading">
              <h2 id="action-items-heading" className="text-xl font-semibold text-calm-blue-800 mb-4">
                Action Items
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-calm-blue-100">
                  <CardHeader>
                    <CardTitle className="text-calm-blue-800">Overdue Assignments</CardTitle>
                    <CardDescription className="text-calm-blue-600">Take action on overdue training</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-calm-blue-700">Mental Health First Aid</p>
                      <span className="text-sm text-red-600">Due May 30</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-calm-blue-700">Stress Management Techniques</p>
                      <span className="text-sm text-red-600">Due June 5</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-calm-blue-200 text-calm-blue-700">
                      View All Overdue
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border-calm-blue-100">
                  <CardHeader>
                    <CardTitle className="text-calm-blue-800">Upcoming Programs</CardTitle>
                    <CardDescription className="text-calm-blue-600">Prepare for upcoming training</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-calm-blue-700">Workplace Resilience</p>
                      <span className="text-sm text-green-600">Starts July 10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-calm-blue-700">Conflict Resolution</p>
                      <span className="text-sm text-green-600">Starts August 1</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-calm-blue-200 text-calm-blue-700">
                      Schedule New Program
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </section>
          </div>
        </ProtectedRoute>
      </main>
      <Footer />
    </div>
  )
}
