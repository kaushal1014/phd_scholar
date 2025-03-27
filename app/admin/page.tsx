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

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    // Ensure session is loaded before proceeding
    if (status === "loading") {
      // If the session is loading, we simply return and don't perform any action
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
        setLoading(false)
      } catch (error) {
        console.error("Error fetching users:", error)
        setLoading(false)
      }
    }

    console.log("checking")
    if (status === "authenticated" && session?.user?.isAdmin) {
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
      router.push("/unauthorized")
    }
  }, [status, session, router])

  const handleUserClick = (id: string) => {
    router.push(`/admin/${id}`)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#1B3668]" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1B3668]">Admin Dashboard</h1>
        <Link href="/admin/create-user">
          <Button className="bg-[#1B3668] hover:bg-[#1B3668]/90">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </Link>
      </div>

      {/* Admin Tracker Section */}
      <div className="mb-8">
        <AdminTracker />
      </div>

      {/* User Management Section */}
      <Card className="shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-[#1B3668]">User Management</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableCaption>A list of all users in the system</TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[100px] font-semibold">ID</TableHead>
                <TableHead className="font-semibold">First Name</TableHead>
                <TableHead className="font-semibold">Last Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user,index) => (
                <TableRow
                  key={index}
                  onClick={() => handleUserClick(user._id)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium text-[#1B3668]">{index+1}</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

