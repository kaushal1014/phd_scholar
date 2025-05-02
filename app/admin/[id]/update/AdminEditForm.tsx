"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PhdScholar, User } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Save, X } from 'lucide-react'
import { toast } from 'react-toastify';
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// Define the schema for form validation
const formSchema = z.object({
  personalDetails: z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
    middleName: z.string().optional(),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
    dateOfBirth: z.date().nullable().optional(),
    nationality: z.string().min(2, { message: "Nationality must be at least 2 characters." }),
    mobileNumber: z.string().min(10, { message: "Mobile number must be at least 10 characters." }),
  }),
  admissionDetails: z.object({
    entranceExamination: z.string(),
    qualifyingExamination: z.string(),
    allotmentNumber: z.string(),
    admissionDate: z.date().nullable().optional(),
    department: z.string(),
    usn: z.string(),
    srn: z.string(),
    modeOfProgram: z.string(),
  }),
  researchSupervisor: z.string(),
  researchCoSupervisor: z.string().optional(),
  doctoralCommittee: z.object({
    members: z.array(
      z.object({
        name: z.string(),
      })
    ),
  }),
  courseWork1: z.object({
    subjectCode: z.string(),
    subjectName: z.string(),
    subjectGrade: z.string(),
    status: z.string(),
    eligibilityDate: z.date().nullable().optional(),
  }),
  courseWork2: z.object({
    subjectCode: z.string(),
    subjectName: z.string(),
    subjectGrade: z.string(),
    status: z.string(),
    eligibilityDate: z.date().nullable().optional(),
  }),
  courseWork3: z.object({
    subjectCode: z.string(),
    subjectName: z.string(),
    subjectGrade: z.string(),
    status: z.string(),
    eligibilityDate: z.date().nullable().optional(),
  }),
  courseWork4: z.object({
    subjectCode: z.string(),
    subjectName: z.string(),
    subjectGrade: z.string(),
    status: z.string(),
    eligibilityDate: z.date().nullable().optional(),
  }),
  phdMilestones: z.object({
    courseworkCompletionDate: z.object({
      coursework1: z.date().nullable().optional(),
      coursework2: z.date().nullable().optional(),
      coursework3: z.date().nullable().optional(),
      coursework4: z.date().nullable().optional(),
    }),
    dcMeetings: z.object({
      DCM: z.array(
        z.object({
          scheduledDate: z.date().nullable().optional(),
          actualDate: z.date().nullable().optional(),
          happened: z.boolean(),
          summary: z.string(),
        })
      ),
    }),
    comprehensiveExamDate: z.date().nullable().optional(),
    proposalDefenseDate: z.date().nullable().optional(),
    openSeminarDate1: z.date().nullable().optional(),
    preSubmissionSeminarDate: z.date().nullable().optional(),
    synopsisSubmissionDate: z.date().nullable().optional(),
    thesisSubmissionDate: z.date().nullable().optional(),
    thesisDefenseDate: z.date().nullable().optional(),
    awardOfDegreeDate: z.date().nullable().optional(),
  }),
});

interface AdminEditFormProps {
  userData: User;
  phdScholarData: PhdScholar;
  onCancel: () => void;
}

export default function AdminEditForm({ userData, phdScholarData, onCancel }: AdminEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notifyErr = (msg: string) => toast.error(msg);
  const router = useRouter();
  const notifySucc = (msg: string) => toast.success(msg);
  

  if(!phdScholarData){
    return <div>Loading...</div>
  }

  // Initialize form with existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalDetails: {
        firstName: phdScholarData.personalDetails?.firstName,
        middleName: phdScholarData.personalDetails.middleName || "",
        lastName: phdScholarData.personalDetails.lastName,
        dateOfBirth: phdScholarData.personalDetails.dateOfBirth ? new Date(phdScholarData.personalDetails.dateOfBirth) : null,
        nationality: phdScholarData.personalDetails.nationality,
        mobileNumber: phdScholarData.personalDetails.mobileNumber,
      },
      admissionDetails: {
        entranceExamination: phdScholarData.admissionDetails.entranceExamination,
        qualifyingExamination: phdScholarData.admissionDetails.qualifyingExamination,
        allotmentNumber: phdScholarData.admissionDetails.allotmentNumber,
        admissionDate: phdScholarData.admissionDetails.admissionDate ? new Date(phdScholarData.admissionDetails.admissionDate) : null,
        department: phdScholarData.admissionDetails.department,
        usn: phdScholarData.admissionDetails.usn,
        srn: phdScholarData.admissionDetails.srn,
        modeOfProgram: phdScholarData.admissionDetails.modeOfProgram,
      },
      researchSupervisor: phdScholarData.researchSupervisor,
      researchCoSupervisor: phdScholarData.researchCoSupervisor || "",
      doctoralCommittee: {
        members: phdScholarData.doctoralCommittee.members,
      },
      courseWork1: {
        subjectCode: phdScholarData.courseWork1.subjectCode,
        subjectName: phdScholarData.courseWork1.subjectName,
        subjectGrade: phdScholarData.courseWork1.subjectGrade,
        status: phdScholarData.courseWork1.status,
        eligibilityDate: phdScholarData.courseWork1.eligibilityDate ? new Date(phdScholarData.courseWork1.eligibilityDate) : null,
      },
      courseWork2: {
        subjectCode: phdScholarData.courseWork2.subjectCode,
        subjectName: phdScholarData.courseWork2.subjectName,
        subjectGrade: phdScholarData.courseWork2.subjectGrade,
        status: phdScholarData.courseWork2.status,
        eligibilityDate: phdScholarData.courseWork2.eligibilityDate ? new Date(phdScholarData.courseWork2.eligibilityDate) : null,
      },
      courseWork3: {
        subjectCode: phdScholarData.courseWork3.subjectCode,
        subjectName: phdScholarData.courseWork3.subjectName,
        subjectGrade: phdScholarData.courseWork3.subjectGrade,
        status: phdScholarData.courseWork3.status,
        eligibilityDate: phdScholarData.courseWork3.eligibilityDate ? new Date(phdScholarData.courseWork3.eligibilityDate) : null,
      },
      courseWork4: {
        subjectCode: phdScholarData.courseWork4.subjectCode,
        subjectName: phdScholarData.courseWork4.subjectName,
        subjectGrade: phdScholarData.courseWork4.subjectGrade,
        status: phdScholarData.courseWork4.status,
        eligibilityDate: phdScholarData.courseWork4.eligibilityDate ? new Date(phdScholarData.courseWork4.eligibilityDate) : null,
      },
      phdMilestones: {
        courseworkCompletionDate: {
          coursework1: phdScholarData.phdMilestones.courseworkCompletionDate.coursework1 ? new Date(phdScholarData.phdMilestones.courseworkCompletionDate.coursework1) : null,
          coursework2: phdScholarData.phdMilestones.courseworkCompletionDate.coursework2 ? new Date(phdScholarData.phdMilestones.courseworkCompletionDate.coursework2) : null,
          coursework3: phdScholarData.phdMilestones.courseworkCompletionDate.coursework3 ? new Date(phdScholarData.phdMilestones.courseworkCompletionDate.coursework3) : null,
          coursework4: phdScholarData.phdMilestones.courseworkCompletionDate.coursework4 ? new Date(phdScholarData.phdMilestones.courseworkCompletionDate.coursework4) : null,
        },
        dcMeetings: {
          DCM: phdScholarData.phdMilestones.dcMeetings?.DCM.map(meeting => ({
            scheduledDate: meeting.scheduledDate ? new Date(meeting.scheduledDate) : null,
            actualDate: meeting.actualDate ? new Date(meeting.actualDate) : null,
            happened: meeting.happened,
            summary: meeting.summary ?? "",
          })) || [],
        },
        comprehensiveExamDate: phdScholarData.phdMilestones.comprehensiveExamDate ? new Date(phdScholarData.phdMilestones.comprehensiveExamDate) : null,
        proposalDefenseDate: phdScholarData.phdMilestones.proposalDefenseDate ? new Date(phdScholarData.phdMilestones.proposalDefenseDate) : null,
        openSeminarDate1: phdScholarData.phdMilestones.openSeminarDate1 ? new Date(phdScholarData.phdMilestones.openSeminarDate1) : null,
        preSubmissionSeminarDate: phdScholarData.phdMilestones.preSubmissionSeminarDate ? new Date(phdScholarData.phdMilestones.preSubmissionSeminarDate) : null,
        synopsisSubmissionDate: phdScholarData.phdMilestones.synopsisSubmissionDate ? new Date(phdScholarData.phdMilestones.synopsisSubmissionDate) : null,
        thesisSubmissionDate: phdScholarData.phdMilestones.thesisSubmissionDate ? new Date(phdScholarData.phdMilestones.thesisSubmissionDate) : null,
        thesisDefenseDate: phdScholarData.phdMilestones.thesisDefenseDate ? new Date(phdScholarData.phdMilestones.thesisDefenseDate) : null,
        awardOfDegreeDate: phdScholarData.phdMilestones.awardOfDegreeDate ? new Date(phdScholarData.phdMilestones.awardOfDegreeDate) : null,
      },
    },
  });

  

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        console.log("Submitting data:", values);
      setIsSubmitting(true);
      // Make API call to update the PhD scholar data
      const response = await fetch(`/api/user/phd-scholar/${userData.phdScholar}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to update PhD scholar data');
      }
      notifySucc("PhD scholar data updated successfully")
      

      // Refresh the page to show updated data
      onCancel();
    } catch (error) {
      console.error('Error updating PhD scholar data:', error);
      notifyErr("Failed to update PhD scholar data")
    } finally {
      setIsSubmitting(false);
    }
  }

  // Helper function to render date picker
  const DatePickerFormField = ({ control, name, label }: { control: any, name: string, label: string }) => (
    <FormField
      control={control}
      name={name as any}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <FormControl>
              <Input
                type="date"
                value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  if (e.target.value) {
                    field.onChange(new Date(e.target.value));
                  } else {
                    field.onChange(null);
                  }
                }}
              />
            </FormControl>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#003b7a]">Edit PhD Scholar Information</h2>
          <p className="text-muted-foreground">Update information for {userData.firstName} {userData.lastName}</p>
        </div>
        <Button variant="outline" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Form {...form}>
      <form onSubmit={(e) => { console.log("Form submitted"); form.handleSubmit(onSubmit)(e); }} className="space-y-8">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-6 mb-6">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="admission">Admission</TabsTrigger>
              <TabsTrigger value="supervision">Supervision</TabsTrigger>
              <TabsTrigger value="coursework">Course Work</TabsTrigger>
              <TabsTrigger value="dcmeetings">DC Meetings</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
            </TabsList>

            {/* Personal Details Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader className="bg-[#003b7a]/5 border-b">
                  <CardTitle>Personal Details</CardTitle>
                  <CardDescription>Update the scholar's personal information</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="personalDetails.firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personalDetails.middleName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Middle Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Middle name (optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personalDetails.lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DatePickerFormField 
                      control={form.control}
                      name="personalDetails.dateOfBirth"
                      label="Date of Birth"
                    />
                    <FormField
                      control={form.control}
                      name="personalDetails.nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <FormControl>
                            <Input placeholder="Nationality" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personalDetails.mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Mobile number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Admission Details Tab */}
            <TabsContent value="admission">
              <Card>
                <CardHeader className="bg-[#003b7a]/5 border-b">
                  <CardTitle>Admission Details</CardTitle>
                  <CardDescription>Update the scholar's admission information</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="admissionDetails.department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input placeholder="Department" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DatePickerFormField 
                      control={form.control}
                      name="admissionDetails.admissionDate"
                      label="Admission Date"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="admissionDetails.entranceExamination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Entrance Examination</FormLabel>
                          <FormControl>
                            <Input placeholder="Entrance examination" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="admissionDetails.qualifyingExamination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qualifying Examination</FormLabel>
                          <FormControl>
                            <Input placeholder="Qualifying examination" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="admissionDetails.allotmentNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allotment Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Allotment number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="admissionDetails.usn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>USN</FormLabel>
                          <FormControl>
                            <Input placeholder="USN" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="admissionDetails.srn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SRN</FormLabel>
                          <FormControl>
                            <Input placeholder="SRN" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="admissionDetails.modeOfProgram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mode of Program</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select mode of program" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PhD Full time">PhD Full time</SelectItem>
                            <SelectItem value="PhD part time (internal candidate)">PhD part time (internal candidate)</SelectItem>
                            <SelectItem value="PhD part time (external candidate)">PhD part time (external candidate)</SelectItem>
                            <SelectItem value="Mtech full time">Mtech full time</SelectItem>
                            <SelectItem value="Mtech part time">Mtech part time</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Supervision Tab */}
            <TabsContent value="supervision">
              <Card>
                <CardHeader className="bg-[#003b7a]/5 border-b">
                  <CardTitle>Research Supervision</CardTitle>
                  <CardDescription>Update the scholar's research supervision details</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="researchSupervisor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Research Supervisor</FormLabel>
                        <FormControl>
                          <Input placeholder="Research supervisor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="researchCoSupervisor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Research Co-Supervisor (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Research co-supervisor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="my-4" />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Doctoral Committee Members</h3>
                    {form.watch("doctoralCommittee.members").map((_, index) => (
                      <div key={index} className="mb-4">
                        <FormField
                          control={form.control}
                          name={`doctoralCommittee.members.${index}.name` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Member {index + 1}</FormLabel>
                              <FormControl>
                                <Input placeholder={`Committee member ${index + 1}`} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentMembers = form.getValues("doctoralCommittee.members");
                        form.setValue("doctoralCommittee.members", [
                          ...currentMembers,
                          { name: "" }
                        ]);
                      }}
                    >
                      Add Committee Member
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Course Work Tab */}
            <TabsContent value="coursework">
              <Card>
                <CardHeader className="bg-[#003b7a]/5 border-b">
                  <CardTitle>Course Work Details</CardTitle>
                  <CardDescription>Update the scholar's course work information</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Course Work 1 */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Course Work 1</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="courseWork1.subjectCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Subject code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="courseWork1.subjectName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Subject name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="courseWork1.subjectGrade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select grade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="C">C</SelectItem>
                                <SelectItem value="D">D</SelectItem>
                                <SelectItem value="F">F</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="courseWork1.status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Not Started">Not Started</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DatePickerFormField 
                        control={form.control}
                        name="courseWork1.eligibilityDate"
                        label="Eligibility Date"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Course Work 2 */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Course Work 2</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="courseWork2.subjectCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Subject code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="courseWork2.subjectName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Subject name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="courseWork2.subjectGrade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select grade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="C">C</SelectItem>
                                <SelectItem value="D">D</SelectItem>
                                <SelectItem value="F">F</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="courseWork2.status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Not Started">Not Started</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DatePickerFormField 
                        control={form.control}
                        name="courseWork2.eligibilityDate"
                        label="Eligibility Date"
                      />
                    </div>
                  </div>

                  {/* Similar sections for Course Work 3 and 4 */}
                  <Separator />

                  {/* Course Work 3 */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Course Work 3</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="courseWork3.subjectCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Subject code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="courseWork3.subjectName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Subject name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="courseWork3.subjectGrade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select grade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="C">C</SelectItem>
                                <SelectItem value="D">D</SelectItem>
                                <SelectItem value="F">F</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="courseWork3.status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Not Started">Not Started</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DatePickerFormField 
                        control={form.control}
                        name="courseWork3.eligibilityDate"
                        label="Eligibility Date"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Course Work 4 */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Course Work 4</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="courseWork4.subjectCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Subject code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="courseWork4.subjectName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Subject name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="courseWork4.subjectGrade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select grade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="C">C</SelectItem>
                                <SelectItem value="D">D</SelectItem>
                                <SelectItem value="F">F</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="courseWork4.status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Not Started">Not Started</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DatePickerFormField 
                        control={form.control}
                        name="courseWork4.eligibilityDate"
                        label="Eligibility Date"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* DC Meetings Tab */}
            <TabsContent value="dcmeetings">
              <Card>
                <CardHeader className="bg-[#003b7a]/5 border-b">
                  <CardTitle>Doctoral Committee Meetings</CardTitle>
                  <CardDescription>Update the scholar's DC meeting information</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {form.watch("phdMilestones.dcMeetings.DCM").map((_, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-4">DC Meeting {index + 1}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DatePickerFormField 
                          control={form.control}
                          name={`phdMilestones.dcMeetings.DCM.${index}.scheduledDate` as const}
                          label="Scheduled Date"
                        />
                        <DatePickerFormField 
                          control={form.control}
                          name={`phdMilestones.dcMeetings.DCM.${index}.actualDate` as const}
                          label="Actual Date"
                        />
                      </div>
                      <div className="mt-4">
                        <FormField
                          control={form.control}
                          name={`phdMilestones.dcMeetings.DCM.${index}.happened` as const}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Meeting Status</FormLabel>
                                <FormDescription>
                                  Has this meeting been completed?
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="mt-4">
                        <FormField
                          control={form.control}
                          name={`phdMilestones.dcMeetings.DCM.${index}.summary` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Meeting Summary</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter a summary of the meeting"
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const currentMeetings = form.getValues("phdMilestones.dcMeetings.DCM");
                      form.setValue("phdMilestones.dcMeetings.DCM", [
                        ...currentMeetings,
                        {
                          scheduledDate: new Date(),
                          actualDate: new Date(),
                          happened: false,
                          summary: ""
                        }
                      ]);
                    }}
                  >
                    Add DC Meeting
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Milestones Tab */}
            <TabsContent value="milestones">
              <Card>
                <CardHeader className="bg-[#003b7a]/5 border-b">
                  <CardTitle>PhD Milestones</CardTitle>
                  <CardDescription>Update the scholar's milestone dates</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {/* Course Work Completion Dates Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Course Work Completion Dates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DatePickerFormField 
                        control={form.control}
                        name="phdMilestones.courseworkCompletionDate.coursework1"
                        label="Course Work 1 Completion"
                      />
                      <DatePickerFormField 
                        control={form.control}
                        name="phdMilestones.courseworkCompletionDate.coursework2"
                        label="Course Work 2 Completion"
                      />
                      <DatePickerFormField 
                        control={form.control}
                        name="phdMilestones.courseworkCompletionDate.coursework3"
                        label="Course Work 3 Completion"
                      />
                      <DatePickerFormField 
                        control={form.control}
                        name="phdMilestones.courseworkCompletionDate.coursework4"
                        label="Course Work 4 Completion"
                      />
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Other Milestones Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Key Milestones</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DatePickerFormField 
                        control={form.control}
                        name="phdMilestones.comprehensiveExamDate"
                        label="Comprehensive Exam"
                      />
                      <DatePickerFormField 
                        control={form.control}
                        name="phdMilestones.proposalDefenseDate"
                        label="Proposal Defense"
                      />
                      <DatePickerFormField 
                        control={form.control}
                        name="phdMilestones.openSeminarDate1"
                        label="Open Seminar"
                      />
                      <DatePickerFormField 
                        control={form.control}
                        name="phdMilestones.preSubmissionSeminarDate"
                        label="Pre-Submission Seminar"
                      />
                      <DatePickerFormField 
                        control={form.control}
                        name="phdMilestones.synopsisSubmissionDate"
                        label="Synopsis Submission"
                      />
                      <DatePickerFormField 
                        control={form.control}
                        name="phdMilestones.thesisSubmissionDate"
                        label="Thesis Submission"
                      />
                      <DatePickerFormField 
                        control={form.control}
                        name="phdMilestones.thesisDefenseDate"
                        label="Thesis Defense"
                      />
                      <DatePickerFormField 
                        control={form.control}
                        name="phdMilestones.awardOfDegreeDate"
                        label="Award of Degree"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}