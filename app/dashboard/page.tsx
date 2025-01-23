'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookMarked, Mail, Shield, CheckCircle, LogIn, Loader2 } from 'lucide-react';
import { User as UserType, PhdScholar } from '@/types';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserType | null>(null);
  const [phdScholarData, setPhdScholarData] = useState<PhdScholar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetch(`/api/user/user`)
        .then(response => response.json())
        .then(data => {
          setUserData(data);
          return fetch(`/api/user/phd-scholar/`);
        })
        .then(response => response.json())
        .then(data => {
          setPhdScholarData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [status, session]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const resetTimeout = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        signOut();
      }, 20 * 60 * 1000); // 20 minutes
    };
    const events = ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress'];
    events.forEach(event => window.addEventListener(event, resetTimeout));

    resetTimeout(); // Initialize timeout on component mount

    return () => {
      if (timeout) clearTimeout(timeout);
      events.forEach(event => window.removeEventListener(event, resetTimeout));
    };
  }, []);

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">PhD Research Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <LogIn className="h-16 w-16 text-primary mb-4" />
            <Button onClick={() => router.push('/login')} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading || status === "loading") {
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
    );
  }

  if (status === "authenticated" && userData && phdScholarData) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div>
                  <CardTitle className="text-2xl">Welcome, {session.user.name}!</CardTitle>
                  <CardDescription>PhD Research Dashboard</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{session.user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Admin: {session.user.isAdmin ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span>Verified: {session.user.isVerified ? "Yes" : "No"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>PhD Scholar Details</CardTitle>
                  <CardDescription>Your academic journey at a glance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="flex items-center">
                      <GraduationCap className="h-6 w-6 mr-4 text-primary" />
                      <div>
                        <p className="text-lg font-semibold">
                          {userData.firstName} {userData.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Department: {phdScholarData.admissionDetails.department}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h2 className="text-lg font-bold mb-2">Personal Details</h2>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">First Name:</span> {phdScholarData.personalDetails.firstName}
                          </p>
                          <p>
                            <span className="font-medium">Middle Name:</span>{" "}
                            {phdScholarData.personalDetails.middleName}
                          </p>
                          <p>
                            <span className="font-medium">Last Name:</span> {phdScholarData.personalDetails.lastName}
                          </p>
                          <p>
                            <span className="font-medium">Date of Birth:</span>{" "}
                            {phdScholarData.personalDetails.dateOfBirth
                              ? new Date(phdScholarData.personalDetails.dateOfBirth).toLocaleDateString()
                              : "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">Nationality:</span>{" "}
                            {phdScholarData.personalDetails.nationality}
                          </p>
                          <p>
                            <span className="font-medium">Mobile Number:</span>{" "}
                            {phdScholarData.personalDetails.mobileNumber}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-lg font-bold mb-2">Admission Details</h2>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Entrance Examination:</span>{" "}
                            {phdScholarData.admissionDetails.entranceExamination}
                          </p>
                          <p>
                            <span className="font-medium">Qualifying Examination:</span>{" "}
                            {phdScholarData.admissionDetails.qualifyingExamination}
                          </p>
                          <p>
                            <span className="font-medium">Allotment Number:</span>{" "}
                            {phdScholarData.admissionDetails.allotmentNumber}
                          </p>
                          <p>
                            <span className="font-medium">Admission Date:</span>{" "}
                            {phdScholarData.admissionDetails.admissionDate
                              ? new Date(phdScholarData.admissionDetails.admissionDate).toLocaleDateString()
                              : "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">USN:</span> {phdScholarData.admissionDetails.usn}
                          </p>
                          <p>
                            <span className="font-medium">SRN:</span> {phdScholarData.admissionDetails.srn}
                          </p>
                          <p>
                            <span className="font-medium">Mode of Program:</span>{" "}
                            {phdScholarData.admissionDetails.modeOfProgram}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold mb-2">Research Details</h2>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Research Supervisor:</span> {phdScholarData.researchSupervisor}
                        </p>
                        <p>
                          <span className="font-medium">Research Co-Supervisor:</span>{" "}
                          {phdScholarData.researchCoSupervisor}
                        </p>
                        <p>
                          <span className="font-medium">Doctoral Committee Members:</span>{" "}
                          {phdScholarData.doctoralCommittee.members.map((member, i) => (
                            <span key={i}>
                              {member.name}
                              {i < phdScholarData.doctoralCommittee.members.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold mb-2">Coursework Details</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(["courseWork1", "courseWork2", "courseWork3", "courseWork4"] as const).map((course, index) => (
                          <div key={index} className="bg-muted p-3 rounded-lg">
                            <p className="font-semibold">{phdScholarData[course].subjectName}</p>
                            <p className="text-sm">Grade: {phdScholarData[course].subjectGrade}</p>
                            <p className="text-sm">Status: {phdScholarData[course].status}</p>
                            <p className="text-sm">
                              Eligibility:{" "}
                              {phdScholarData[course].eligibilityDate
                                ? new Date(phdScholarData[course].eligibilityDate).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold mb-2">PhD Milestones</h2>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Comprehensive Exam:</span>{" "}
                          {phdScholarData.phdMilestones.comprehensiveExamDate
                            ? new Date(phdScholarData.phdMilestones.comprehensiveExamDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Proposal Defense:</span>{" "}
                          {phdScholarData.phdMilestones.proposalDefenseDate
                            ? new Date(phdScholarData.phdMilestones.proposalDefenseDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Open Seminar:</span>{" "}
                          {phdScholarData.phdMilestones.openSeminarDate1
                            ? new Date(phdScholarData.phdMilestones.openSeminarDate1).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Pre-Submission Seminar:</span>{" "}
                          {phdScholarData.phdMilestones.preSubmissionSeminarDate
                            ? new Date(phdScholarData.phdMilestones.preSubmissionSeminarDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Synopsis Submission:</span>{" "}
                          {phdScholarData.phdMilestones.synopsisSubmissionDate
                            ? new Date(phdScholarData.phdMilestones.synopsisSubmissionDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Thesis Submission:</span>{" "}
                          {phdScholarData.phdMilestones.thesisSubmissionDate
                            ? new Date(phdScholarData.phdMilestones.thesisSubmissionDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Thesis Defense:</span>{" "}
                          {phdScholarData.phdMilestones.thesisDefenseDate
                            ? new Date(phdScholarData.phdMilestones.thesisDefenseDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Award of Degree:</span>{" "}
                          {phdScholarData.phdMilestones.awardOfDegreeDate
                            ? new Date(phdScholarData.phdMilestones.awardOfDegreeDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold mb-2">Publications</h2>
                      <div className="space-y-4">
                        <h3 className="text-md font-semibold">Journals</h3>
                        {phdScholarData.publications.journals.map((journal, i) => (
                          <div key={i} className="flex items-start space-x-2 bg-muted p-3 rounded-lg">
                            <BookMarked className="h-5 w-5 mt-1 text-primary" />
                            <div className="space-y-1 text-sm">
                              <p className="font-medium">{journal.title}</p>
                              <p className="text-muted-foreground">Published in {journal.journalName}</p>
                              <p className="text-muted-foreground">
                                Year: {journal.publicationYear}, Vol: {journal.volumeNumber}, Issue:{" "}
                                {journal.issueNumber}
                              </p>
                              <p className="text-muted-foreground">
                                Pages: {journal.pageNumbers}, Impact Factor: {journal.impactFactor}
                              </p>
                            </div>
                          </div>
                        ))}
                        <h3 className="text-md font-semibold mt-4">Conferences</h3>
                        {phdScholarData.publications.conferences.map((conference, i) => (
                          <div key={i} className="flex items-start space-x-2 bg-muted p-3 rounded-lg">
                            <BookMarked className="h-5 w-5 mt-1 text-primary" />
                            <div className="space-y-1 text-sm">
                              <p className="font-medium">{conference.title}</p>
                              <p className="text-muted-foreground">Presented at {conference.conferenceName}</p>
                              <p className="text-muted-foreground">Year: {conference.publicationYear}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Next DC Meeting</CardTitle>
                </CardHeader>
                <CardContent>
                  {phdScholarData.phdMilestones.dcMeetings ? (
                    <div className="text-center">
                      <p className="text-2xl font-bold">{phdScholarData.phdMilestones.dcMeetings.DCM[0].scheduledDate ? new Date(phdScholarData.phdMilestones.dcMeetings.DCM[0].scheduledDate).toLocaleDateString() : "N/A"}</p>
                      <p className="text-sm text-muted-foreground">Scheduled Date</p>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">No upcoming meetings scheduled</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>DC Meetings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {phdScholarData.phdMilestones.dcMeetings.DCM.map((meeting, i) => (
                      <div key={i} className="flex items-center space-x-2 bg-muted p-2 rounded-md">
                        <div className="text-sm">
                          <p className="font-medium">
                            Scheduled:{" "}
                            {meeting.scheduledDate ? new Date(meeting.scheduledDate).toLocaleDateString() : "N/A"}
                          </p>
                          <p className="text-muted-foreground">
                            Actual: {meeting.actualDate ? new Date(meeting.actualDate).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}