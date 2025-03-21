'use client'
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { User } from "@/types"
import { useSession } from "next-auth/react"

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    // Ensure session is loaded before proceeding
    if (status === "loading") {
      // If the session is loading, we simply return and don't perform any action
      return;
    }
  
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/allUsers')
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
        console.error('Error fetching users:', error)
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
    } else if (status === "unauthenticated" || !(session?.user?.isAdmin)) {
      setLoading(false)
      router.push("/unauthorized")
    }
  }, [status, session, router])

  const handleUserClick = (id: string) => {
    router.push(`/admin/${id}`)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin - User Management</h1>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <Table>
          <TableCaption>A list of all users in your account.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                onClick={() => handleUserClick(user.id)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin ? "Admin" : "User"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}