'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, BookOpen, Users, Calendar, ChevronRight, FileText, School, Award } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ph.D. and M.Tech. by Research</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">Welcome to Your PhD Journey</h2>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">Track your progress, manage your research, and stay on top of your academic milestones all in one place.</p>
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
              <Button className="mt-8 inline-flex items-center px-6 py-3">
                Get Started
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>PH.D. AND M.TECH. BY RESEARCH</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Part-time opportunities also for teachers and industry professionals.</p>
                <p>Cutting-edge research areas in engineering, science, and management.</p>
                <p>Highly experienced Ph.D. faculty on campus: over 70</p>
                <p>TEQIP/World Bank funding including COE</p>
                <p>Crucible of Research and Innovation (CORI) – for multi-disciplinary research</p>
                <p>Several ongoing funded research projects</p>
                <p>Collaboration with reputed universities and industries</p>
                <p>Fellowship/Scholarship/Financial Assistance available</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="programs">
            <Card>
              <CardHeader>
                <CardTitle>AVAILABLE PROGRAMS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Ph.D. and M.Tech by Research in – Computer Science & Engineering, Electrical Engineering, Electronics and Communication Engineering, Mechanical Engineering, and Biotechnology.</p>
                <p>Ph.D in – Commerce & Management, Science (Maths, Physics & Chemistry), Computer Applications, Psychology, Nursing, and Pharmacy.</p>
                <p>Candidates wishing to pursue research careers in interdisciplinary areas are especially encouraged.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="eligibility">
            <Card>
              <CardHeader>
                <CardTitle>MINIMUM QUALIFICATION</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Ph.D.: A post-graduate degree in a related field of study from a UGC recognized university, with a minimum of 60% aggregate marks (or equivalent grade point average)</p>
                <p>M.Tech. by Research: UG degree in engineering with at least 60% marks (or equivalent GPA).</p>
                <p>Reservation Categories (as notified by Govt. of Karnataka): 10% relaxation</p>
                <p>Distance Education Degrees: not recognized</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="requirements">
            <Card>
              <CardHeader>
                <CardTitle>ELIGIBILITY FOR THE AWARD OF PH.D./ M.TECH. BY RESEARCH DEGREE</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

