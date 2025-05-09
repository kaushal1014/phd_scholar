"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "@/types"
import { useSession } from "next-auth/react"
import { AdminTracker } from "@/components/admin-tracker"
import { Loader2, Search, UserPlus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"
import { ScholarStatistics } from '../components/scholar-statistics'

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
    phdFullTime: 0,
    phdPartTimeInternal: 0,
    phdPartTimeExternal: 0,
    mtechFullTime: 0,
    mtechPartTime: 0
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
          isSupervisor: user.isSupervisor,
          phdScholar: user.phdScholar,
        }))
        setUsers(mappedUsers)

        // Fetch PhD scholar details for statistics and user details
        const phdScholarsPromises = mappedUsers
          .filter((user: User) => user.phdScholar && !user.isAdmin)
          .map(async (user: User) => {
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
          phdFullTime: phdScholars.filter(scholar => 
            scholar.data?.admissionDetails?.modeOfProgram === 'PhD Full time'
          ).length,
          phdPartTimeInternal: phdScholars.filter(scholar => 
            scholar.data?.admissionDetails?.modeOfProgram === 'PhD part time (internal candidate)'
          ).length,
          phdPartTimeExternal: phdScholars.filter(scholar => 
            scholar.data?.admissionDetails?.modeOfProgram === 'PhD part time (external candidate)'
          ).length,
          mtechFullTime: phdScholars.filter(scholar => 
            scholar.data?.admissionDetails?.modeOfProgram === 'Mtech full time'
          ).length,
          mtechPartTime: phdScholars.filter(scholar => 
            scholar.data?.admissionDetails?.modeOfProgram === 'Mtech part time'
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

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const response = await fetch(`/api/user/user/${userId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        toast.success("User deleted successfully")
        setUsers((prev) => prev.filter((u) => u.id !== userId))
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to delete user")
      }
    } catch (error) {
      toast.error("Failed to delete user")
    }
  }

  const filteredUsers = users.filter(
    (user) => {
      if (!user) return false;
      
      const matchesSearch = 
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRole = roleFilter === "all" || 
        (roleFilter === "admin" && user.isAdmin) ||
        (roleFilter === "supervisor" && user.isSupervisor) ||
        (roleFilter === "scholar" && !user.isAdmin && !user.isSupervisor)
      
      const matchesVerification = verificationFilter === "all" ||
        (verificationFilter === "verified" && user.isVerified) ||
        (verificationFilter === "unverified" && !user.isVerified)

      const userDetail = userDetails[user.id]
      const userProgramMode = userDetail?.data?.admissionDetails?.modeOfProgram?.toLowerCase()?.trim() || ''
      const matchesProgram = programFilter === "all" || 
        (programFilter === "phd full time" && userProgramMode === "phd full time") ||
        (programFilter === "phd part time internal" && userProgramMode === "phd part time (internal candidate)") ||
        (programFilter === "phd part time external" && userProgramMode === "phd part time (external candidate)") ||
        (programFilter === "mtech full time" && userProgramMode === "mtech full time") ||
        (programFilter === "mtech part time" && userProgramMode === "mtech part time")
      
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
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link href="/admin/create-user" className="w-full sm:w-auto">
            <Button className="bg-[#1B3668] hover:bg-[#1B3668]/90 w-full sm:w-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </Link>
          <Link href="/admin/create-supervisor" className="w-full sm:w-auto">
            <Button className="bg-[#1B3668] hover:bg-[#1B3668]/90 w-full sm:w-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              Create Supervisor
            </Button>
          </Link>
        </div>
      </div>

      {/* Admin Tracker Section */}
      <div className="mb-6 sm:mb-8">
        <AdminTracker />
      </div>

      {/* Scholar Statistics Section */}
      <ScholarStatistics />

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
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="scholar">Scholar</SelectItem>
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
                    <SelectItem value="phd full time">PhD Full Time</SelectItem>
                    <SelectItem value="phd part time internal">PhD Part Time (Internal)</SelectItem>
                    <SelectItem value="phd part time external">PhD Part Time (External)</SelectItem>
                    <SelectItem value="mtech full time">MTech Full Time</SelectItem>
                    <SelectItem value="mtech part time">MTech Part Time</SelectItem>
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
                <TableHead className="font-semibold">Research Supervisor</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Program</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
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
                  <TableCell>{userDetails[user.id]?.data?.researchSupervisor || <span className="text-gray-400">-</span>}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isAdmin
                          ? "bg-purple-100 text-purple-800"
                          : user.isSupervisor
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.isAdmin
                        ? "Admin"
                        : user.isSupervisor
                        ? "Supervisor"
                        : "User"}
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
                  <TableCell>
                    <button
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Delete User"
                      onClick={e => { e.stopPropagation(); handleDeleteUser(user.id); }}
                    >
                      <Trash2 className="w-5 h-5" />
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

