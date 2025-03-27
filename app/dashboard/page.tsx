"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Plus,
  Edit,
  User,
  Mail,
} from "lucide-react"
import type { User as UserType, PhdScholar } from "@/types"
import { ConferenceSlideshow } from "@/components/ConferenceSlideshow"
import { Announcements } from "@/components/Announcements"
import { DCMeetingPopup } from "@/components/DCMeetingPopup"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
// Add this to the imports at the top of the file
import { CourseCertificateUpload } from "@/components/course-certificate-upload"
import { CourseCertificateViewer } from "@/components/course-certificate-viewer"
import { Badge } from "@/components/ui/badge"
import UserEditForm from "@/components/user-edit-form"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<UserType | null>(null)
  const [phdScholarData, setPhdScholarData] = useState<PhdScholar | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDCMeetingPopup, setShowDCMeetingPopup] = useState(false)
  const [currentDCMeeting, setCurrentDCMeeting] = useState<any>(null)
  const [journeyProgress, setJourneyProgress] = useState(0)
  const [showJournalModal, setShowJournalModal] = useState(false)
  const [showConferenceModal, setShowConferenceModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const journalSchema = z.object({
    title: z.string().min(1, "Title is required"),
    journalName: z.string().min(1, "Journal name is required"),
    publicationYear: z.number().min(1900, "Publication year is required"),
    volumeNumber: z.string(),
    issueNumber: z.string(),
    pageNumbers: z.string(),
    impactFactor: z.string(),
    doi: z.string().url("DOI must be a valid URL"), // Add DOI field
  })

  const conferenceSchema = z.object({
    title: z.string().min(1, "Title is required"),
    conferenceName: z.string().min(1, "Conference name is required"),
    publicationYear: z.number().min(1900, "Publication year is required"),
    location: z.string().optional(),
  })

  const journalForm = useForm<z.infer<typeof journalSchema>>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: "",
      journalName: "",
      publicationYear: new Date().getFullYear(),
      volumeNumber: "",
      issueNumber: "",
      pageNumbers: "",
      impactFactor: "",
    },
  })

  const conferenceForm = useForm<z.infer<typeof conferenceSchema>>({
    resolver: zodResolver(conferenceSchema),
    defaultValues: {
      title: "",
      conferenceName: "",
      publicationYear: new Date().getFullYear(),
      location: "",
    },
  })

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetch(`/api/user/user`)
        .then((response) => response.json())
        .then((data) => {
          if (data.isAdmin) {
            router.push("/admin")
          }
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
    const pastMeeting = meetings.find(
      (meeting: any) => meeting.scheduledDate && new Date(meeting.scheduledDate) < now && !meeting.happened,
    )
    if (pastMeeting) {
      setCurrentDCMeeting(pastMeeting)
      if (pastMeeting.scheduledDate) {
        setShowDCMeetingPopup(true)
      }
    }
  }

  const handleAddJournal = async (data: z.infer<typeof journalSchema>) => {
    if (!session?.user?.id) return

    setIsSubmitting(true)

    try {
      // Ensure impactFactor is a number
      const journalData = {
        ...data,
        impactFactor: Number(data.impactFactor),
      }

      const response = await fetch(`/api/user/phd-scholar/publications/journals`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.id}`,
        },
        body: JSON.stringify({ phdId: Object(userData?.phdScholar), journal: journalData }), // Use phdId instead of userId
      })

      if (response.ok) {
        // Update local state
        setPhdScholarData((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            publications: {
              ...prev.publications,
              journals: [...(prev.publications?.journals || []), journalData],
            },
          }
        })

        journalForm.reset()
        setShowJournalModal(false)
      }
    } catch (error) {
      console.error("Error adding journal:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddConference = async (data: z.infer<typeof conferenceSchema>) => {
    if (!session?.user?.id) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/user/phd-scholar/publications/conferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.id}`,
        },
        body: JSON.stringify({ phdId: Object(userData?.phdScholar), conference: data }), // Use phdId instead of userId
      })

      if (response.ok) {
        // Update local state
        const updatedData = await response.json()
        setPhdScholarData((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            publications: {
              ...prev.publications,
              conferences: [...(prev.publications?.conferences || []), data],
            },
          }
        })

        conferenceForm.reset()
        setShowConferenceModal(false)
      }
    } catch (error) {
      console.error("Error adding conference:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filterNonEmptyPublications = (publications: PhdScholar["publications"]["journals"]) => {
    return publications.filter(
      (publication: PhdScholar["publications"]["journals"][0]) =>
        publication.title &&
        publication.journalName &&
        publication.publicationYear &&
        publication.volumeNumber &&
        publication.issueNumber &&
        publication.pageNumbers &&
        publication.impactFactor,
    )
  }

  const filterNonEmptyConferences = (conferences: PhdScholar["publications"]["conferences"]) => {
    return conferences.filter(
      (conference: PhdScholar["publications"]["conferences"][0]) =>
        conference.title && conference.conferenceName && conference.publicationYear,
    )
  }

  const filteredJournals = filterNonEmptyPublications(phdScholarData?.publications?.journals || [])
  const filteredConferences = filterNonEmptyConferences(phdScholarData?.publications?.conferences || [])

  const handleDCMeetingConfirmation = async (didHappen: boolean, newDate?: Date, summary?: string) => {
    if (!currentDCMeeting) return
    const updatedMeeting = {
      ...currentDCMeeting,
    }

    if (didHappen) {
      updatedMeeting.actualDate = currentDCMeeting.scheduledDate
      updatedMeeting.scheduledDate = currentDCMeeting.scheduledDate
      updatedMeeting.happened = true
      updatedMeeting.summary = summary
    } else {
      updatedMeeting.actualDate = null
      updatedMeeting.scheduledDate = newDate?.toISOString()
      updatedMeeting.happened = false
    }

    // Ensure that scheduledDate is set correctly
    if (!didHappen && newDate) {
      updatedMeeting.scheduledDate = newDate.toISOString()
    }

    try {
      const response = await fetch(`/api/user/phd-scholar/dc-meeting/latest`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.id}`,
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
    ) || null

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

  // First, let's add a function to get the next immediate milestone
  // Add this function near the other milestone-related functions
  // Add this function near the other milestone-related functions

  const getNextMilestone = (): Milestone | null => {
    const now = new Date()
    return (
      getMilestones()
        .filter((milestone) => milestone.date && new Date(milestone.date) > now)
        .sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : Number.POSITIVE_INFINITY
          const dateB = b.date ? new Date(b.date).getTime() : Number.POSITIVE_INFINITY
          return dateA - dateB
        })[0] || null
    )
  }

  const getStatus = () => {
    if (phdScholarData) {
      if (
        phdScholarData.phdMilestones?.awardOfDegreeDate &&
        new Date(phdScholarData.phdMilestones.awardOfDegreeDate) < new Date()
      ) {
        return `Completed on ${new Date(phdScholarData.phdMilestones.awardOfDegreeDate).toLocaleDateString()}`
      } else {
        // Check if admission date exists
        if (phdScholarData.admissionDetails?.admissionDate) {
          const admissionDate = new Date(phdScholarData.admissionDetails.admissionDate)
          const now = new Date()
          // Calculate years, ensuring we don't get unreasonable numbers
          const yearDiff = Math.floor((now.getTime() - admissionDate.getTime()) / (1000 * 60 * 60 * 24 * 365))

          // Validate the year difference is reasonable (between 0 and 15 years)
          if (yearDiff >= 0 && yearDiff <= 15) {
            return `${yearDiff} year${yearDiff !== 1 ? "s" : ""} in program`
          }
        }
        // Default return if admission date is missing or calculation is unreasonable
        return "In progress"
      }
    }
    return "Status unavailable"
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
    const journals = (phdScholarData?.publications?.journals || []).filter(
      (journal) => journal.title && journal.journalName && journal.publicationYear,
    )
    const conferences = (phdScholarData?.publications?.conferences || []).filter(
      (conference) => conference.title && conference.conferenceName && conference.publicationYear,
    )

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

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "Not Available"
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
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
          {/* Replace the Top Stats Row with this updated version */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <Card className="border-l-4 border-l-[#1B3668]">
              <CardContent className="p-4 flex items-center h-full">
                <div className="bg-[#1B3668]/10 p-3 rounded-full mr-4 flex-shrink-0">
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
              <CardContent className="p-4 flex items-center h-full">
                <div className="bg-[#F7941D]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <BookMarked className="h-6 w-6 text-[#F7941D]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Publications</p>
                  <p className="text-2xl font-bold text-[#F7941D]">
                    {(phdScholarData.publications?.journals || []).filter(
                      (journal) => journal.title && journal.journalName && journal.publicationYear,
                    ).length +
                      (phdScholarData.publications?.conferences || []).filter(
                        (conference) => conference.title && conference.conferenceName && conference.publicationYear,
                      ).length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#1B3668]">
              <CardContent className="p-4 flex items-center h-full">
                <div className="bg-[#1B3668]/10 p-3 rounded-full mr-4 flex-shrink-0">
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

            {/* New Card for Next Milestone */}
            <Card className="border-l-4 border-l-[#4C1D95]">
              <CardContent className="p-4 flex items-center h-full">
                <div className="bg-[#4C1D95]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Award className="h-6 w-6 text-[#4C1D95]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Milestone</p>
                  <p className="text-lg font-bold text-[#4C1D95]">{getNextMilestone()?.label || "None Scheduled"}</p>
                  <p className="text-xs text-muted-foreground">
                    {getNextMilestone()?.date ? new Date(getNextMilestone()?.date as string).toLocaleDateString() : ""}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#F7941D]">
              <CardContent className="p-4 flex items-center h-full">
                <div className="bg-[#F7941D]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Clock className="h-6 w-6 text-[#F7941D]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-bold text-[#F7941D]">{getStatus()}</p>
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
              <CardHeader className="pb-2 border-b"></CardHeader>
              <CardContent className="p-0">
                <Announcements />
              </CardContent>

              {/* Conferences */}
              <CardHeader className="pb-2 border-b"></CardHeader>
              <CardContent className="p-0">
                <ConferenceSlideshow />
              </CardContent>
            </div>

            {/* Middle Columns - Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="overview" className="h-full">
                {/* Update the TabsList for the main tabs (around line 650) */}
                <TabsList className="grid grid-cols-5 mb-4 text-base font-medium">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="supervision">Supervision</TabsTrigger>
                  <TabsTrigger value="publications">Publications</TabsTrigger>
                  <TabsTrigger value="coursework">Coursework</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
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
                          <Button
                            onClick={() => setIsEditing(true)}
                            className="ml-auto bg-[#1B3668] hover:bg-[#1B3668]/90"
                            size="sm"
                          >
                            <Edit className="h-4 w-4 mr-2" /> Edit Profile
                          </Button>
                        </div>

                        {/* Research Tools */}
                        <div>
                          <h2 className="text-lg font-bold mb-4 text-[#1B3668] flex items-center">
                            <FileText className="h-5 w-5 mr-2" /> Research Tools
                          </h2>
                          <p className="text-sm text-muted-foreground mb-4">
                            Helpful tools to enhance your research workflow
                          </p>

                          {/* Finding & Analyzing Papers */}
                          <div className="mb-4">
                            <h3 className="text-md font-semibold mb-2 text-[#1B3668]">Finding & Analyzing Papers</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <a
                                href="https://scholar.google.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <div className="bg-[#1B3668]/10 p-2 rounded-full mr-3">
                                  <BookMarked className="h-4 w-4 text-[#1B3668]" />
                                </div>
                                <div>
                                  <p className="font-medium text-[#1B3668]">Google Scholar</p>
                                  <p className="text-xs text-muted-foreground">
                                    Academic search engine for scholarly articles
                                  </p>
                                </div>
                                <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                              </a>

                              <a
                                href="https://scispace.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <div className="bg-[#1B3668]/10 p-2 rounded-full mr-3">
                                  <FileText className="h-4 w-4 text-[#1B3668]" />
                                </div>
                                <div>
                                  <p className="font-medium text-[#1B3668]">SciSpace</p>
                                  <p className="text-xs text-muted-foreground">
                                    AI-powered research assistant for papers
                                  </p>
                                </div>
                                <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                              </a>
                            </div>
                          </div>

                          {/* Writing & Managing References */}
                          <div className="mb-4">
                            <h3 className="text-md font-semibold mb-2 text-[#F7941D]">Writing & Managing References</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <a
                                href="https://www.zotero.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <div className="bg-[#F7941D]/10 p-2 rounded-full mr-3">
                                  <BookOpen className="h-4 w-4 text-[#F7941D]" />
                                </div>
                                <div>
                                  <p className="font-medium text-[#F7941D]">Zotero</p>
                                  <p className="text-xs text-muted-foreground">Open-source reference management tool</p>
                                </div>
                                <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                              </a>

                              <a
                                href="https://www.mendeley.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <div className="bg-[#F7941D]/10 p-2 rounded-full mr-3">
                                  <BookOpen className="h-4 w-4 text-[#F7941D]" />
                                </div>
                                <div>
                                  <p className="font-medium text-[#F7941D]">Mendeley</p>
                                  <p className="text-xs text-muted-foreground">Reference manager with PDF annotation</p>
                                </div>
                                <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                              </a>
                            </div>
                          </div>

                          {/* Assessment & Feedback */}
                          <div>
                            <h3 className="text-md font-semibold mb-2 text-[#1B3668]">Assessment & Feedback</h3>
                            <div className="grid grid-cols-1 gap-3">
                              <a
                                href="https://www.reviewmypaper.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <div className="bg-[#1B3668]/10 p-2 rounded-full mr-3">
                                  <FileText className="h-4 w-4 text-[#1B3668]" />
                                </div>
                                <div>
                                  <p className="font-medium text-[#1B3668]">Review My Paper</p>
                                  <p className="text-xs text-muted-foreground">
                                    Assessment & feedback for academic papers
                                  </p>
                                </div>
                                <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                              </a>
                            </div>
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

                {/* Profile Tab */}
                <TabsContent value="profile">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="md:col-span-1">
                      <CardHeader className="bg-[#003b7a]/5 border-b">
                        <CardTitle className="text-[#003b7a] flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Basic Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="bg-[#003b7a]/10 p-2 rounded-full">
                              <User className="h-5 w-5 text-[#003b7a]" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Full Name</p>
                              <p className="font-medium">
                                {userData.firstName} {userData.lastName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="bg-[#003b7a]/10 p-2 rounded-full">
                              <Mail className="h-5 w-5 text-[#003b7a]" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Email Address</p>
                              <p className="font-medium">{userData.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="bg-[#003b7a]/10 p-2 rounded-full">
                              <CheckCircle className="h-5 w-5 text-[#003b7a]" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Verification Status</p>
                              <div className="flex items-center gap-2">
                                <Badge variant={userData.isVerified ? "default" : "destructive"} className="mt-1">
                                  {userData.isVerified ? "Verified" : "Not Verified"}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="bg-[#003b7a]/10 p-2 rounded-full">
                              <GraduationCap className="h-5 w-5 text-[#003b7a]" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">User Role</p>
                              <div className="flex items-center gap-2">
                                <Badge variant={userData.isAdmin ? "destructive" : "default"} className="mt-1">
                                  {userData.isAdmin ? "Administrator" : "PhD Scholar"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                      <CardHeader className="bg-[#003b7a]/5 border-b">
                        <CardTitle className="text-[#003b7a] flex items-center gap-2">
                          <GraduationCap className="h-5 w-5" />
                          Admission Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Department</p>
                              <p className="font-medium">{phdScholarData.admissionDetails?.department}</p>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground">Admission Date</p>
                              <p className="font-medium">
                                {formatDate(phdScholarData.admissionDetails?.admissionDate)}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground">Entrance Examination</p>
                              <p className="font-medium">{phdScholarData.admissionDetails?.entranceExamination}</p>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground">Qualifying Examination</p>
                              <p className="font-medium">{phdScholarData.admissionDetails?.qualifyingExamination}</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Allotment Number</p>
                              <p className="font-medium">{phdScholarData.admissionDetails?.allotmentNumber}</p>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground">USN</p>
                              <p className="font-medium">{phdScholarData.admissionDetails?.usn}</p>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground">SRN</p>
                              <p className="font-medium">{phdScholarData.admissionDetails?.srn}</p>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground">Mode of Program</p>
                              <p className="font-medium">{phdScholarData.admissionDetails?.modeOfProgram}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                          <Button onClick={() => setIsEditing(true)} className="bg-[#1B3668] hover:bg-[#1B3668]/90">
                            <Edit className="h-4 w-4 mr-2" /> Edit Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Supervision Tab */}
                <TabsContent value="supervision">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="bg-[#003b7a]/5 border-b">
                        <CardTitle className="text-[#003b7a] flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Research Supervision
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Research Supervisor</p>
                            <p className="font-medium">{phdScholarData.researchSupervisor}</p>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground">Research Co-Supervisor</p>
                            <p className="font-medium">{phdScholarData.researchCoSupervisor || "Not Assigned"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="bg-[#003b7a]/5 border-b">
                        <CardTitle className="text-[#003b7a] flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Doctoral Committee
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {phdScholarData.doctoralCommittee?.members?.length > 0 ? (
                            phdScholarData.doctoralCommittee.members.map((member, index) => (
                              <div key={index}>
                                <p className="text-sm text-muted-foreground">Member {index + 1}</p>
                                <p className="font-medium">{member.name}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted-foreground italic">No doctoral committee members recorded.</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="mt-6">
                    <CardHeader className="bg-[#003b7a]/5 border-b">
                      <CardTitle className="text-[#003b7a] flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Doctoral Committee Meetings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {phdScholarData.phdMilestones?.dcMeetings?.DCM?.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b bg-[#003b7a]/5">
                                <th className="px-4 py-3 text-left font-medium text-[#003b7a]">Meeting No.</th>
                                <th className="px-4 py-3 text-left font-medium text-[#003b7a]">Scheduled Date</th>
                                <th className="px-4 py-3 text-left font-medium text-[#003b7a]">Actual Date</th>
                                <th className="px-4 py-3 text-left font-medium text-[#003b7a]">Status</th>
                                <th className="px-4 py-3 text-left font-medium text-[#003b7a]">Summary</th>
                              </tr>
                            </thead>
                            <tbody>
                              {phdScholarData.phdMilestones.dcMeetings.DCM.map((meeting, index) => (
                                <tr key={index} className="border-b hover:bg-[#003b7a]/5 transition-colors">
                                  <td className="px-4 py-3 font-medium">DC Meeting {index + 1}</td>
                                  <td className="px-4 py-3">{formatDate(meeting.scheduledDate)}</td>
                                  <td className="px-4 py-3">{formatDate(meeting.actualDate)}</td>
                                  <td className="px-4 py-3">
                                    <Badge variant={meeting.happened ? "default" : "outline"} className="bg-opacity-80">
                                      {meeting.happened ? "Completed" : "Scheduled"}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3">
                                    {meeting.summary ? (
                                      <p className="line-clamp-2">{meeting.summary}</p>
                                    ) : (
                                      <span className="text-muted-foreground italic">No summary available</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="bg-[#003b7a]/10 p-3 rounded-full mx-auto w-fit mb-4">
                            <Clock className="h-6 w-6 text-[#003b7a]" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">No DC Meetings Recorded</h3>
                          <p className="text-muted-foreground max-w-md mx-auto">
                            There are no doctoral committee meetings recorded for this PhD scholar yet.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Publications Tab */}
                <TabsContent value="publications" className="h-full">
                  <Card className="h-full">
                    <CardHeader className="pb-2 border-b">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg text-[#1B3668] flex items-center">
                          <BookMarked className="h-5 w-5 mr-2" /> Publications Analysis
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => setShowJournalModal(true)}
                            className="bg-[#1B3668] hover:bg-[#1B3668]/90"
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add Journal
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setShowConferenceModal(true)}
                            className="bg-[#F7941D] hover:bg-[#F7941D]/90"
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add Conference
                          </Button>
                        </div>
                      </div>
                      <CardDescription>Track your research output and impact</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 overflow-auto h-auto">
                      <div className="space-y-8">
                        {/* Journal Publications */}
                        <div>
                          <h3 className="text-md font-semibold mb-3 text-[#1B3668]">Journal Publications</h3>
                          <div className="space-y-4">
                            {filteredJournals.map((journal: any, i: number) => (
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
                                      <a
                                        href={journal.doi}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-blue-700 underline"
                                      >
                                        DOI
                                      </a>
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
                            {filterNonEmptyConferences(phdScholarData?.publications?.conferences || []).map(
                              (
                                conference: { title: string; conferenceName: string; publicationYear: number },
                                i: number,
                              ) => (
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
                              ),
                            )}
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

                {/* Coursework Tab */}
                <TabsContent value="coursework" className="h-full">
                  <Card className="h-full">
                    <CardHeader className="pb-2 border-b">
                      <CardTitle className="text-lg text-[#1B3668] flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" /> My Coursework
                      </CardTitle>
                      <CardDescription>Track your academic performance and certificates</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 overflow-auto h-auto">
                      <div className="space-y-8">
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

                        {/* Course Completion Certificates */}
                        <div>
                          <h3 className="text-md font-semibold mb-3 text-[#1B3668]">Course Completion Certificates</h3>
                          <div className="grid grid-cols-1 gap-4">
                            {(["courseWork1", "courseWork2", "courseWork3", "courseWork4"] as const).map(
                              (course, index) => (
                                <Card key={index} className="bg-white shadow-sm">
                                  <CardHeader className="pb-2 border-b">
                                    <CardTitle className="text-md font-semibold text-[#1B3668]">
                                      {phdScholarData[course]?.subjectName || `Course ${index + 1}`} Certificate
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-4">
                                    <div className="space-y-4">
                                      <CourseCertificateViewer
                                        phdId={userData.phdScholar.toString()}
                                        courseNumber={`courseWork${index + 1}`}
                                      />
                                      <CourseCertificateUpload
                                        phdId={userData.phdScholar.toString()}
                                        courseNumber={`courseWork${index + 1}`}
                                        onUploadSuccess={() => {
                                          // Force a refresh of the component
                                          const event = new CustomEvent("certificate-uploaded", {
                                            detail: { courseNumber: `courseWork${index + 1}` },
                                          })
                                          window.dispatchEvent(event)
                                        }}
                                      />
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

        {/* Edit Profile Modal */}
        {isEditing && userData && phdScholarData && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <UserEditForm
              userData={userData}
              phdScholarData={phdScholarData}
              onCancel={() => {
                setIsEditing(false)
                router.refresh()
              }}
            />
          </div>
        )}

        <DCMeetingPopup
          isOpen={showDCMeetingPopup}
          onClose={() => setShowDCMeetingPopup(false)}
          onConfirm={handleDCMeetingConfirmation}
          scheduledDate={currentDCMeeting ? new Date(currentDCMeeting.scheduledDate) : new Date()}
          summary={currentDCMeeting ? currentDCMeeting.summary : ""}
        />
        {/* Journal Modal */}
        <Dialog open={showJournalModal} onOpenChange={setShowJournalModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-[#1B3668]">Add Journal Publication</DialogTitle>
              <DialogDescription>Enter the details of your journal publication below.</DialogDescription>
            </DialogHeader>
            <Form {...journalForm}>
              <form onSubmit={journalForm.handleSubmit(handleAddJournal)} className="space-y-4">
                <FormField
                  control={journalForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Publication title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={journalForm.control}
                  name="journalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Journal Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Name of the journal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={journalForm.control}
                  name="publicationYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publication Year *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="YYYY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={journalForm.control}
                    name="volumeNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Volume Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Volume" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={journalForm.control}
                    name="issueNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Issue" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={journalForm.control}
                    name="pageNumbers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Numbers</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 123-145" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={journalForm.control}
                    name="impactFactor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Impact Factor</FormLabel>
                        <FormControl>
                          <Input step="0.01" placeholder="e.g. 3.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={journalForm.control}
                  name="doi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DOI</FormLabel>
                      <FormControl>
                        <Input placeholder="DOI URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowJournalModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#1B3668] hover:bg-[#1B3668]/90" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Journal"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Conference Modal */}
        <Dialog open={showConferenceModal} onOpenChange={setShowConferenceModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-[#F7941D]">Add Conference Publication</DialogTitle>
              <DialogDescription>Enter the details of your conference publication below.</DialogDescription>
            </DialogHeader>
            <Form {...conferenceForm}>
              <form onSubmit={conferenceForm.handleSubmit(handleAddConference)} className="space-y-4">
                <FormField
                  control={conferenceForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Publication title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={conferenceForm.control}
                  name="conferenceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conference Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Name of the conference" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={conferenceForm.control}
                    name="publicationYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publication Year *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="YYYY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={conferenceForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Conference location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowConferenceModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#F7941D] hover:bg-[#F7941D]/90" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Conference"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return null
}

