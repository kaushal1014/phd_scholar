"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Scholar {
  _id: string
  personalDetails: {
    firstName: string
    lastName: string
  }
  admissionDetails: {
    department: string
    programMode: string
  }
  phdMilestones: {
    dcMeetings: {
      DCM: Array<{
        _id: string
        scheduledDate: string
        happened: boolean
      }>
    }
  }
}

export default function SupervisorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [scholars, setScholars] = useState<Scholar[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchScholars = async () => {
      try {
        const response = await fetch("/api/user/phd-scholar")
        if (!response.ok) {
          throw new Error("Failed to fetch scholars")
        }
        const data = await response.json()
        setScholars(data.data)
      } catch (error) {
        console.error("Error fetching scholars:", error)
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.isSupervisor) {
      fetchScholars()
    } else if (status === "unauthenticated" || !session?.user?.isSupervisor) {
      router.push("/unauthorized")
    }
  }, [status, session, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Supervisor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scholars.map((scholar) => (
          <Card key={scholar._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>
                {scholar.personalDetails.firstName} {scholar.personalDetails.lastName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Department: {scholar.admissionDetails.department}
                </p>
                <p className="text-sm text-gray-600">
                  Program Mode: {scholar.admissionDetails.programMode}
                </p>
                {scholar.phdMilestones?.dcMeetings?.DCM?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Upcoming DC Meetings</h3>
                    {scholar.phdMilestones.dcMeetings.DCM
                      .filter((meeting) => !meeting.happened)
                      .map((meeting) => (
                        <div key={meeting._id} className="text-sm text-gray-600">
                          {new Date(meeting.scheduledDate).toLocaleDateString()}
                        </div>
                      ))}
                  </div>
                )}
                <Button
                  onClick={() => router.push(`/supervisor/scholar/${scholar._id}`)}
                  className="mt-4 w-full"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 