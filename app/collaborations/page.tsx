"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageSquare, Calendar, Bell, ChevronLeft, UserPlus, CalendarClock, MessagesSquare, Loader2, ExternalLink } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "react-toastify"
import { formatDistanceToNow } from "date-fns"
import NewDiscussionForm from "@/components/new-discussion-form"
import NewMeetingForm from "@/components/new-meeting-form"
import NewEventForm from "@/components/new-event-form"

// Types
interface User {
  _id: string
  name: string
  email: string
  role: string
  isAdmin?: boolean
  isSupervisor?: boolean
}

interface Discussion {
  _id: string
  title: string
  content: string
  author: {
    _id: string
    firstName: string
  }
  replies: {
    _id: string
    content: string
    author: {
      _id: string
      firstName: string
    }
    createdAt: string
  }[]
  createdAt: string
  updatedAt: string
}

interface Meeting {
  _id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  organizer: {
    _id: string
    firstName: string
  }
  createdAt: string
}

interface Event {
  _id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  organizer: {
    _id: string
    firstName: string
  }
  createdAt: string
}

export default function CollaborationsPage() {
  const [activeTab, setActiveTab] = useState("discussion-forum")
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [isDiscussionDialogOpen, setIsDiscussionDialogOpen] = useState(false)
  const router = useRouter()

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/session")
        if (!response.ok) {
          throw new Error("Failed to fetch user session")
        }
        const data = await response.json()

        if (!data.user) {
          router.push("/login?callbackUrl=/collaborations")
          return
        }

        setUser(data.user)
      } catch (error) {
        console.error("Error fetching user:", error)
        router.push("/login?callbackUrl=/collaborations")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  // Fetch discussions, meetings, and events
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        // Fetch discussions
        const discussionsRes = await fetch("/api/collaborations/discussions")
        if (discussionsRes.ok) {
          const discussionsData = await discussionsRes.json()
          setDiscussions(discussionsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [user])

  // Handle form submissions
  const handleDiscussionSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/collaborations/discussions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create discussion")
      }

      const newDiscussion = await response.json()
      setDiscussions([newDiscussion, ...discussions])
      setIsDiscussionDialogOpen(false)
      toast("Discussion created successfully")
    } catch (error) {
      console.error("Error creating discussion:", error)
      toast("Failed to create discussion")
    }
  }

  // Check if user can create content (admin or supervisor)
  const canCreateContent = user?.isAdmin || user?.isSupervisor

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4C1D95]" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="bg-gradient-to-r from-[#1B3668] to-[#0A2240] shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto py-6 px-2 sm:py-10 sm:px-4 lg:px-8 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Users className="h-7 w-7 sm:h-8 sm:w-8 text-[#F59E0B]" />
            <h1 className="text-xl sm:text-3xl font-bold text-white">Collaborations</h1>
          </div>
          <p className="text-blue-500 mt-2 max-w-2xl text-sm sm:text-base">
            Connect, collaborate, and stay updated with fellow researchers
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-4 px-2 sm:py-8 sm:px-6 lg:px-8">
        <Card className="border-[#E5E7EB] bg-white shadow-sm mb-6 sm:mb-8">
          <CardHeader className="border-b bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6] p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="rounded-full bg-[#1B3668]/10 p-2 sm:p-3 border border-[#1B3668]/20">
                <Users className="h-7 w-7 sm:h-8 sm:w-8 text-[#1B3668]" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-2xl font-bold text-[#1F2937]">Research Collaborations</CardTitle>
                <CardDescription className="text-sm sm:text-base mt-1 text-[#6B7280]">
                  Connect, collaborate, and stay updated with fellow researchers
                </CardDescription>
              </div>
            </div>
          </CardHeader>

            <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-[#1F2937] flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-[#F59E0B]" />
                      Discussion Forum
                    </h2>
                    {/* Show button for all users (including students) */}
                    <Dialog open={isDiscussionDialogOpen} onOpenChange={setIsDiscussionDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-[#1B3668] hover:bg-[#0A2240] transition-colors duration-200">
                          <MessagesSquare className="h-4 w-4 mr-2" />
                          New Discussion
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Create New Discussion</DialogTitle>
                          <DialogDescription>Start a new discussion topic with your colleagues</DialogDescription>
                        </DialogHeader>
                        <NewDiscussionForm onSubmit={handleDiscussionSubmit} />
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid gap-4">
                    {discussions.length > 0 ? (
                      discussions.map((discussion) => (
                        <div key={discussion._id} className="relative">
                          <Link
                            href={`/collaborations/discussions/${discussion._id}`}
                            className="block"
                          >
                            <Card
                              className="border-[#E5E7EB] hover:border-[#1B3668] hover:shadow-md transition-all duration-200"
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  <div className="rounded-full bg-[#1B3668]/10 p-2 flex-shrink-0 border border-[#1B3668]/20">
                                    <MessageSquare className="h-5 w-5 text-[#1B3668]" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h3 className="font-medium text-[#1F2937] mb-1">{discussion.title}</h3>
                                      <ExternalLink className="h-4 w-4 text-[#6B7280]" />
                                    </div>
                                    <p className="text-sm text-[#6B7280] mb-2">
                                      {discussion.content.length > 100
                                        ? `${discussion.content.substring(0, 100)}...`
                                        : discussion.content}
                                    </p>
                                    <div className="flex items-center text-xs text-[#6B7280]">
                                      <span className="font-medium">Started by: {discussion.author.firstName}</span>
                                      <span className="inline-block mx-2 w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                                      <span>{discussion.replies.length} replies</span>
                                      <span className="inline-block mx-2 w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                                      <span>Last post: {formatDistanceToNow(new Date(discussion.updatedAt))} ago</span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                          {user?.isAdmin && (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 z-10"
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!window.confirm('Are you sure you want to delete this discussion?')) return;
                                try {
                                  const res = await fetch(`/api/collaborations/discussions/${discussion._id}`, {
                                    method: 'DELETE',
                                  });
                                  if (res.ok) {
                                    setDiscussions((prev) => prev.filter((d) => d._id !== discussion._id));
                                    toast.success('Discussion deleted successfully');
                                  } else {
                                    toast.error('Failed to delete discussion');
                                  }
                                } catch (err) {
                                  toast.error('Failed to delete discussion');
                                }
                              }}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No discussions yet. Be the first to start a discussion!
                      </div>
                    )}
                  </div>
                </div>
            </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="group rounded-full px-8 border-[#1B3668] text-[#1B3668] hover:bg-[#1B3668] hover:text-white transition-all duration-200"
          >
            <Link href="/">
              <ChevronLeft className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
              Back to Main Page
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
