import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Award, School, CheckCircle, Layers, BookMarked, Building } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function PhDPrograms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-gradient-to-r from-[#1B3668] to-[#0A2240] shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl text-center font-bold text-white">Ph.D. by Research Programs</h1>
          <p className="text-blue-100 mt-2 text-center">
            Embark on a journey of advanced research and academic excellence
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1B3668] dark:text-white mb-6 flex items-center">
            <BookOpen className="mr-2 h-6 w-6" />
            Program Overview
          </h2>
          <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-[#1B3668] dark:text-white">
                Part-time opportunities also available for teachers and industry professionals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Cutting-edge research areas in engineering, science, and management</li>
                <li>Highly experienced Ph.D. faculty on campus: over 70</li>
                <li>TEQIP/World Bank funding including COE</li>
                <li>Crucible of Research and Innovation (CORI) – for multi-disciplinary research</li>
                <li>Several ongoing funded research projects</li>
                <li>Collaboration with reputed universities and industries</li>
                <li>Fellowship/Scholarship/Financial Assistance available</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Available Programs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1B3668] dark:text-white mb-6 flex items-center">
            <Layers className="mr-2 h-6 w-6" />
            Available Programs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#1B3668] dark:text-white flex items-center">
                  <School className="mr-2 h-5 w-5" />
                  Ph.D. by Research in
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Computer Science & Engineering</li>
                  <li>Electrical Engineering</li>
                  <li>Electronics and Communication Engineering</li>
                  <li>Mechanical Engineering</li>
                  <li>Biotechnology</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#1B3668] dark:text-white flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Ph.D. in
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Commerce & Management</li>
                  <li>Science (Maths, Physics & Chemistry)</li>
                  <li>Computer Applications</li>
                  <li>Psychology</li>
                  <li>Nursing</li>
                  <li>Pharmacy</li>
                </ul>
                <p className="mt-4 text-[#1B3668] dark:text-blue-300 font-medium">
                  Candidates wishing to pursue research careers in interdisciplinary areas are especially encouraged.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Minimum Qualification */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1B3668] dark:text-white mb-6 flex items-center">
            <Award className="mr-2 h-6 w-6" />
            Minimum Qualification
          </h2>
          <Card className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-[#1B3668] dark:text-white">Ph.D. Eligibility Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <p>
                  A post-graduate degree in a related field of study from a UGC recognized university, with a minimum of
                  60% aggregate marks (or equivalent grade point average)
                </p>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p>Reservation Categories (as notified by Govt. of Karnataka): 10% relaxation</p>
                  <Badge variant="secondary" className="mt-2">
                    SC/ST/OBC/PwD candidates eligible for relaxation
                  </Badge>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-md mt-4">
                <p className="text-red-600 dark:text-red-300 font-medium">Distance Education Degrees: not recognized</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Eligibility for Award */}
        <div>
          <h2 className="text-2xl font-bold text-[#1B3668] dark:text-white mb-6 flex items-center">
            <BookMarked className="mr-2 h-6 w-6" />
            Eligibility for the Award of Ph.D. by Research Degree
          </h2>
          <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 shadow-lg">
            <CardContent className="pt-6">
              <ol className="list-decimal pl-5 space-y-3 text-gray-700 dark:text-gray-300">
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
                <li>Minimum duration requirement of THREE years for Ph.D. by Research</li>
                <li>No pending disciplinary action; and no dues of any kind to the University</li>
              </ol>

              <div className="mt-6 flex justify-center">
                <Button asChild>
                  <Link href="/login">Apply Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

