"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, BookMarked, Mail, Shield, CheckCircle, LogIn, Loader2 } from "lucide-react"
import type { User as UserType, PhdScholar } from "@/types"
import { ConferenceSlideshow } from "@/components/ConferenceSlideshow"
import { Announcements } from "@/components/Announcements"
import { DCMeetingPopup } from "@/components/DCMeetingPopup"
import { motion } from "framer-motion"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<UserType | null>(null)
  const [phdScholarData, setPhdScholarData] = useState<PhdScholar | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDCMeetingPopup, setShowDCMeetingPopup] = useState(false)
  const [currentDCMeeting, setCurrentDCMeeting] = useState<any>(null)

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
          checkPastDCMeetings(data.phdMilestones.dcMeetings.DCM)
        })
        .catch((error) => {
          console.error("Error fetching data:", error)
          setLoading(false)
        })
    }
  }, [status, session])

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
          if (!prevData || !currentDCMeeting) return prevData;
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
          };
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
  }

  const ClimbingAnimation = ({ milestones }: { milestones: Milestone[] }) => {
    const currentDate = new Date()
    return (
      <div className="relative">
        <div className="absolute left-2 top-0 h-full w-0.5 bg-[#1B3668]" />
        {milestones.map((milestone: Milestone, index: number) => {
          const isCompleted = milestone.date ? new Date(milestone.date) <= currentDate : false
          return (
            <motion.div
              key={index}
              className="flex items-center mb-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative">
                <motion.div
                  className={`absolute left-1 w-4 h-4 rounded-full flex items-center justify-center ${
                    isCompleted ? "bg-[#1B3668]" : "bg-gray-300"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                >
                  {isCompleted && <CheckCircle className="text-white w-3 h-3" />}
                </motion.div>
              </div>
              <div className="ml-8">
                <h3 className={`text-sm font-semibold ${isCompleted ? "text-[#1B3668]" : "text-gray-500"}`}>
                  {milestone.label}
                </h3>
                <p className={`text-xs ${isCompleted ? "text-gray-600" : "text-gray-400"}`}>
                  {milestone.date ? new Date(milestone.date).toLocaleDateString() : "Date not set"}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">PhD Research Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <LogIn className="h-16 w-16 text-primary mb-4" />
            <Button onClick={() => router.push("/login")} className="w-full">
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
            <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Please wait...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card className="border-t-4 border-t-[#1B3668]">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div>
                  <CardTitle className="text-2xl text-[#1B3668]">Welcome, {session.user.name}!</CardTitle>
                  <CardDescription>PhD Research Dashboard</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card className="border-t-4 border-t-[#1B3668] h-full">
                <CardHeader>
                  <CardTitle className="text-lg text-[#1B3668]">PhD Journey</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[calc(100vh-200px)]">
                  <ClimbingAnimation
                    milestones={[
                      {
                        label: "Comprehensive Exam",
                        date: phdScholarData.phdMilestones?.comprehensiveExamDate?.toString(),
                      },
                      {
                        label: "Proposal Defense",
                        date: phdScholarData.phdMilestones?.proposalDefenseDate?.toString(),
                      },
                      { label: "Open Seminar", date: phdScholarData.phdMilestones?.openSeminarDate1?.toString() },
                      {
                        label: "Pre-Submission Seminar",
                        date: phdScholarData.phdMilestones?.preSubmissionSeminarDate?.toString(),
                      },
                      {
                        label: "Synopsis Submission",
                        date: phdScholarData.phdMilestones?.synopsisSubmissionDate?.toString(),
                      },
                      {
                        label: "Thesis Submission",
                        date: phdScholarData.phdMilestones?.thesisSubmissionDate?.toString(),
                      },
                      { label: "Thesis Defense", date: phdScholarData.phdMilestones?.thesisDefenseDate?.toString() },
                      { label: "Award of Degree", date: phdScholarData.phdMilestones?.awardOfDegreeDate?.toString() },
                    ].sort((a, b) => {
                      const dateA = a.date ? new Date(a.date).getTime() : Number.POSITIVE_INFINITY
                      const dateB = b.date ? new Date(b.date).getTime() : Number.POSITIVE_INFINITY
                      return dateA - dateB
                    })}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card className="border-t-4 border-t-[#1B3668]">
                <CardHeader>
                  <CardTitle>PhD Scholar Details</CardTitle>
                  <CardDescription>Your academic journey at a glance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="flex items-center">
                      <GraduationCap className="h-6 w-6 mr-4 text-[#1B3668]" />
                      <div>
                        <p className="text-lg font-semibold">
                          {userData.firstName} {userData.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Department: {phdScholarData.admissionDetails.department}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold mb-4 text-[#1B3668]">Coursework Details</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(["courseWork1", "courseWork2", "courseWork3", "courseWork4"] as const).map(
                          (course, index) => (
                            <Card
                              key={index}
                              className="bg-white dark:bg-gray-800 shadow-md border-t-2 border-t-[#F7941D]"
                            >
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-semibold text-[#1B3668]">
                                  {phdScholarData[course]?.subjectName || "N/A"}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm">
                                  <span className="font-medium">Grade:</span>{" "}
                                  {phdScholarData[course]?.subjectGrade || "N/A"}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Status:</span> {phdScholarData[course]?.status || "N/A"}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Eligibility:</span>{" "}
                                  {phdScholarData[course]?.eligibilityDate
                                    ? new Date(phdScholarData[course].eligibilityDate).toLocaleDateString()
                                    : "N/A"}
                                </p>
                              </CardContent>
                            </Card>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold mb-4 text-[#1B3668]">Publications</h2>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-md font-semibold mb-3 text-[#1B3668]">Journals</h3>
                          <div className="grid grid-cols-1 gap-4">
                            {phdScholarData.publications?.journals?.map((journal, i) => (
                              <Card
                                key={i}
                                className="bg-white dark:bg-gray-800 shadow-md border-l-4 border-l-[#1B3668]"
                              >
                                <CardContent className="p-4">
                                  <h4 className="font-medium text-[#1B3668] mb-2">{journal.title}</h4>
                                  <p className="text-sm text-muted-foreground">Published in {journal.journalName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Year: {journal.publicationYear}, Vol: {journal.volumeNumber}, Issue:{" "}
                                    {journal.issueNumber}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Pages: {journal.pageNumbers}, Impact Factor: {journal.impactFactor}
                                  </p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-md font-semibold mb-3 text-[#F7941D]">Conferences</h3>
                          <div className="grid grid-cols-1 gap-4">
                            {phdScholarData.publications?.conferences?.map((conference, i) => (
                              <Card
                                key={i}
                                className="bg-white dark:bg-gray-800 shadow-md border-l-4 border-l-[#F7941D]"
                              >
                                <CardContent className="p-4">
                                  <h4 className="font-medium text-[#F7941D] mb-2">{conference.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Presented at {conference.conferenceName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">Year: {conference.publicationYear}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card className="border-t-4 border-t-[#1B3668]">
                <CardHeader>
                  <CardTitle className="text-[#1B3668]">Next DC Meeting</CardTitle>
                </CardHeader>
                <CardContent>
                  {nextDCMeeting && nextDCMeeting.scheduledDate ? (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#1B3668]">
                        {new Date(nextDCMeeting.scheduledDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Scheduled Date</p>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">No upcoming meetings scheduled</p>
                  )}
                </CardContent>
              </Card>

              <Announcements />

              <ConferenceSlideshow />
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

