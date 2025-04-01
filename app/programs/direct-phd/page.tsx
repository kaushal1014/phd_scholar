import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  FileText,
  Award,
  ArrowRight,
  BookOpen,
  Zap,
  CheckCircle,
  Clock,
  BookMarked,
  Lightbulb,
  Layers,
} from "lucide-react"

export default function DirectPhDPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-gradient-to-r from-[#1B3668] to-[#0A2240] shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Direct Ph.D. Program</h1>
          <p className="text-blue-100 mt-2">For Current 6th & 8th Semester Students</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Key Dates */}

        {/* Program Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1B3668] dark:text-white mb-6 flex items-center">
            <BookOpen className="mr-2 h-6 w-6" />
            Program Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Eligibility</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>B.Tech. 6th Semester students with CGPA of 7.75 and above</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Preference given to students with published/submitted research papers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Must pass the Research Entrance Test and personal interview</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Available Disciplines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Computer Science & Engineering</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Electronics & Communication Engineering</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Electrical & Electronics Engineering</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Mechanical Engineering</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Biotechnology</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Program Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1B3668] dark:text-white mb-6 flex items-center">
            <Award className="mr-2 h-6 w-6" />
            Program Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                  Financial Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>₹15,000 monthly stipend from 7th Semester</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Eligible for ₹30,000+ monthly stipend after B.Tech completion</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Full tuition fee waiver</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>No application fee</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                  Research Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Exposure to international research</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Research internship in final semester</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Opportunity for interdisciplinary research</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Work in National/International Research Labs</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Layers className="mr-2 h-5 w-5 text-yellow-500" />
                  Program Flexibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Multiple exit options available</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Option to exit with M.Tech. by Research degree</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Opportunity to participate in university placements</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Program duration: 4-8 years</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Program Structure */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1B3668] dark:text-white mb-6 flex items-center">
            <BookMarked className="mr-2 h-6 w-6" />
            Program Structure
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Course Work</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Eight technical courses (minimum 4 credits each)</li>
                    <li>
                      Two mandatory courses:
                      <ul className="list-disc pl-5 mt-2">
                        <li>Research Methodology & Technical Communication (4 credits)</li>
                        <li>Research & Publication Ethics (2 credits)</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Publication Requirements</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Minimum of two journal articles in Scopus or Web of Science indexed journals</li>
                    <li>Student must be the first author on publications</li>
                    <li>Open Seminar-1 conducted after publication of first journal article</li>
                    <li>Doctoral Committee may recognize patents in lieu of one publication requirement</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Exit Options</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Complete both M.Tech. by Research and Ph.D. degrees</li>
                    <li>
                      Exit with M.Tech. by Research after completing required coursework and one journal publication
                    </li>
                    <li>Option to rejoin Ph.D. program within two years of exiting with additional requirements</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Process */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1B3668] dark:text-white mb-6 flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            Application Process
          </h2>
          <Card>
            <CardContent className="pt-6">
              <ol className="space-y-4 list-decimal pl-5">
                <li className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Submit Application:</span> Complete the application form with supporting
                  documents, including certificates, marks cards, two recommendation letters, and a Statement of
                  Purpose.
                </li>
                <li className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Entrance Exam:</span> Appear for the Research Entrance Test scheduled.
                </li>
                <li className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Personal Interview:</span> Shortlisted candidates will be called for a
                  personal interview.
                </li>
                <li className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Selection:</span> Final selection will be based on entrance test
                  performance and interview.
                </li>
                <li className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Research Internship:</span> Selected candidates complete their final
                  semester with a Research Internship in a Research Centre.
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-bold text-[#1B3668] dark:text-white mb-6 flex items-center">
            <Clock className="mr-2 h-6 w-6" />
            Contact Information
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-lg font-medium">Dean of Research, PES University</p>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Email: dean.research@pes.edu</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  For more information and to download the application form, visit:
                </p>
                <Button asChild className="mt-4">
                  <Link href="https://www.pes.edu/phd" target="_blank">
                    www.pes.edu/phd
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

