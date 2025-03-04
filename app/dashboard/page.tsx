"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  GraduationCap,
  BookMarked,
  Shield,
  CheckCircle,
  LogIn,
  Loader2,
  Calendar,
  BarChart3,
  FileText,
  Award,
  Clock,
  Users,
  BookOpen,
  ChevronRight,
  AlertCircle,
} from "lucide-react"
import type { User as UserType, PhdScholar } from "@/types"
import { ConferenceSlideshow } from "@/components/ConferenceSlideshow"
import { Announcements } from "@/components/Announcements"
import { DCMeetingPopup } from "@/components/DCMeetingPopup"
import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<UserType | null>(null)
  const [phdScholarData, setPhdScholarData] = useState<PhdScholar | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDCMeetingPopup, setShowDCMeetingPopup] = useState(false)
  const [currentDCMeeting, setCurrentDCMeeting] = useState<any>(null)
  const [journeyProgress, setJourneyProgress] = useState(0)

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetch(`/api/user/user`)
        .then((response) => response.json())
        .then((data) => {
          setUserData(data)
          return fetch(`/api/user/phd-scholar/`)
        })
        .then((response) => response.json())
        .then((data) => {
          setPhdScholarData(data)
          setLoading(false)
          calculateJourneyProgress(data)
          if (data.phdMilestones?.dcMeetings?.DCM) {
            checkPastDCMeetings(data.phdMilestones.dcMeetings.DCM)
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error)
          setLoading(false)
        })
    }
  }, [status, session])

  const calculateJourneyProgress = (data: PhdScholar) => {
    const milestones = [
      data.phdMilestones?.comprehensiveExamDate,
      data.phdMilestones?.proposalDefenseDate,
      data.phdMilestones?.openSeminarDate1,
      data.phdMilestones?.preSubmissionSeminarDate,
      data.phdMilestones?.synopsisSubmissionDate,
      data.phdMilestones?.thesisSubmissionDate,
      data.phdMilestones?.thesisDefenseDate,
      data.phdMilestones?.awardOfDegreeDate,
    ]

    const completedMilestones = milestones.filter((date) => date && new Date(date) <= new Date()).length
    setJourneyProgress(Math.round((completedMilestones / milestones.length) * 100))
  }

  const checkPastDCMeetings = (meetings: any[]) => {
    const now = new Date()
    const pastMeeting = meetings.find((meeting: any) => new Date(meeting.scheduledDate) < now && !meeting.actualDate)
    if (pastMeeting) {
      setCurrentDCMeeting(pastMeeting)
      setShowDCMeetingPopup(true)
    }
  }

  const handleDCMeetingConfirmation = async (didHappen: boolean, newDate?: Date) => {
    if (!currentDCMeeting) return

    const updatedMeeting = {
      ...currentDCMeeting,
      actualDate: didHappen ? currentDCMeeting.scheduledDate : null,
      scheduledDate: didHappen ? currentDCMeeting.scheduledDate : newDate?.toISOString(),
    }

    try {
      const response = await fetch(`/api/user/phd-scholar/dc-meeting/${currentDCMeeting.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMeeting),
      })

      if (response.ok) {
        // Update the local state
        setPhdScholarData((prevData) => {
          if (!prevData || !currentDCMeeting) return prevData
          return {
            ...prevData,
            phdMilestones: {
              ...prevData.phdMilestones,
              dcMeetings: {
                ...prevData.phdMilestones.dcMeetings,
                DCM: prevData.phdMilestones.dcMeetings.DCM.map((meeting) =>
                  meeting.scheduledDate === currentDCMeeting.scheduledDate ? updatedMeeting : meeting,
                ),
              },
            },
          }
        })
      } else {
        console.error("Failed to update DC meeting")
      }
    } catch (error) {
      console.error("Error updating DC meeting:", error)
    }
  }

  const nextDCMeeting =
    phdScholarData?.phdMilestones.dcMeetings.DCM.find(
      (meeting) => meeting.scheduledDate && new Date(meeting.scheduledDate) > new Date(),
    ) ||
    phdScholarData?.phdMilestones.dcMeetings.DCM[phdScholarData?.phdMilestones.dcMeetings.DCM.length - 1] ||
    null

  interface Milestone {
    label: string
    date?: string
    icon: React.ReactNode
  }

  const getMilestones = (): Milestone[] => {
    return [
      {
        label: "Comprehensive Exam",
        date: phdScholarData?.phdMilestones?.comprehensiveExamDate?.toString(),
        icon: <BookOpen className="h-4 w-4" />,
      },
      {
        label: "Proposal Defense",
        date: phdScholarData?.phdMilestones?.proposalDefenseDate?.toString(),
        icon: <FileText className="h-4 w-4" />,
      },
      {
        label: "Open Seminar",
        date: phdScholarData?.phdMilestones?.openSeminarDate1?.toString(),
        icon: <Users className="h-4 w-4" />,
      },
      {
        label: "Pre-Submission Seminar",
        date: phdScholarData?.phdMilestones?.preSubmissionSeminarDate?.toString(),
        icon: <FileText className="h-4 w-4" />,
      },
      {
        label: "Synopsis Submission",
        date: phdScholarData?.phdMilestones?.synopsisSubmissionDate?.toString(),
        icon: <FileText className="h-4 w-4" />,
      },
      {
        label: "Thesis Submission",
        date: phdScholarData?.phdMilestones?.thesisSubmissionDate?.toString(),
        icon: <BookMarked className="h-4 w-4" />,
      },
      {
        label: "Thesis Defense",
        date: phdScholarData?.phdMilestones?.thesisDefenseDate?.toString(),
        icon: <Shield className="h-4 w-4" />,
      },
      {
        label: "Award of Degree",
        date: phdScholarData?.phdMilestones?.awardOfDegreeDate?.toString(),
        icon: <Award className="h-4 w-4" />,
      },
    ].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : Number.POSITIVE_INFINITY
      const dateB = b.date ? new Date(b.date).getTime() : Number.POSITIVE_INFINITY
      return dateA - dateB
    })
  }

  const ClimbingAnimation = ({ milestones }: { milestones: Milestone[] }) => {
    const currentDate = new Date()
  
    return (
      <div className="relative flex flex-col items-start">
        {/* Dynamic vertical line */}
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-[#1B3668]" style={{ height: `calc(100% - 1rem)` }} />
  
        {milestones.map((milestone: Milestone, index: number) => {
          const isCompleted = milestone.date ? new Date(milestone.date) <= currentDate : false
  
          return (
            <motion.div
              key={index}
              className="flex items-center space-y-4 relative"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Milestone Indicator */}
              <div className="relative flex items-center">
                <motion.div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    isCompleted ? "bg-[#1B3668]" : "bg-gray-300"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                >
                  {isCompleted && <CheckCircle className="text-white w-3 h-3" />}
                </motion.div>
              </div>
  
              {/* Milestone Details */}
              <div className="ml-6 flex items-center">
                <div className={`mr-2 ${isCompleted ? "text-[#1B3668]" : "text-gray-400"}`}>{milestone.icon}</div>
                <div>
                  <h3 className={`text-sm font-semibold ${isCompleted ? "text-[#1B3668]" : "text-gray-500"}`}>
                    {milestone.label}
                  </h3>
                  <p className={`text-xs ${isCompleted ? "text-gray-600" : "text-gray-400"}`}>
                    {milestone.date ? new Date(milestone.date).toLocaleDateString() : "Date not set"}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    )
  }
  

  // Generate publication data for charts
  const getPublicationData = () => {
    const journals = phdScholarData?.publications?.journals || []
    const conferences = phdScholarData?.publications?.conferences || []

    // Publications by year
    const publicationsByYear: Record<string, { journals: number; conferences: number }> = {}

    // Process journals
    journals.forEach((journal) => {
      const year = journal.publicationYear.toString()
      if (!publicationsByYear[year]) {
        publicationsByYear[year] = { journals: 0, conferences: 0 }
      }
      publicationsByYear[year].journals++
    })

    // Process conferences
    conferences.forEach((conference) => {
      const year = conference.publicationYear.toString()
      if (!publicationsByYear[year]) {
        publicationsByYear[year] = { journals: 0, conferences: 0 }
      }
      publicationsByYear[year].conferences++
    })

    // Convert to array for charts
    const yearlyData = Object.keys(publicationsByYear)
      .map((year) => ({
        year,
        journals: publicationsByYear[year].journals,
        conferences: publicationsByYear[year].conferences,
        total: publicationsByYear[year].journals + publicationsByYear[year].conferences,
      }))
      .sort((a, b) => Number.parseInt(a.year) - Number.parseInt(b.year))

    // Publication types pie chart data
    const publicationTypes = [
      { name: "Journals", value: journals.length, color: "#1B3668" },
      { name: "Conferences", value: conferences.length, color: "#F7941D" },
    ]

    return {
      yearlyData,
      publicationTypes,
    }
  }

  // Generate coursework data for charts
  const getCourseWorkData = () => {
    const courses = [
      phdScholarData?.courseWork1,
      phdScholarData?.courseWork2,
      phdScholarData?.courseWork3,
      phdScholarData?.courseWork4,
    ].filter(Boolean)

    // Map grades to numeric values for visualization
    const gradeMap: Record<string, number> = {
      "A+": 10,
      A: 9,
      "B+": 8,
      B: 7,
      "C+": 6,
      C: 5,
      D: 4,
      F: 0,
    }

    const courseData = courses.map((course) => ({
      name: course?.subjectName || "Unknown",
      grade: course?.subjectGrade || "N/A",
      gradeValue: course?.subjectGrade ? gradeMap[course.subjectGrade] || 0 : 0,
      status: course?.status || "Unknown",
    }))

    return courseData
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">PhD Research Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <LogIn className="h-16 w-16 text-[#1B3668] mb-4" />
            <Button onClick={() => router.push("/login")} className="w-full bg-[#1B3668] hover:bg-[#1B3668]/90">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading || status === "loading" || !userData || !phdScholarData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">PhD Research Dashboard</CardTitle>
            <CardDescription>Loading your data</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Loader2 className="h-16 w-16 text-[#1B3668] animate-spin mb-4" />
            <p className="text-muted-foreground">Please wait...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const publicationData = getPublicationData()
  const courseWorkData = getCourseWorkData()

  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-0">
        {/* Header */}
        <div className="bg-[#1B3668] text-white p-4">
          <div className="max-w-[2000px] mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <GraduationCap className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">PhD Research Analytics</h1>
                <p className="text-sm opacity-80">PES University</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">{session.user.name}</p>
                <p className="text-sm opacity-80">{phdScholarData.admissionDetails.department}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                {session.user.name?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[2000px] mx-auto p-4 lg:p-6">
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border-l-4 border-l-[#1B3668]">
              <CardContent className="p-4 flex items-center">
                <div className="bg-[#1B3668]/10 p-3 rounded-full mr-4">
                  <BarChart3 className="h-6 w-6 text-[#1B3668]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">PhD Progress</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-[#1B3668]">{journeyProgress}%</p>
                    <Progress value={journeyProgress} className="h-2 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#F7941D]">
              <CardContent className="p-4 flex items-center">
                <div className="bg-[#F7941D]/10 p-3 rounded-full mr-4">
                  <BookMarked className="h-6 w-6 text-[#F7941D]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Publications</p>
                  <p className="text-2xl font-bold text-[#F7941D]">
                    {(phdScholarData.publications?.journals?.length || 0) +
                      (phdScholarData.publications?.conferences?.length || 0)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#1B3668]">
              <CardContent className="p-4 flex items-center">
                <div className="bg-[#1B3668]/10 p-3 rounded-full mr-4">
                  <Calendar className="h-6 w-6 text-[#1B3668]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next DC Meeting</p>
                  <p className="text-lg font-bold text-[#1B3668]">
                    {nextDCMeeting && nextDCMeeting.scheduledDate
                      ? new Date(nextDCMeeting.scheduledDate).toLocaleDateString()
                      : "Not Scheduled"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#F7941D]">
              <CardContent className="p-4 flex items-center">
                <div className="bg-[#F7941D]/10 p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-[#F7941D]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time in Program</p>
                  <p className="text-lg font-bold text-[#F7941D]">
                    {phdScholarData.admissionDetails.admissionDate
                      ? `${Math.floor(
                          (new Date().getTime() - new Date(phdScholarData.admissionDetails.admissionDate).getTime()) /
                            (1000 * 60 * 60 * 24 * 365),
                        )} years`
                      : "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column - PhD Journey */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-lg text-[#1B3668] flex items-center">
                    <Award className="h-5 w-5 mr-2" /> PhD Journey
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 overflow-auto h-auto">
                  <ClimbingAnimation milestones={getMilestones()} />
                </CardContent>
              </Card>
              
              {/* Announcements */}
              <CardHeader className="pb-2 border-b">
                </CardHeader>
                <CardContent className="p-0">
                  <Announcements />
                </CardContent>
                
                {/* Conferences */}
                <CardHeader className="pb-2 border-b">
                </CardHeader>
                <CardContent className="p-0">
                  <ConferenceSlideshow />
                </CardContent>
            </div>

            {/* Middle Columns - Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="overview" className="h-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="publications">Publications</TabsTrigger>
                  <TabsTrigger value="coursework">Coursework</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="h-full">
                  <Card className="h-full">
                    <CardHeader className="pb-2 border-b">
                      <CardTitle className="text-lg text-[#1B3668] flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" /> Research Overview
                      </CardTitle>
                      <CardDescription>Your academic journey at a glance</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 overflow-auto h-auto">
                      <div className="space-y-8">
                        {/* Scholar Info */}
                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                          <GraduationCap className="h-10 w-10 mr-6 text-[#1B3668]" />
                          <div>
                            <p className="text-xl font-semibold text-[#1B3668]">
                              {userData.firstName} {userData.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Department: {phdScholarData.admissionDetails.department}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Admission Date:{" "}
                              {phdScholarData.admissionDetails.admissionDate
                                ? new Date(phdScholarData.admissionDetails.admissionDate).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Publication Summary */}
                        <div>
                          <h2 className="text-lg font-bold mb-4 text-[#1B3668] flex items-center">
                            <FileText className="h-5 w-5 mr-2" /> Publication Summary
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="bg-white shadow-sm border-t-2 border-t-[#1B3668]">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-md">Journal Articles</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between">
                                  <span className="text-3xl font-bold text-[#1B3668]">
                                    {phdScholarData.publications?.journals?.length || 0}
                                  </span>
                                  <BookOpen className="h-8 w-8 text-[#1B3668]/20" />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="bg-white shadow-sm border-t-2 border-t-[#F7941D]">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-md">Conference Papers</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between">
                                  <span className="text-3xl font-bold text-[#F7941D]">
                                    {phdScholarData.publications?.conferences?.length || 0}
                                  </span>
                                  <Users className="h-8 w-8 text-[#F7941D]/20" />
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>

                        {/* Publication Trend */}
                        <div>
                          <h2 className="text-lg font-bold mb-4 text-[#1B3668]">Publication Trend</h2>
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={publicationData.yearlyData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                  type="monotone"
                                  dataKey="journals"
                                  stackId="1"
                                  stroke="#1B3668"
                                  fill="#1B3668"
                                  name="Journals"
                                />
                                <Area
                                  type="monotone"
                                  dataKey="conferences"
                                  stackId="1"
                                  stroke="#F7941D"
                                  fill="#F7941D"
                                  name="Conferences"
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Upcoming Milestones */}
                        <div>
                          <h2 className="text-lg font-bold mb-4 text-[#1B3668] flex items-center">
                            <Calendar className="h-5 w-5 mr-2" /> Upcoming Milestones
                          </h2>
                          <div className="space-y-3">
                            {getMilestones()
                              .filter((milestone) => !milestone.date || new Date(milestone.date) > new Date())
                              .slice(0, 3)
                              .map((milestone, index) => (
                                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                  <div className="bg-[#1B3668]/10 p-2 rounded-full mr-3">{milestone.icon}</div>
                                  <div>
                                    <p className="font-medium text-[#1B3668]">{milestone.label}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {milestone.date ? new Date(milestone.date).toLocaleDateString() : "Not scheduled"}
                                    </p>
                                  </div>
                                  <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                                </div>
                              ))}
                            {getMilestones().filter(
                              (milestone) => !milestone.date || new Date(milestone.date) > new Date(),
                            ).length === 0 && (
                              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <AlertCircle className="h-5 w-5 mr-3 text-[#F7941D]" />
                                <p className="text-muted-foreground">No upcoming milestones</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="publications" className="h-full">
                  <Card className="h-full">
                    <CardHeader className="pb-2 border-b">
                      <CardTitle className="text-lg text-[#1B3668] flex items-center">
                        <BookMarked className="h-5 w-5 mr-2" /> Publications Analysis
                      </CardTitle>
                      <CardDescription>Track your research output and impact</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 overflow-auto h-auto">
                      <div className="space-y-8">
                        {/* Publication Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-md font-semibold mb-3 text-[#1B3668]">Publication Types</h3>
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={publicationData.publicationTypes}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                  >
                                    {publicationData.publicationTypes.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                  <Legend />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-md font-semibold mb-3 text-[#1B3668]">Publications by Year</h3>
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={publicationData.yearlyData}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="year" />
                                  <YAxis />
                                  <Tooltip />
                                  <Legend />
                                  <Bar dataKey="journals" name="Journals" fill="#1B3668" />
                                  <Bar dataKey="conferences" name="Conferences" fill="#F7941D" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>

                        {/* Journal Publications */}
                        <div>
                          <h3 className="text-md font-semibold mb-3 text-[#1B3668]">Journal Publications</h3>
                          <div className="space-y-4">
                            {phdScholarData.publications?.journals?.map((journal, i) => (
                              <Card key={i} className="bg-white shadow-sm border-l-4 border-l-[#1B3668]">
                                <CardContent className="p-4">
                                  <h4 className="font-medium text-[#1B3668] mb-2">{journal.title}</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <p className="text-muted-foreground">
                                        <span className="font-medium text-gray-700">Journal:</span>{" "}
                                        {journal.journalName}
                                      </p>
                                      <p className="text-muted-foreground">
                                        <span className="font-medium text-gray-700">Year:</span>{" "}
                                        {journal.publicationYear}
                                      </p>
                                      <p className="text-muted-foreground">
                                        <span className="font-medium text-gray-700">Volume:</span>{" "}
                                        {journal.volumeNumber}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">
                                        <span className="font-medium text-gray-700">Issue:</span> {journal.issueNumber}
                                      </p>
                                      <p className="text-muted-foreground">
                                        <span className="font-medium text-gray-700">Pages:</span> {journal.pageNumbers}
                                      </p>
                                      <p className="text-muted-foreground">
                                        <span className="font-medium text-gray-700">Impact Factor:</span>{" "}
                                        {journal.impactFactor}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                            {(!phdScholarData.publications?.journals ||
                              phdScholarData.publications.journals.length === 0) && (
                              <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <p className="text-muted-foreground">No journal publications yet</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Conference Publications */}
                        <div>
                          <h3 className="text-md font-semibold mb-3 text-[#F7941D]">Conference Publications</h3>
                          <div className="space-y-4">
                            {phdScholarData.publications?.conferences?.map((conference, i) => (
                              <Card key={i} className="bg-white shadow-sm border-l-4 border-l-[#F7941D]">
                                <CardContent className="p-4">
                                  <h4 className="font-medium text-[#F7941D] mb-2">{conference.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-gray-700">Conference:</span>{" "}
                                    {conference.conferenceName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-gray-700">Year:</span>{" "}
                                    {conference.publicationYear}
                                  </p>
                                </CardContent>
                              </Card>
                            ))}
                            {(!phdScholarData.publications?.conferences ||
                              phdScholarData.publications.conferences.length === 0) && (
                              <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <p className="text-muted-foreground">No conference publications yet</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="coursework" className="h-full">
                  <Card className="h-full">
                    <CardHeader className="pb-2 border-b">
                      <CardTitle className="text-lg text-[#1B3668] flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" /> Coursework Analysis
                      </CardTitle>
                      <CardDescription>Track your academic performance</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 overflow-auto h-auto">
                      <div className="space-y-8">
                        {/* Grade Distribution */}
                        <div>
                          <h3 className="text-md font-semibold mb-3 text-[#1B3668]">Grade Distribution</h3>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={courseWorkData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 10]} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="gradeValue" name="Grade Value" fill="#1B3668" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Coursework Details */}
                        <div>
                          <h3 className="text-md font-semibold mb-3 text-[#1B3668]">Coursework Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(["courseWork1", "courseWork2", "courseWork3", "courseWork4"] as const).map(
                              (course, index) => (
                                <Card key={index} className="bg-white shadow-sm border-t-2 border-t-[#F7941D]">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-md font-semibold text-[#1B3668]">
                                      {phdScholarData[course]?.subjectName || "N/A"}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="bg-gray-50 p-2 rounded">
                                        <p className="text-xs text-muted-foreground">Grade</p>
                                        <p className="text-lg font-bold text-[#1B3668]">
                                          {phdScholarData[course]?.subjectGrade || "N/A"}
                                        </p>
                                      </div>
                                      <div className="bg-gray-50 p-2 rounded">
                                        <p className="text-xs text-muted-foreground">Status</p>
                                        <p className="text-sm font-medium">{phdScholarData[course]?.status || "N/A"}</p>
                                      </div>
                                    </div>
                                    <div className="mt-2">
                                      <p className="text-xs text-muted-foreground">Eligibility Date</p>
                                      <p className="text-sm">
                                        {phdScholarData[course]?.eligibilityDate
                                          ? new Date(phdScholarData[course].eligibilityDate).toLocaleDateString()
                                          : "N/A"}
                                      </p>
                                    </div>
                                  </CardContent>
                                </Card>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        <DCMeetingPopup
          isOpen={showDCMeetingPopup}
          onClose={() => setShowDCMeetingPopup(false)}
          onConfirm={handleDCMeetingConfirmation}
          scheduledDate={currentDCMeeting ? new Date(currentDCMeeting.scheduledDate) : new Date()}
        />
      </div>
    )
  }

  return null
}

