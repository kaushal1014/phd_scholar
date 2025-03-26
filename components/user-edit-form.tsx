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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
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
})

interface UserEditFormProps {
  userData: UserType
  phdScholarData: PhdScholar
  onCancel: () => void
}

export default function UserEditForm({ userData, phdScholarData, onCancel }: UserEditFormProps) {
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
        body: JSON.stringify({
          ...phdScholarData,
          personalDetails: values.personalDetails,
          admissionDetails: values.admissionDetails,
          researchSupervisor: values.researchSupervisor,
          researchCoSupervisor: values.researchCoSupervisor,
        }),
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
    <div className="bg-white p-6 rounded-lg shadow-md max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-[#1B3668] mb-6">Edit Profile</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#1B3668] border-b pb-2">Personal Details</h3>
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
                name="personalDetails.middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Middle Name (optional)" {...field} />
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
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <FormControl>
                          <Input
                          type="date"
                          value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                          onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                          />
                        </FormControl>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
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
                      <Input placeholder="Mobile Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#1B3668] border-b pb-2">Academic Details</h3>
              <FormField
                control={form.control}
                name="admissionDetails.department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Computer Science Engineering">Computer Science Engineering</SelectItem>
                        <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                        <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                        <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                        <SelectItem value="Electronics and Communication">Electronics and Communication</SelectItem>
                      </SelectContent>
                    </Select>
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
              <FormField
                control={form.control}
                name="researchSupervisor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Research Supervisor</FormLabel>
                    <FormControl>
                      <Input placeholder="Research Supervisor" {...field} />
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
                      <Input placeholder="Research Co-Supervisor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#1B3668] hover:bg-[#1B3668]/90" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

