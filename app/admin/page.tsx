'use client'
import React, { useState, useEffect } from "react"
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

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

    fetchUsers()
  }, [])

  const isPastDeadline = (date: Date | null) => {
    if (!date) return false
    const deadline = new Date(date)
    const today = new Date()
    return deadline < today
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
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className={
                  user.phdScholar && user.phdScholar.admissionDetails && user.phdScholar.admissionDetails.admissionDate && isPastDeadline(new Date(user.phdScholar.admissionDetails.admissionDate))
                    ? 'bg-red-100'
                    : ''
                }
              >
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin ? "Admin" : "User"}</TableCell>
                <TableCell>
                  {user.phdScholar && user.phdScholar.admissionDetails && user.phdScholar.admissionDetails.admissionDate
                    ? new Date(user.phdScholar.admissionDetails.admissionDate).toLocaleDateString()
                    : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}