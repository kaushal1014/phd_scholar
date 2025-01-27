import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  ChevronRight,
  FileText,
  School,
  Award,
  ArrowRight,
} from "lucide-react"

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-gradient-to-r from-[#1B3668] to-[#0A2240] shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Research Programs</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* PhD Column */}
          <div>
            <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1B3668] dark:text-white flex items-center">
                  <GraduationCap className="mr-2 h-6 w-6" />
                  Ph.D. by Research
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 dark:text-gray-300 mb-4">
                  Embark on a journey of advanced research and academic excellence with our Ph.D. programs.
                </CardDescription>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                  <li>Cutting-edge research areas in engineering, science, and management</li>
                  <li>Collaboration with reputed universities and industries</li>
                  <li>Access to state-of-the-art research facilities</li>
                  <li>Opportunities for interdisciplinary research</li>
                  <li>Guidance from experienced faculty members</li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild>
                    <Link href="/programs/phd">Learn More</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/phd-portal">Ph.D. Portal</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* MTech Column */}
          <div>
            <Card className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1B3668] dark:text-white flex items-center">
                  <School className="mr-2 h-6 w-6" />
                  M.Tech. by Research
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 dark:text-gray-300 mb-4">
                  Advance your engineering expertise through our research-oriented M.Tech. programs.
                </CardDescription>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                  <li>Specialized research in various engineering disciplines</li>
                  <li>Industry-relevant projects and collaborations</li>
                  <li>Flexible program structure for working professionals</li>
                  <li>Opportunity to contribute to technological advancements</li>
                  <li>Pathway to pursue doctoral studies</li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild>
                    <Link href="/programs/mtech">Learn More</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/mtech-portal">M.Tech. Portal</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

