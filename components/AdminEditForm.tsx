"use client"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { User as UserType, PhdScholar } from "@/types"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

const formSchema = z.object({
  personalDetails: z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
    middleName: z.string().optional(),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
    dateOfBirth: z.date().optional().nullable(),
    nationality: z.string().min(2, { message: "Nationality must be at least 2 characters." }),
    mobileNumber: z.string().min(10, { message: "Mobile number must be at least 10 characters." }),
  }),
  admissionDetails: z.object({
    entranceExamination: z.string(),
    qualifyingExamination: z.string(),
    allotmentNumber: z.string(),
    admissionDate: z.date().optional().nullable(),
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
      }),
    ),
  }),
  courseWork1: z.object({
    subjectCode: z.string(),
    subjectName: z.string(),
    subjectGrade: z.string(),
    status: z.string(),
    eligibilityDate: z.date().optional().nullable(),
  }),
  courseWork2: z.object({
    subjectCode: z.string(),
    subjectName: z.string(),
    subjectGrade: z.string(),
    status: z.string(),
    eligibilityDate: z.date().optional().nullable(),
  }),
  courseWork3: z.object({
    subjectCode: z.string(),
    subjectName: z.string(),
    subjectGrade: z.string(),
    status: z.string(),
    eligibilityDate: z.date().optional().nullable(),
  }),
  courseWork4: z.object({
    subjectCode: z.string(),
    subjectName: z.string(),
    subjectGrade: z.string(),
    status: z.string(),
    eligibilityDate: z.date().optional().nullable(),
  }),
  phdMilestones: z.object({
    courseworkCompletionDate: z.object({
      coursework1: z.date().optional().nullable(),
      coursework2: z.date().optional().nullable(),
      coursework3: z.date().optional().nullable(),
      coursework4: z.date().optional().nullable(),
    }),
    dcMeetings: z.object({
      DCM: z.array(
        z.object({
          scheduledDate: z.date().optional().nullable(),
          actualDate: z.date().optional().nullable(),
          happened: z.boolean(),
          summary: z.string(),
        }),
      ),
    }),
    comprehensiveExamDate: z.date().optional().nullable(),
    proposalDefenseDate: z.date().optional().nullable(),
    openSeminarDate1: z.date().optional().nullable(),
    preSubmissionSeminarDate: z.date().optional().nullable(),
    synopsisSubmissionDate: z.date().optional().nullable(),
    thesisSubmissionDate: z.date().optional().nullable(),
    thesisDefenseDate: z.date().optional().nullable(),
    awardOfDegreeDate: z.date().optional().nullable(),
  }),
  publications: z.object({
    journals: z.array(
      z.object({
        title: z.string(),
        journalName: z.string(),
        publicationYear: z.number(),
        volumeNumber: z.string(),
        issueNumber: z.string(),
        pageNumbers: z.string(),
        impactFactor: z.number(),
      }),
    ),
    conferences: z.array(
      z.object({
        title: z.string(),
        conferenceName: z.string(),
        publicationYear: z.number(),
      }),
    ),
  }),
})

interface AdminEditFormProps {
  userData: UserType
  phdScholarData: PhdScholar
  onCancel: () => void
}

export default function AdminEditForm({ userData, phdScholarData, onCancel }: AdminEditFormProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalDetails: {
        firstName: phdScholarData?.personalDetails?.firstName || "",
        middleName: phdScholarData?.personalDetails?.middleName || "",
        lastName: phdScholarData?.personalDetails?.lastName || "",
        dateOfBirth: phdScholarData?.personalDetails?.dateOfBirth
          ? new Date(phdScholarData.personalDetails.dateOfBirth)
          : undefined,
        nationality: phdScholarData?.personalDetails?.nationality || "",
        mobileNumber: phdScholarData?.personalDetails?.mobileNumber || "",
      },
      admissionDetails: {
        entranceExamination: phdScholarData?.admissionDetails?.entranceExamination || "",
        qualifyingExamination: phdScholarData?.admissionDetails?.qualifyingExamination || "",
        allotmentNumber: phdScholarData?.admissionDetails?.allotmentNumber || "",
        admissionDate: phdScholarData?.admissionDetails?.admissionDate
          ? new Date(phdScholarData.admissionDetails.admissionDate)
          : undefined,
        department: phdScholarData?.admissionDetails?.department || "",
        usn: phdScholarData?.admissionDetails?.usn || "",
        srn: phdScholarData?.admissionDetails?.srn || "",
        modeOfProgram: phdScholarData?.admissionDetails?.modeOfProgram || "",
      },
      researchSupervisor: phdScholarData?.researchSupervisor || "",
      researchCoSupervisor: phdScholarData?.researchCoSupervisor || "",
      doctoralCommittee: {
        members: phdScholarData?.doctoralCommittee?.members || [],
      },
      courseWork1: {
        subjectCode: phdScholarData?.courseWork1?.subjectCode || "",
        subjectName: phdScholarData?.courseWork1?.subjectName || "",
        subjectGrade: phdScholarData?.courseWork1?.subjectGrade || "",
        status: phdScholarData?.courseWork1?.status || "",
        eligibilityDate: phdScholarData?.courseWork1?.eligibilityDate
          ? new Date(phdScholarData.courseWork1.eligibilityDate)
          : undefined,
      },
      courseWork2: {
        subjectCode: phdScholarData?.courseWork2?.subjectCode || "",
        subjectName: phdScholarData?.courseWork2?.subjectName || "",
        subjectGrade: phdScholarData?.courseWork2?.subjectGrade || "",
        status: phdScholarData?.courseWork2?.status || "",
        eligibilityDate: phdScholarData?.courseWork2?.eligibilityDate
          ? new Date(phdScholarData.courseWork2.eligibilityDate)
          : undefined,
      },
      courseWork3: {
        subjectCode: phdScholarData?.courseWork3?.subjectCode || "",
        subjectName: phdScholarData?.courseWork3?.subjectName || "",
        subjectGrade: phdScholarData?.courseWork3?.subjectGrade || "",
        status: phdScholarData?.courseWork3?.status || "",
        eligibilityDate: phdScholarData?.courseWork3?.eligibilityDate
          ? new Date(phdScholarData.courseWork3.eligibilityDate)
          : undefined,
      },
      courseWork4: {
        subjectCode: phdScholarData?.courseWork4?.subjectCode || "",
        subjectName: phdScholarData?.courseWork4?.subjectName || "",
        subjectGrade: phdScholarData?.courseWork4?.subjectGrade || "",
        status: phdScholarData?.courseWork4?.status || "",
        eligibilityDate: phdScholarData?.courseWork4?.eligibilityDate
          ? new Date(phdScholarData.courseWork4.eligibilityDate)
          : undefined,
      },
      phdMilestones: {
        courseworkCompletionDate: {
          coursework1: phdScholarData?.phdMilestones?.courseworkCompletionDate?.coursework1
            ? new Date(phdScholarData.phdMilestones.courseworkCompletionDate.coursework1)
            : undefined,
          coursework2: phdScholarData?.phdMilestones?.courseworkCompletionDate?.coursework2
            ? new Date(phdScholarData.phdMilestones.courseworkCompletionDate.coursework2)
            : undefined,
          coursework3: phdScholarData?.phdMilestones?.courseworkCompletionDate?.coursework3
            ? new Date(phdScholarData.phdMilestones.courseworkCompletionDate.coursework3)
            : undefined,
          coursework4: phdScholarData?.phdMilestones?.courseworkCompletionDate?.coursework4
            ? new Date(phdScholarData.phdMilestones.courseworkCompletionDate.coursework4)
            : undefined,
        },
        dcMeetings: {
          DCM:
            phdScholarData?.phdMilestones?.dcMeetings?.DCM?.map((dcm) => ({
              scheduledDate: dcm.scheduledDate ? new Date(dcm.scheduledDate) : undefined,
              actualDate: dcm.actualDate ? new Date(dcm.actualDate) : undefined,
              happened: dcm.happened,
              summary: dcm.summary,
            })) || [],
        },
        comprehensiveExamDate: phdScholarData?.phdMilestones?.comprehensiveExamDate
          ? new Date(phdScholarData.phdMilestones.comprehensiveExamDate)
          : undefined,
        proposalDefenseDate: phdScholarData?.phdMilestones?.proposalDefenseDate
          ? new Date(phdScholarData.phdMilestones.proposalDefenseDate)
          : undefined,
        openSeminarDate1: phdScholarData?.phdMilestones?.openSeminarDate1
          ? new Date(phdScholarData.phdMilestones.openSeminarDate1)
          : undefined,
        preSubmissionSeminarDate: phdScholarData?.phdMilestones?.preSubmissionSeminarDate
          ? new Date(phdScholarData.phdMilestones.preSubmissionSeminarDate)
          : undefined,
        synopsisSubmissionDate: phdScholarData?.phdMilestones?.synopsisSubmissionDate
          ? new Date(phdScholarData.phdMilestones.synopsisSubmissionDate)
          : undefined,
        thesisSubmissionDate: phdScholarData?.phdMilestones?.thesisSubmissionDate
          ? new Date(phdScholarData.phdMilestones.thesisSubmissionDate)
          : undefined,
        thesisDefenseDate: phdScholarData?.phdMilestones?.thesisDefenseDate
          ? new Date(phdScholarData.phdMilestones.thesisDefenseDate)
          : undefined,
        awardOfDegreeDate: phdScholarData?.phdMilestones?.awardOfDegreeDate
          ? new Date(phdScholarData.phdMilestones.awardOfDegreeDate)
          : undefined,
      },
      publications: {
        journals: phdScholarData?.publications?.journals || [],
        conferences: phdScholarData?.publications?.conferences || [],
      },
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/user/phd-scholar/${userData.phdScholar}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.id}`,
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        console.log("PhD Scholar data updated successfully!")
        onCancel()
        router.refresh()
      } else {
        console.error("Failed to update PhD Scholar data")
      }
    } catch (error) {
      console.error("Error updating PhD Scholar data:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="personalDetails.firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="First Name" {...field} />
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
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personalDetails.dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="admissionDetails.department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Computer Science Engineering">Computer Science Engineering</SelectItem>
                  <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                  <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </form>
    </Form>
  )
}

