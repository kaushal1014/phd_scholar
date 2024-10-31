import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, BookOpen, Users, Calendar, ChevronRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow">
  
      </header>

      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">Welcome to Your PhD Journey</h2>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">Track your progress, manage your research, and stay on top of your academic milestones all in one place.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                Research Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Get an overview of your research progress, publications, and upcoming deadlines.</CardDescription>
              <Button className="mt-4" variant="outline">
                <Link href="/dashboard" className="flex items-center">
                  View Dashboard <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
                Collaboration Hub
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Connect with fellow researchers, join discussion groups, and find potential collaborators.</CardDescription>
              <Button className="mt-4" variant="outline">
                <Link href="/collaboration" className="flex items-center">
                  Explore Collaborations <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
                Milestone Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Keep track of your PhD milestones, set reminders, and celebrate your achievements.</CardDescription>
              <Button className="mt-4" variant="outline">
                <Link href="/milestones" className="flex items-center">
                  View Milestones <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-12 sm:px-12 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                <span className="block">Ready to dive in?</span>
                <span className="block text-blue-600 dark:text-blue-400">Start managing your PhD journey today.</span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-gray-500 dark:text-gray-300">
                Sign up now to access all features and take control of your academic progress.
              </p>
              <Button className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link href="/about" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              About
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              Contact
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              Privacy Policy
            </Link>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">&copy; 2024 PhD Scholar Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}