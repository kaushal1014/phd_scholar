'use client'
import React, { useState, useEffect } from "react"
import { useRouter, useParams } from 'next/navigation'
import { User as UserType, PhdScholar } from "@/types"
import { Award, BookOpen, Calendar, FileText, GraduationCap, Mail, User, Users, CheckCircle, Clock, Bookmark, BookmarkCheck, FileCheck, FileSpreadsheet, FileTextIcon as FileText2, School } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"

export default function UserDetail() {
  const [userData, setUserData] = useState<UserType | null>(null)
  const [phdScholarData, setPhdScholarData] = useState<PhdScholar | null>(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const { data: session, status } = useSession()
  const router= useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
 
        // Make sure session is available before proceeding
        if (!session?.user?.id) {
          return;
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
        console.error('Error fetching user data:', error)
        setLoading(false)
      }
    }
  
    // Check if session is loading or unavailable
    if (status === "loading") {
      return; // Wait for the session to load
    }
  
    // Only proceed with fetching user data if authenticated and the user is an admin
    if (status === "authenticated" && session?.user?.isAdmin && id) {
      fetchUser()
    } else if (status === "unauthenticated" || !session?.user?.isAdmin) {
      console.log("Redirecting to unauthorized page...");
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
    if (!date) return "Not Available";
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#003b7a]">User Profile</h1>
        <Badge variant="outline" className="px-3 py-1 text-sm bg-[#003b7a] text-white">
          {userData.isAdmin ? "Administrator" : "Regular User"}
        </Badge>
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
                  <p className="font-medium">{userData.firstName} {userData.lastName}</p>
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
                  <p className="text-sm text-muted-foreground">PhD Scholar Status</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={userData.phdScholar ? "default" : "secondary"} className="mt-1">
                      {userData.phdScholar ? "PhD Scholar" : "Not a PhD Scholar"}
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

      {phdScholarData && (
        <Tabs defaultValue="supervision" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="supervision">Supervision</TabsTrigger>
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
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#003b7a]/10 p-2 rounded-full mt-1">
                        <BookmarkCheck className="h-5 w-5 text-[#003b7a]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Comprehensive Exam</p>
                        <p className="font-medium">{formatDate(phdScholarData.phdMilestones?.comprehensiveExamDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-[#003b7a]/10 p-2 rounded-full mt-1">
                        <FileText className="h-5 w-5 text-[#003b7a]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Proposal Defense</p>
                        <p className="font-medium">{formatDate(phdScholarData.phdMilestones?.proposalDefenseDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-[#003b7a]/10 p-2 rounded-full mt-1">
                        <FileText2 className="h-5 w-5 text-[#003b7a]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Open Seminar</p>
                        <p className="font-medium">{formatDate(phdScholarData.phdMilestones?.openSeminarDate1)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-[#003b7a]/10 p-2 rounded-full mt-1">
                        <FileSpreadsheet className="h-5 w-5 text-[#003b7a]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pre-Submission Seminar</p>
                        <p className="font-medium">{formatDate(phdScholarData.phdMilestones?.preSubmissionSeminarDate)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#003b7a]/10 p-2 rounded-full mt-1">
                        <FileCheck className="h-5 w-5 text-[#003b7a]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Synopsis Submission</p>
                        <p className="font-medium">{formatDate(phdScholarData.phdMilestones?.synopsisSubmissionDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-[#003b7a]/10 p-2 rounded-full mt-1">
                        <FileText className="h-5 w-5 text-[#003b7a]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Thesis Submission</p>
                        <p className="font-medium">{formatDate(phdScholarData.phdMilestones?.thesisSubmissionDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-[#003b7a]/10 p-2 rounded-full mt-1">
                        <Bookmark className="h-5 w-5 text-[#003b7a]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Thesis Defense</p>
                        <p className="font-medium">{formatDate(phdScholarData.phdMilestones?.thesisDefenseDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-[#003b7a]/10 p-2 rounded-full mt-1">
                        <Award className="h-5 w-5 text-[#003b7a]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Award of Degree</p>
                        <p className="font-medium">{formatDate(phdScholarData.phdMilestones?.awardOfDegreeDate)}</p>
                      </div>
                    </div>
                  </div>
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
                              <p className="font-medium">Vol. {journal.volumeNumber}, Issue {journal.issueNumber}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Page Numbers</p>
                              <p className="font-medium">{journal.pageNumbers}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Impact Factor</p>
                              <Badge variant="outline" className="mt-1">{journal.impactFactor}</Badge>
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
    </div>
  )
}
