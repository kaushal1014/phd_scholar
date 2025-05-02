"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "@/types"
import { useSession } from "next-auth/react"
import { AdminTracker } from "@/components/admin-tracker"
import { Loader2, Search, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [verificationFilter, setVerificationFilter] = useState("all")
  const [programFilter, setProgramFilter] = useState("all")
  const [userDetails, setUserDetails] = useState<{[key: string]: any}>({})
  const [phdStats, setPhdStats] = useState({
    total: 0,
    fullTime: 0,
    partTime: 0,
    direct: 0,
    mtech: 0
  })
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    // Ensure session is loaded before proceeding
    if (status === "loading") {
      return
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/allUsers")
        const data = await response.json()
        const mappedUsers = data.map((user: any) => ({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          isVerified: user.isVerified,
          isAdmin: user.isAdmin,
          phdScholar: user.phdScholar,
        }))
        setUsers(mappedUsers)

        // Fetch PhD scholar details for statistics and user details
        const phdScholarsPromises = mappedUsers
          .filter(user => user.phdScholar && !user.isAdmin)
          .map(async user => {
            try {
              const response = await fetch(`/api/user/phd-scholar/${user.phdScholar}`)
              if (!response.ok) {
                console.error(`Failed to fetch PhD scholar data for user ${user.id}`)
                return null
              }
              const data = await response.json()
              return {
                userId: user.id,
                ...data
              }
            } catch (error) {
              console.error(`Error fetching PhD scholar data for user ${user.id}:`, error)
              return null
            }
          })

        const phdScholarsResults = await Promise.all(phdScholarsPromises)
        const phdScholars = phdScholarsResults.filter(scholar => scholar !== null)

        // Create a map of user details
        const detailsMap = phdScholars.reduce((acc: any, scholar: any) => {
          acc[scholar.userId] = scholar
          return acc
        }, {})
        setUserDetails(detailsMap)

        // Calculate statistics
        const stats = {
          total: phdScholars.length,
          fullTime: phdScholars.filter(scholar => 
            scholar.data?.admissionDetails?.modeOfProgram?.toLowerCase().trim() === 'full time phd scholar'
          ).length,
          partTime: phdScholars.filter(scholar => 
            scholar.data?.admissionDetails?.modeOfProgram?.toLowerCase().trim() === 'part time phd scholar'
          ).length,
          direct: phdScholars.filter(scholar => 
            scholar.data?.admissionDetails?.modeOfProgram?.toLowerCase().trim() === 'direct phd'
          ).length,
          mtech: phdScholars.filter(scholar => 
            scholar.data?.admissionDetails?.modeOfProgram?.toLowerCase().trim() === 'phd by mtech'
          ).length
        }

        setPhdStats(stats)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching users:", error)
        setLoading(false)
      }
    }

    console.log("checking")
    if (status === "authenticated" && (session?.user?.isAdmin || session.user.isSupervisor)) {
      fetch(`/api/user/user/${session.user.id}`)
        .then((response) => response.json())
        .then((data) => {
          fetchUsers()
        })
        .catch((error) => {
          console.error("Error fetching data:", error)
        })
    } else if (status === "unauthenticated" || !session?.user?.isAdmin) {
      setLoading(false)
      router.push("/login")
    }
  }, [status, session, router])

  const handleUserClick = (id: string) => {
    router.push(`/admin/${id}`)
  }

  const filteredUsers = users.filter(
    (user) => {
      const matchesSearch = 
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRole = roleFilter === "all" || 
        (roleFilter === "admin" && user.isAdmin) ||
        (roleFilter === "user" && !user.isAdmin)
      
      const matchesVerification = verificationFilter === "all" ||
        (verificationFilter === "verified" && user.isVerified) ||
        (verificationFilter === "unverified" && !user.isVerified)

      const userDetail = userDetails[user.id]
      const userProgramMode = userDetail?.data?.admissionDetails?.modeOfProgram?.toLowerCase().trim()
      const matchesProgram = programFilter === "all" || 
        (programFilter === "full time" && userProgramMode === "full time phd scholar") ||
        (programFilter === "part time" && userProgramMode === "part time phd scholar") ||
        (programFilter === "direct" && userProgramMode === "direct phd") ||
        (programFilter === "mtech" && userProgramMode === "phd by mtech")
      
      return matchesSearch && matchesRole && matchesVerification && matchesProgram
    }
  )

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#1B3668]" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-2 sm:p-4 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1B3668]">Admin Dashboard</h1>
        <Link href="/admin/create-user" className="w-full sm:w-auto">
          <Button className="bg-[#1B3668] hover:bg-[#1B3668]/90 w-full sm:w-auto">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </Link>
      </div>

      {/* Admin Tracker Section */}
      <div className="mb-6 sm:mb-8">
        <AdminTracker />
      </div>

      {/* PhD Scholar Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Total Scholars
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold text-blue-800">{phdStats.total}</div>
            <div className="w-16 h-16">
              <Pie
                data={{
                  labels: ['Full Time', 'Part Time', 'Direct PhD', 'PhD by MTech'],
                  datasets: [{
                    data: [
                      phdStats.fullTime,
                      phdStats.partTime,
                      phdStats.direct,
                      phdStats.mtech
                    ],
                    backgroundColor: [
                      'rgba(34, 197, 94, 0.8)',  // Green
                      'rgba(168, 85, 247, 0.8)', // Purple
                      'rgba(249, 115, 22, 0.8)', // Orange
                      'rgba(239, 68, 68, 0.8)',  // Red
                    ],
                    borderColor: [
                      'rgba(34, 197, 94, 1)',
                      'rgba(168, 85, 247, 1)',
                      'rgba(249, 115, 22, 1)',
                      'rgba(239, 68, 68, 1)',
                    ],
                    borderWidth: 1,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Full Time
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold text-green-800">{phdStats.fullTime}</div>
            <div className="w-16 h-16">
              <Pie
                data={{
                  labels: ['Full Time', 'Others'],
                  datasets: [{
                    data: [phdStats.fullTime, phdStats.total - phdStats.fullTime],
                    backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(34, 197, 94, 0.1)'],
                    borderColor: ['rgba(34, 197, 94, 1)', 'rgba(34, 197, 94, 0.3)'],
                    borderWidth: 1,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Part Time
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold text-purple-800">{phdStats.partTime}</div>
            <div className="w-16 h-16">
              <Pie
                data={{
                  labels: ['Part Time', 'Others'],
                  datasets: [{
                    data: [phdStats.partTime, phdStats.total - phdStats.partTime],
                    backgroundColor: ['rgba(168, 85, 247, 0.8)', 'rgba(168, 85, 247, 0.1)'],
                    borderColor: ['rgba(168, 85, 247, 1)', 'rgba(168, 85, 247, 0.3)'],
                    borderWidth: 1,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Direct PhD
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold text-orange-800">{phdStats.direct}</div>
            <div className="w-16 h-16">
              <Pie
                data={{
                  labels: ['Direct PhD', 'Others'],
                  datasets: [{
                    data: [phdStats.direct, phdStats.total - phdStats.direct],
                    backgroundColor: ['rgba(249, 115, 22, 0.8)', 'rgba(249, 115, 22, 0.1)'],
                    borderColor: ['rgba(249, 115, 22, 1)', 'rgba(249, 115, 22, 0.3)'],
                    borderWidth: 1,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              PhD by MTech
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold text-red-800">{phdStats.mtech}</div>
            <div className="w-16 h-16">
              <Pie
                data={{
                  labels: ['PhD by MTech', 'Others'],
                  datasets: [{
                    data: [phdStats.mtech, phdStats.total - phdStats.mtech],
                    backgroundColor: ['rgba(239, 68, 68, 0.8)', 'rgba(239, 68, 68, 0.1)'],
                    borderColor: ['rgba(239, 68, 68, 1)', 'rgba(239, 68, 68, 0.3)'],
                    borderWidth: 1,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management Section */}
      <Card className="shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <CardTitle className="text-lg sm:text-xl text-[#1B3668]">User Management</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by verification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={programFilter} onValueChange={setProgramFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    <SelectItem value="full time">Full Time PhD</SelectItem>
                    <SelectItem value="part time">Part Time PhD</SelectItem>
                    <SelectItem value="direct">Direct PhD</SelectItem>
                    <SelectItem value="mtech">PhD by MTech</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableCaption>A list of all users in the system</TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[100px] font-semibold">ID</TableHead>
                <TableHead className="font-semibold">First Name</TableHead>
                <TableHead className="font-semibold">Last Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Program</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow
                  key={index}
                  onClick={() => handleUserClick(user.id)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium text-[#1B3668]">{index + 1}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isAdmin ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {userDetails[user.id]?.data?.admissionDetails?.modeOfProgram ? (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          userDetails[user.id].data.admissionDetails.modeOfProgram.toLowerCase().includes('full time') ? "bg-green-100 text-green-800" :
                          userDetails[user.id].data.admissionDetails.modeOfProgram.toLowerCase().includes('part time') ? "bg-purple-100 text-purple-800" :
                          userDetails[user.id].data.admissionDetails.modeOfProgram.toLowerCase().includes('direct') ? "bg-orange-100 text-orange-800" :
                          "bg-red-100 text-red-800"
                        }`}
                      >
                        {userDetails[user.id].data.admissionDetails.modeOfProgram}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
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

