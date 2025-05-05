"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PhdScholar } from "@/types"
import { SupervisorTracker } from "@/components/supervisor-tracker"

export default function SupervisorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [scholars, setScholars] = useState<PhdScholar[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchScholars = async () => {
      try {
        const response = await fetch("/api/supervisor/scholars")
        if (!response.ok) throw new Error("Failed to fetch scholars")
        const data = await response.json()
        setScholars(data)
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

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <SupervisorTracker scholars={scholars} />
      <Card>
        <CardHeader>
          <CardTitle>Supervisor Dashboard</CardTitle>
          <CardDescription>
            View and manage your PhD scholars
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>USN</TableHead>
                <TableHead>Admission Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scholars.map((scholar, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    {scholar.personalDetails.firstName} {scholar.personalDetails.lastName}
                  </TableCell>
                  <TableCell>{scholar.admissionDetails.department}</TableCell>
                  <TableCell>{scholar.admissionDetails.usn}</TableCell>
                  <TableCell>
                    {new Date(scholar.admissionDetails.admissionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {scholar.phdMilestones.thesisDefenseDate ? "Completed" : "In Progress"}
                  </TableCell>
                  <TableCell>
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      onClick={() => router.push(`/supervisor/scholar/${(scholar as any)._id || idx}`)}
                    >
                      View Details
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 