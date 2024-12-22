'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, Users, Calendar, ChevronRight, FileText, School, Award, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ph.D. and M.Tech. by Research</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">Welcome to Your PhD Journey</h2>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">Track your progress, manage your research, and stay on top of your academic milestones all in one place.</p>
          <Button className="mt-8" size="lg">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
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

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden mb-16">
          <div className="px-6 py-12 sm:px-12 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                <span className="block">Ready to dive in?</span>
                <span className="block text-blue-600 dark:text-blue-400">Start managing your PhD journey today.</span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-gray-500 dark:text-gray-300">
                Sign up now to access all features and take control of your academic progress.
              </p>
              <Link href='/signup' className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Get Started
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-16">
          <section id="overview" className="scroll-mt-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">PH.D. AND M.TECH. BY RESEARCH</h3>
            <Card>
              <CardContent className="pt-6">
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Part-time opportunities also for teachers and industry professionals.</li>
                  <li>Cutting-edge research areas in engineering, science, and management.</li>
                  <li>Highly experienced Ph.D. faculty on campus: over 70</li>
                  <li>TEQIP/World Bank funding including COE</li>
                  <li>Crucible of Research and Innovation (CORI) – for multi-disciplinary research</li>
                  <li>Several ongoing funded research projects</li>
                  <li>Collaboration with reputed universities and industries</li>
                  <li>Fellowship/Scholarship/Financial Assistance available</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section id="programs" className="scroll-mt-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">AVAILABLE PROGRAMS</h3>
            <Card>
              <CardContent className="pt-6">
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Ph.D. and M.Tech by Research in – Computer Science & Engineering, Electrical Engineering, Electronics and Communication Engineering, Mechanical Engineering, and Biotechnology.</li>
                  <li>Ph.D in – Commerce & Management, Science (Maths, Physics & Chemistry), Computer Applications, Psychology, Nursing, and Pharmacy.</li>
                  <li>Candidates wishing to pursue research careers in interdisciplinary areas are especially encouraged.</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section id="qualifications" className="scroll-mt-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">MINIMUM QUALIFICATION</h3>
            <Card>
              <CardContent className="pt-6">
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Ph.D.: A post-graduate degree in a related field of study from a UGC recognized university, with a minimum of 60% aggregate marks (or equivalent grade point average)</li>
                  <li>M.Tech. by Research: UG degree in engineering with at least 60% marks (or equivalent GPA).</li>
                  <li>Reservation Categories (as notified by Govt. of Karnataka): 10% relaxation</li>
                  <li>Distance Education Degrees: not recognized</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section id="eligibility" className="scroll-mt-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">ELIGIBILITY FOR THE AWARD OF PH.D./ M.TECH. BY RESEARCH DEGREE</h3>
            <Card>
              <CardContent className="pt-6">
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Credit compliance for course work within the stipulated maximum time duration</li>
                  <li>Successful Proposal Defense</li>
                  <li>Credit compliance for Research work within the stipulated maximum time duration</li>
                  <li>Compliance with publications requirement</li>
                  <li>Open seminars</li>
                  <li>Pre-Submission seminar of Synopsis</li>
                  <li>Submission of Synopsis</li>
                  <li>Submission of Thesis/Dissertation</li>
                  <li>Successful defense of the Thesis/Dissertation in the open viva-voce</li>
                  <li>Submission of final revised Thesis/Dissertation</li>
                  <li>Minimum duration requirement of THREE for Ph.D. and TWO years for M.Tech by Research</li>
                  <li>No pending disciplinary action; and no dues of any kind to the University</li>
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}

