import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, BookOpen, Users, Calendar, ChevronRight, FileText, School, Award, ArrowRight, Zap } from 'lucide-react'

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-gradient-to-r from-[#1B3668] to-[#0A2240] shadow">
        <div className="max-w-7xl mx-auto py-4 px-2 sm:py-6 sm:px-4 lg:px-8">
          <h1 className="text-xl sm:text-3xl text-center font-bold text-white">Embark on a journey of advanced research and academic excellence with PES University Research programs.</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-2 sm:py-12 sm:px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
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
                    <Link target="_blank" href="/programs/phd">Learn More</Link>
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
                    <Link target="_blank" href="/programs/mtech">Learn More</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Direct PhD Column */}
          <div>
            <Card className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1B3668] dark:text-white flex items-center">
                  <Zap className="mr-2 h-6 w-6" />
                  Direct Ph.D. Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 dark:text-gray-300 mb-4">
                  Accelerated research pathway for exceptional undergraduate students in their 6th & 8th semesters.
                </CardDescription>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                  <li>Monthly stipend of ₹15,000 starting from 7th semester</li>
                  <li>Full tuition fee waiver for the program</li>
                  <li>Exposure to international research opportunities</li>
                  <li>Eligible for ₹30,000+ monthly stipend after B.Tech completion</li>
                  <li>Available in CS, ECE, EEE, Mechanical, and Biotechnology</li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild>
                    <Link href="/programs/direct-phd" target="_blank">Learn More</Link>
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
