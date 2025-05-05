"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import type {PhdScholar } from "@/types"
import {
  Award,
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
  Mail,
  User,
  Users,
  CheckCircle,
  Clock,
  FileCheck,
  FileSpreadsheet,
  School,
  Shield,
  Loader2,
  CalendarCheck
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import AdminEditForm from "./update/AdminEditForm"
import { Button } from "@/components/ui/button"
import { AdminCertificateApproval } from "@/components/admin-certificate-approval"
import { Textarea } from "@/components/ui/textarea"
import {toast} from "react-toastify"

export interface UserType {
  id: string; // Added 'id' property
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  isAdmin: boolean;
  isSupervisor:boolean;
  notes: string;
  phdScholar: PhdScholar;
}

export default function UserDetail() {
  const [userData, setUserData] = useState<UserType | null>(null)
  const [phdScholarData, setPhdScholarData] = useState<PhdScholar | null>(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const notifyErr = (msg: string) => toast.error(msg);
  const notifySucc = (msg: string) => toast.success(msg);
  const notifyWarn = (msg: string) => toast.warn(msg);
  const notifyInfo = (msg: string) => toast.info(msg);

  useEffect(() => {
    if (!isEditing) {
      console.log("Refreshing data after edit...")
      router.refresh() 
    }
  }, [isEditing])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Make sure session is available before proceeding
        if (!session?.user?.id) {
          return
        }

        const userResponse = await fetch(`/api/user/user/${id}`, {
          headers: {
            Authorization: `Bearer ${session?.user?.id}`,
          },
        })

        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user data: ${userResponse.statusText}`)
        }

        const userData = await userResponse.json()
        console.log(userData)
        setUserData(userData.data)

        if (userData.data.phdScholar) {
          const phdResponse = await fetch(`/api/user/phd-scholar/${userData.data.phdScholar}`, {
            headers: {
              Authorization: `Bearer ${session?.user?.id}`,
            },
          })
          if (!phdResponse.ok) {
            throw new Error(`Failed to fetch PhD scholar data: ${phdResponse.statusText}`)
          }
          const phdData = await phdResponse.json()
          setPhdScholarData(phdData.data)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setLoading(false)
      }
    }

    // Check if session is loading or unavailable
    if (status === "loading") {
      return // Wait for the session to load
    }

    if (status === "authenticated" && (session?.user?.isAdmin || session.user.isSupervisor) && id) {
      fetchUser()
    } else if (status === "unauthenticated" || !session?.user?.isAdmin) {
      console.log("Redirecting to unauthorized page...")
      setLoading(false)
      router.push("/unauthorized")
    }
  }, [id, status, session, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
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
        </Card>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">User Not Found</CardTitle>
            <CardDescription className="text-center">
              The requested user could not be found in the system.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
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

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#003b7a]">User Profile</h1>
        <div className="flex items-center gap-2">
          {userData.isAdmin ? (
            <Badge variant="outline" className="px-3 py-1 text-sm bg-[#003b7a] text-white">
              Administrator
            </Badge>
          ) : (
            <>
              <Badge variant="outline" className="px-3 py-1 text-sm bg-[#003b7a] text-white">
                {userData.isSupervisor ? "Supervisor" : "Scholar"}
              </Badge>
              {session?.user?.isAdmin && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="ml-2">
                  Edit Profile
                </Button>
              )}
            </>
          )}
        </div>
      </div>

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
                  <div className="flex items-center gap-2 mt-1">
                    {userData.isVerified ? (
                      <Badge variant="destructive" className="bg-green-500 hover:bg-green-600">
                        Verified
                      </Badge>
                    ) : (
                      <VerifyUserButton
                        userId={userData._id}
                        onVerify={() => {
                          notifySucc("User Verified Successfully")
                          window.location.reload()
                        }}
                      />
                    )}
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
                      {userData.isAdmin ? "Administrator" : userData.isSupervisor ? "Supervisor" : "Scholar"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {phdScholarData && (
          <Card className="md:col-span-2">
            <CardHeader className="bg-[#003b7a]/5 border-b">
              <CardTitle className="text-[#003b7a] flex items-center gap-2">
                <School className="h-5 w-5" />
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
                    <p className="font-medium">{formatDate(phdScholarData.admissionDetails?.admissionDate)}</p>
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
            </CardContent>
          </Card>
        )}
      </div>
      <Card className="md:col-span-3 mt-6">
        <CardHeader className="bg-[#003b7a]/5 border-b">
          <CardTitle className="text-[#003b7a] flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Admin Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <AdminNotes userId={userData._id} />
        </CardContent>
      </Card>

      {phdScholarData && (
        <Tabs defaultValue="supervision" className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="supervision">Supervision</TabsTrigger>
            <TabsTrigger value="dcmeetings">DC Meetings</TabsTrigger>
            <TabsTrigger value="coursework">Course Work</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="publications">Publications</TabsTrigger>
          </TabsList>

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
          </TabsContent>

          <TabsContent value="dcmeetings">
            <Card>
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

          <TabsContent value="coursework">
            <Card>
              <CardHeader className="bg-[#003b7a]/5 border-b">
                <CardTitle className="text-[#003b7a] flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Work Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Course Work 1</CardTitle>
                      <CardDescription>{phdScholarData.courseWork1?.subjectCode}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Subject Name</p>
                          <p className="font-medium">{phdScholarData.courseWork1?.subjectName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Grade</p>
                          <Badge className="mt-1">{phdScholarData.courseWork1?.subjectGrade}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className="font-medium">{phdScholarData.courseWork1?.status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Eligibility Date</p>
                          <p className="font-medium">{formatDate(phdScholarData.courseWork1?.eligibilityDate)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Course Work 2</CardTitle>
                      <CardDescription>{phdScholarData.courseWork2?.subjectCode}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Subject Name</p>
                          <p className="font-medium">{phdScholarData.courseWork2?.subjectName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Grade</p>
                          <Badge className="mt-1">{phdScholarData.courseWork2?.subjectGrade}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className="font-medium">{phdScholarData.courseWork2?.status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Eligibility Date</p>
                          <p className="font-medium">{formatDate(phdScholarData.courseWork2?.eligibilityDate)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Course Work 3</CardTitle>
                      <CardDescription>{phdScholarData.courseWork3?.subjectCode}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Subject Name</p>
                          <p className="font-medium">{phdScholarData.courseWork3?.subjectName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Grade</p>
                          <Badge className="mt-1">{phdScholarData.courseWork3?.subjectGrade}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className="font-medium">{phdScholarData.courseWork3?.status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Eligibility Date</p>
                          <p className="font-medium">{formatDate(phdScholarData.courseWork3?.eligibilityDate)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Course Work 4</CardTitle>
                      <CardDescription>{phdScholarData.courseWork4?.subjectCode}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Subject Name</p>
                          <p className="font-medium">{phdScholarData.courseWork4?.subjectName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Grade</p>
                          <Badge className="mt-1">{phdScholarData.courseWork4?.subjectGrade}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className="font-medium">{phdScholarData.courseWork4?.status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Eligibility Date</p>
                          <p className="font-medium">{formatDate(phdScholarData.courseWork4?.eligibilityDate)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardContent>
                    {/* Certificate*/}
                    <div className="container mx-auto p-6">
                      <h1 className="text-3xl font-bold mb-6 text-[#003b7a]">Certificate Management</h1>
                      <AdminCertificateApproval
                        phdId={userData.phdScholar.toString()}
                        showAll={false}
                      ></AdminCertificateApproval>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones">
            <Card>
              <CardHeader className="bg-[#003b7a]/5 border-b">
                <CardTitle className="text-[#003b7a] flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  PhD Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 overflow-x-auto">
                <div className="flex flex-row items-start min-w-max pb-4">
                  {[
                    {
                      label: "Comprehensive Exam",
                      date: phdScholarData?.phdMilestones?.comprehensiveExamDate,
                      icon: <BookOpen className="h-4 w-4" />,
                    },
                    {
                      label: "Proposal Defense",
                      date: phdScholarData?.phdMilestones?.proposalDefenseDate,
                      icon: <FileText className="h-4 w-4" />,
                    },
                    {
                      label: "Open Seminar",
                      date: phdScholarData?.phdMilestones?.openSeminarDate1,
                      icon: <Users className="h-4 w-4" />,
                    },
                    {
                      label: "Pre-Submission Seminar",
                      date: phdScholarData?.phdMilestones?.preSubmissionSeminarDate,
                      icon: <FileSpreadsheet className="h-4 w-4" />,
                    },
                    {
                      label: "Synopsis Submission",
                      date: phdScholarData?.phdMilestones?.synopsisSubmissionDate,
                      icon: <FileCheck className="h-4 w-4" />,
                    },
                    {
                      label: "Thesis Submission",
                      date: phdScholarData?.phdMilestones?.thesisSubmissionDate,
                      icon: <FileText className="h-4 w-4" />,
                    },
                    {
                      label: "Thesis Defense",
                      date: phdScholarData?.phdMilestones?.thesisDefenseDate,
                      icon: <Shield className="h-4 w-4" />,
                    },
                    {
                      label: "Award of Degree",
                      date: phdScholarData?.phdMilestones?.awardOfDegreeDate,
                      icon: <Award className="h-4 w-4" />,
                    },      {
                      label: "Coursework 1 Completion",
                      date: phdScholarData?.phdMilestones?.courseworkCompletionDate?.coursework1?.toString(),
                      icon:<CalendarCheck className="h-4 w-4"/>
                    },
                    {
                      label: "Coursework 2 Completion",
                      date: phdScholarData?.phdMilestones?.courseworkCompletionDate?.coursework2?.toString(),
                      icon:<CalendarCheck className="h-4 w-4"/>
                    },
                    {
                      label: "Coursework 3 Completion",
                      date: phdScholarData?.phdMilestones?.courseworkCompletionDate?.coursework3?.toString(),
                      icon:<CalendarCheck className="h-4 w-4"/>
                    },
                    {
                      label: "Coursework 4 Completion",
                      date: phdScholarData?.phdMilestones?.courseworkCompletionDate?.coursework4?.toString(),
                      icon:<CalendarCheck className="h-4 w-4"/>
                    }
                  ].map((milestone, index, array) => {
                    const isCompleted = milestone.date ? new Date(milestone.date) <= new Date() : false
                    const isLast = index === array.length - 1

                    return (
                      <div key={index} className="flex flex-col items-center mx-4 relative">
                        {/* Milestone Indicator */}
                        <div className="relative flex items-center justify-center mb-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isCompleted ? "bg-[#003b7a]" : "bg-gray-300"
                            }`}
                          >
                            {isCompleted && <CheckCircle className="text-white w-5 h-5" />}
                          </div>
                        </div>

                        {/* Connecting line */}
                        {!isLast && (
                          <div
                            className={`absolute top-4 left-[calc(100%_-_8px)] h-0.5 w-8 ${
                              isCompleted ? "bg-[#003b7a]" : "bg-gray-300"
                            }`}
                          />
                        )}

                        {/* Milestone Details */}
                        <div className="flex flex-col items-center text-center w-32">
                          <div className={`mb-1 ${isCompleted ? "text-[#003b7a]" : "text-gray-400"}`}>
                            {milestone.icon}
                          </div>
                          <h3 className={`text-sm font-semibold ${isCompleted ? "text-[#003b7a]" : "text-gray-500"}`}>
                            {milestone.label}
                          </h3>
                          <p className={`text-xs ${isCompleted ? "text-gray-600" : "text-gray-400"}`}>
                            {milestone.date ? formatDate(milestone.date) : "Not scheduled"}
                          </p>
                          {isCompleted && <Badge className="mt-2 bg-green-500 hover:bg-green-600">Completed</Badge>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="publications">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader className="bg-[#003b7a]/5 border-b">
                  <CardTitle className="text-[#003b7a] flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Journal Publications
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {phdScholarData.publications?.journals?.length > 0 ? (
                    <div className="space-y-6">
                      {phdScholarData.publications.journals.map((journal, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-card">
                          <h3 className="font-semibold text-lg mb-2">{journal.title}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Journal Name</p>
                              <p className="font-medium">{journal.journalName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Publication Year</p>
                              <p className="font-medium">{journal.publicationYear}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Volume & Issue</p>
                              <p className="font-medium">
                                Vol. {journal.volumeNumber}, Issue {journal.issueNumber}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Page Numbers</p>
                              <p className="font-medium">{journal.pageNumbers}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Impact Factor</p>
                              <Badge variant="outline" className="mt-1">
                                {journal.impactFactor}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No journal publications recorded.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-[#003b7a]/5 border-b">
                  <CardTitle className="text-[#003b7a] flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Conference Publications
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {phdScholarData.publications?.conferences?.length > 0 ? (
                    <div className="space-y-6">
                      {phdScholarData.publications.conferences.map((conference, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-card">
                          <h3 className="font-semibold text-lg mb-2">{conference.title}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Conference Name</p>
                              <p className="font-medium">{conference.conferenceName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Publication Year</p>
                              <p className="font-medium">{conference.publicationYear}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No conference publications recorded.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
      {isEditing && phdScholarData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-background rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <AdminEditForm
              userData={userData}
              phdScholarData={phdScholarData}
              onCancel={() => {
                window.location.reload()
                setIsEditing(false)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Verify User Button Component
const VerifyUserButton = ({ userId, onVerify }: { userId: string; onVerify: () => void }) => {
  const [isVerifying, setIsVerifying] = useState(false)
  const notifyErr = (msg: string) => toast.error(msg);
  const notifySucc = (msg: string) => toast.success(msg);
  const notifyWarn = (msg: string) => toast.warn(msg);
  const notifyInfo = (msg: string) => toast.info(msg);

  const handleVerify = async () => {
    try {
      setIsVerifying(true)
      console.log(userId)
      const response = await fetch(`/api/user/verify/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to verify user")
      }

      onVerify()
    } catch (error) {
      console.error("Error verifying user:", error)
      notifyErr("Verification failed")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Button variant="default" size="sm" onClick={handleVerify} disabled={isVerifying} className="bg-[#003b7a]">
      {isVerifying ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Verifying...
        </>
      ) : (
        "Verify User"
      )}
    </Button>
  )
}

// Admin Notes Component
const AdminNotes = ({ userId }: { userId: string }) => {
  const [notes, setNotes] = useState("")
  const [originalNotes, setOriginalNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const notifyErr = (msg: string) => toast.error(msg);
  const notifySucc = (msg: string) => toast.success(msg);
  const notifyWarn = (msg: string) => toast.warn(msg);
  const notifyInfo = (msg: string) => toast.info(msg);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`/api/user/notes/${userId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch notes")
        }
        const data = await response.json()
        setNotes(data.notes)
        setOriginalNotes(data.notes)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching notes:", error)
        setIsLoading(false)
      }
    }

    fetchNotes()
  }, [userId])

  const handleSaveNotes = async () => {
    try {
      setIsSaving(true)
      const response = await fetch(`/api/user/notes/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      })

      if (!response.ok) {
        throw new Error("Failed to save notes")
      }

      setOriginalNotes(notes)
      notifySucc("Notes saved")
    } catch (error) {
      console.error("Error saving notes:", error)
      notifyErr("Failed to save notes")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-[#003b7a]" />
      </div>
    )
  }

  const hasChanges = notes !== originalNotes

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Add notes about this user here..."
        className="min-h-[150px] resize-y"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div className="flex justify-end">
        <Button variant="default" onClick={handleSaveNotes} disabled={isSaving || !hasChanges} className="bg-[#003b7a]">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Notes"
          )}
        </Button>
      </div>
    </div>
  )
}
