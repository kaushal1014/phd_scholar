"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, FileText, BookOpen, Shield, Award, Mail, User, CheckCircle, GraduationCap, Clock } from "lucide-react"

function formatDate(date) {
  if (!date) return "Not Available"
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function ScholarDetailPage() {
  const { id } = useParams()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [scholar, setScholar] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchScholar = async () => {
      const res = await fetch(`/api/user/phd-scholar/${id}`)
      if (res.ok) {
        const data = await res.json()
        setScholar(data.data)
        // Fetch user details
        if (data.data?.user) {
          const userRes = await fetch(`/api/user/user/${data.data.user}`)
          if (userRes.ok) {
            const userData = await userRes.json()
            setUser(userData.data)
          }
        }
      }
      setLoading(false)
    }
    if (status === "authenticated" && session?.user?.isSupervisor) {
      fetchScholar()
    } else if (status === "unauthenticated" || !session?.user?.isSupervisor) {
      router.push("/unauthorized")
    }
  }, [id, status, session, router])

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  if (!scholar) return <div className="flex justify-center items-center min-h-screen">Scholar not found.</div>

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#003b7a] flex items-center gap-2">
          <User className="h-7 w-7" /> Scholar Profile
        </h1>
        <Badge variant="outline" className="px-3 py-1 text-sm bg-[#003b7a] text-white">
          View Only
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-1">
          <CardHeader className="bg-[#003b7a]/5 border-b">
            <CardTitle className="text-[#003b7a] flex items-center gap-2">
              <User className="h-5 w-5" /> Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-[#003b7a]/10 p-2 rounded-full">
                <User className="h-5 w-5 text-[#003b7a]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{scholar.personalDetails.firstName} {scholar.personalDetails.lastName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-[#003b7a]/10 p-2 rounded-full">
                <Mail className="h-5 w-5 text-[#003b7a]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium">{user?.email || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader className="bg-[#003b7a]/5 border-b">
            <CardTitle className="text-[#003b7a] flex items-center gap-2">
              <GraduationCap className="h-5 w-5" /> Admission Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-medium">{scholar.admissionDetails.department}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">USN</p>
              <p className="font-medium">{scholar.admissionDetails.usn}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">SRN</p>
              <p className="font-medium">{scholar.admissionDetails.srn || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admission Date</p>
              <p className="font-medium">{formatDate(scholar.admissionDetails.admissionDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mode of Program</p>
              <p className="font-medium">{scholar.admissionDetails.modeOfProgram || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Allotment Number</p>
              <p className="font-medium">{scholar.admissionDetails.allotmentNumber || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Entrance Examination</p>
              <p className="font-medium">{scholar.admissionDetails.entranceExamination || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Qualifying Examination</p>
              <p className="font-medium">{scholar.admissionDetails.qualifyingExamination || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">{scholar.phdMilestones.thesisDefenseDate ? "Completed" : "In Progress"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="supervision" className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="supervision">Supervision</TabsTrigger>
          <TabsTrigger value="dcmeetings">DC Meetings</TabsTrigger>
          <TabsTrigger value="coursework">Course Work</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="publications">Publications</TabsTrigger>
        </TabsList>
        <TabsContent value="supervision">
          <Card className="border shadow-sm">
            <CardHeader className="bg-[#003b7a]/5 border-b">
              <CardTitle className="text-[#003b7a] flex items-center gap-2"><Users className="h-5 w-5" />Research Supervision</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Research Supervisor</p>
                <p className="font-medium">{scholar.researchSupervisor || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Research Co-Supervisor</p>
                <p className="font-medium">{scholar.researchCoSupervisor || "Not Assigned"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="dcmeetings">
          <Card className="border shadow-sm">
            <CardHeader className="bg-[#003b7a]/5 border-b">
              <CardTitle className="text-[#003b7a] flex items-center gap-2"><Calendar className="h-5 w-5" />DC Meetings</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {scholar.phdMilestones?.dcMeetings?.DCM?.length > 0 ? (
                <ul className="space-y-2">
                  {scholar.phdMilestones.dcMeetings.DCM.map((meeting, idx) => (
                    <li key={meeting._id || idx} className="border-b pb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#003b7a]" />
                        <span><b>Date:</b> {formatDate(meeting.scheduledDate)}</span>
                      </div>
                      <div><b>Status:</b> {meeting.happened ? "Completed" : "Upcoming"}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>No DC meetings found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="coursework">
          <Card className="border shadow-sm">
            <CardHeader className="bg-[#003b7a]/5 border-b">
              <CardTitle className="text-[#003b7a] flex items-center gap-2"><BookOpen className="h-5 w-5" />Course Work</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {[1,2,3,4].map((num) => {
                const cw = scholar[`courseWork${num}`]
                if (!cw) return null
                return (
                  <div key={num} className="mb-4 p-2 border rounded">
                    <div><b>Subject Code:</b> {cw.subjectCode}</div>
                    <div><b>Subject Name:</b> {cw.subjectName}</div>
                    <div><b>Grade:</b> <Badge>{cw.subjectGrade}</Badge></div>
                    <div><b>Status:</b> {cw.status}</div>
                    <div><b>Eligibility Date:</b> {formatDate(cw.eligibilityDate)}</div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="milestones">
          <Card className="border shadow-sm">
            <CardHeader className="bg-[#003b7a]/5 border-b">
              <CardTitle className="text-[#003b7a] flex items-center gap-2"><Award className="h-5 w-5" />PhD Milestones</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                {[
                  { label: "Comprehensive Exam", date: scholar.phdMilestones?.comprehensiveExamDate },
                  { label: "Proposal Defense", date: scholar.phdMilestones?.proposalDefenseDate },
                  { label: "Open Seminar", date: scholar.phdMilestones?.openSeminarDate1 },
                  { label: "Pre-Submission Seminar", date: scholar.phdMilestones?.preSubmissionSeminarDate },
                  { label: "Synopsis Submission", date: scholar.phdMilestones?.synopsisSubmissionDate },
                  { label: "Thesis Submission", date: scholar.phdMilestones?.thesisSubmissionDate },
                  { label: "Thesis Defense", date: scholar.phdMilestones?.thesisDefenseDate },
                  { label: "Award of Degree", date: scholar.phdMilestones?.awardOfDegreeDate },
                ].map((milestone, idx) => (
                  <li key={idx}>
                    <b>{milestone.label}:</b> {formatDate(milestone.date)}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="publications">
          <Card className="border shadow-sm">
            <CardHeader className="bg-[#003b7a]/5 border-b">
              <CardTitle className="text-[#003b7a] flex items-center gap-2"><FileText className="h-5 w-5" />Publications</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {scholar.publications && scholar.publications.length > 0 ? (
                <ul className="space-y-2">
                  {scholar.publications.map((pub, idx) => (
                    <li key={idx} className="border-b pb-2">
                      <div><b>Title:</b> {pub.title}</div>
                      <div><b>Journal:</b> {pub.journal}</div>
                      <div><b>Year:</b> {pub.year}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>No publications found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 