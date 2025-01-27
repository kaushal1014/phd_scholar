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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-gradient-to-r from-[#1B3668] to-[#0A2240] shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">PES Ph.D. and M.Tech. by Research</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1B3668] dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Welcome to Your PhD Journey
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-700 dark:text-gray-300">
            Track your progress, manage your research, and stay on top of your academic milestones all in one place.
          </p>
          <Button className="mt-8 bg-[#F7941D] hover:bg-[#F7941D]/90 text-white" size="lg">
            <Link href="/programs">Explore Programs</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          <Card className="border-t-4 border-t-[#1B3668] bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-6 w-6 text-[#1B3668] mr-2" />
                Research Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-700 dark:text-gray-300">
                Get an overview of your research progress, publications, and upcoming deadlines.
              </CardDescription>
              <Button
                className="mt-4 border-[#1B3668] text-[#1B3668] hover:bg-[#1B3668] hover:text-white"
                variant="outline"
              >
                <Link href="/dashboard" className="flex items-center">
                  View Dashboard <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-[#1B3668] bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 text-[#1B3668] mr-2" />
                Collaboration Hub
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-700 dark:text-gray-300">
                Connect with fellow researchers, join discussion groups, and find potential collaborators.
              </CardDescription>
              <Button
                className="mt-4 border-[#1B3668] text-[#1B3668] hover:bg-[#1B3668] hover:text-white"
                variant="outline"
              >
                <Link href="/collaboration" className="flex items-center">
                  Explore Collaborations <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-[#1B3668] bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-6 w-6 text-[#1B3668] mr-2" />
                Milestone Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-700 dark:text-gray-300">
                Keep track of your PhD milestones, set reminders, and celebrate your achievements.
              </CardDescription>
              <Button
                className="mt-4 border-[#1B3668] text-[#1B3668] hover:bg-[#1B3668] hover:text-white"
                variant="outline"
              >
                <Link href="/milestones" className="flex items-center">
                  View Milestones <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-br from-blue-100 to-orange-100 dark:from-gray-800 dark:to-gray-700 rounded-lg overflow-hidden mb-16 shadow-lg">
          <div className="px-6 py-12 sm:px-12 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center">
              <h2 className="text-3xl font-bold text-[#1B3668] dark:text-white sm:text-4xl">
                <span className="block">Ready to dive in?</span>
                <span className="block text-[#F7941D]">Start managing your PhD journey today.</span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-gray-700 dark:text-gray-300">
                Sign up now to access all features and take control of your academic progress.
              </p>
              <Link
                href="/signup"
                className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#1B3668] hover:bg-[#1B3668]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B3668]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

