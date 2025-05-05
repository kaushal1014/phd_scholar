"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, AlertCircle, Loader2, FileText, BookOpen, Shield, Award } from "lucide-react"
import { useRouter } from "next/navigation"

interface DCMeeting {
  _id: string
  scheduledDate: string
  happened: boolean
  phdScholar: {
    _id: string
    user: {
      _id: string
    }
    personalDetails: {
      firstName: string
      lastName: string
    }
    admissionDetails: {
      department: string
    }
  }
}

interface Milestone {
  _id: string
  type: string
  date: string
  phdScholar: {
    _id: string
    user: {
      _id: string
    }
    personalDetails: {
      firstName: string
      lastName: string
    }
    admissionDetails: {
      department: string
    }
  }
}

export function AdminTracker() {
  const [upcomingMeetings, setUpcomingMeetings] = useState<DCMeeting[]>([])
  const [upcomingMilestones, setUpcomingMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchTrackerData = async () => {
      try {
        setLoading(true)

        // Fetch upcoming DC meetings
        const meetingsResponse = await fetch("/api/admin/tracker/meetings")
        if (!meetingsResponse.ok) {
          throw new Error("Failed to fetch upcoming meetings")
        }
        const meetingsData = await meetingsResponse.json()
        console.log(meetingsData)

        // Fetch upcoming milestones
        const milestonesResponse = await fetch("/api/admin/tracker/milestones")
        if (!milestonesResponse.ok) {
          throw new Error("Failed to fetch upcoming milestones")
        }
        const milestonesData = await milestonesResponse.json()
        console.log(milestonesData)
        setUpcomingMeetings(meetingsData.meetings || [])
        setUpcomingMilestones(milestonesData.milestones || [])
        setError(null)
      } catch (error) {
        console.error("Error fetching tracker data:", error)
        setError("Failed to load tracker data")
      } finally {
        setLoading(false)
      }
    }

    fetchTrackerData()
  }, [])

  useEffect(() => {
    console.log("Updated upcoming meetings:", upcomingMeetings)
  }, [upcomingMeetings])
  

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case "comprehensiveExamDate":
        return <BookOpen className="h-4 w-4" />
      case "proposalDefenseDate":
        return <FileText className="h-4 w-4" />
      case "openSeminarDate1":
        return <User className="h-4 w-4" />
      case "preSubmissionSeminarDate":
        return <FileText className="h-4 w-4" />
      case "synopsisSubmissionDate":
        return <FileText className="h-4 w-4" />
      case "thesisSubmissionDate":
        return <FileText className="h-4 w-4" />
      case "thesisDefenseDate":
        return <Shield className="h-4 w-4" />
      case "awardOfDegreeDate":
        return <Award className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getMilestoneName = (type: string) => {
    switch (type) {
      case "comprehensiveExamDate":
        return "Comprehensive Exam"
      case "proposalDefenseDate":
        return "Proposal Defense"
      case "openSeminarDate1":
        return "Open Seminar"
      case "preSubmissionSeminarDate":
        return "Pre-Submission Seminar"
      case "synopsisSubmissionDate":
        return "Synopsis Submission"
      case "thesisSubmissionDate":
        return "Thesis Submission"
      case "thesisDefenseDate":
        return "Thesis Defense"
      case "awardOfDegreeDate":
        return "Award of Degree"
      default:
        return type
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getDaysRemaining = (dateString: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const targetDate = new Date(dateString)
    targetDate.setHours(0, 0, 0, 0)

    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  const navigateToUser = (userId: string) => {
    router.push(`/admin/${userId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-[#1B3668]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-6 text-red-600">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span>{error}</span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-[#1B3668]">Admin Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="meetings">
          <TabsList className="mb-4">
            <TabsTrigger value="meetings">Upcoming DC Meetings</TabsTrigger>
            <TabsTrigger value="milestones">Upcoming Milestones</TabsTrigger>
          </TabsList>

          <TabsContent value="meetings">
            {upcomingMeetings.length > 0 ? (
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => {
                  if (!meeting?.phdScholar?.personalDetails || !meeting?.phdScholar?.admissionDetails) {
                    return null;
                  }
                  
                  const daysRemaining = getDaysRemaining(meeting.scheduledDate)

                  return (
                    <Card key={meeting._id} className="bg-white shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-[#1B3668]/10 p-3 rounded-full mr-4">
                              <Calendar className="h-5 w-5 text-[#1B3668]" />
                            </div>
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-medium text-[#1B3668]">
                                  {meeting.phdScholar.personalDetails.firstName}{" "}
                                  {meeting.phdScholar.personalDetails.lastName}
                                </h3>
                                <Badge
                                  className={`ml-2 ${
                                    daysRemaining <= 3
                                      ? "bg-red-500"
                                      : daysRemaining <= 7
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                  }`}
                                >
                                  {daysRemaining === 0
                                    ? "Today"
                                    : daysRemaining === 1
                                      ? "Tomorrow"
                                      : `${daysRemaining} days`}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Department: {meeting.phdScholar.admissionDetails.department}
                              </p>
                              <div className="flex items-center mt-1">
                                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                                <p className="text-sm text-muted-foreground">{formatDate(meeting.scheduledDate)}</p>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => navigateToUser((meeting.phdScholar.user._id).toString())}
                            className="bg-[#1B3668] hover:bg-[#1B3668]/90"
                          >
                            View Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No upcoming DC meetings</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="milestones">
            {upcomingMilestones.length > 0 ? (
              <div className="space-y-4">
                {upcomingMilestones.map((milestone) => {
                  const daysRemaining = getDaysRemaining(milestone.date)

                  return (
                    <Card key={milestone._id} className="bg-white shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-[#F7941D]/10 p-3 rounded-full mr-4">
                              {getMilestoneIcon(milestone.type)}
                            </div>
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-medium text-[#1B3668]">
                                  {milestone.phdScholar.personalDetails.firstName}{" "}
                                  {milestone.phdScholar.personalDetails.lastName}
                                </h3>
                                <Badge
                                  className={`ml-2 ${
                                    daysRemaining <= 3
                                      ? "bg-red-500"
                                      : daysRemaining <= 7
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                  }`}
                                >
                                  {daysRemaining === 0
                                    ? "Today"
                                    : daysRemaining === 1
                                      ? "Tomorrow"
                                      : `${daysRemaining} days`}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium text-[#F7941D]">{getMilestoneName(milestone.type)}</p>
                              <div className="flex items-center mt-1">
                                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                                <p className="text-sm text-muted-foreground">{formatDate(milestone.date)}</p>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => navigateToUser((milestone.phdScholar.user._id).toString())}
                            className="bg-[#1B3668] hover:bg-[#1B3668]/90"
                          >
                            View Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No upcoming milestones</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

