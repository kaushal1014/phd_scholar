"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Clock,
  Send,
  Loader2,
  Users,
  MessageSquare,
  Download,
  FileText,
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import Image from "next/image"

// Types
interface Comment {
  _id: string
  content: string
  author: {
    _id: string
    firstName: string
  }
  createdAt: string
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
  comments: Comment[]
  createdAt: string
  documentUrl?: string
  documentType?: "pdf" | "image"
}

const commentSchema = z.object({
  content: z
    .string()
    .min(3, {
      message: "Comment must be at least 3 characters.",
    })
    .max(500, {
      message: "Comment must not exceed 500 characters.",
    }),
})

export default function MeetingDetailPage({ params }: { params: { id: string } }) {
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showDocument, setShowDocument] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  })

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/session")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user || null)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    fetchUser()
  }, [])

  // Fetch meeting details
  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await fetch(`/api/collaborations/meetings/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch meeting")
        }
        const data = await response.json()
        setMeeting(data)

        // If meeting has a document, show it by default
        if (data.documentUrl) {
          setShowDocument(true)
        }
      } catch (error) {
        console.error("Error fetching meeting:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchMeeting()
    }
  }, [params.id])

  const onSubmitComment = async (values: z.infer<typeof commentSchema>) => {
    if (!user || !meeting) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/collaborations/meetings/${meeting._id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: values.content,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit comment")
      }

      const updatedMeeting = await response.json()
      setMeeting(updatedMeeting)
      form.reset()
    } catch (error) {
      console.error("Error submitting comment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4C1D95]" />
        <span className="ml-2 text-lg">Loading meeting details...</span>
      </div>
    )
  }

  if (!meeting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Meeting not found</h1>
        <Button asChild variant="outline">
          <Link href="/events">
            <ChevronLeft className="mr-2 h-5 w-5" />
            Back to events
          </Link>
        </Button>
      </div>
    )
  }

  const meetingDate = new Date(meeting.date)
  const isPastMeeting = meetingDate < new Date()
  const hasDocument = !!meeting.documentUrl

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="bg-gradient-to-r from-[#1B3668] to-[#0A2240] shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-[#F59E0B]" />
            <h1 className="text-3xl font-bold text-white">Meeting Details</h1>
          </div>
          <p className="text-blue-100 mt-2 max-w-2xl">View meeting information and join the conversation</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            asChild
            variant="outline"
            className="group rounded-full px-4 border-[#1B3668] text-[#1B3668] hover:bg-[#1B3668] hover:text-white transition-all duration-200"
          >
            <Link href="/events">
              <ChevronLeft className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
              Back to events
            </Link>
          </Button>
        </div>

        {hasDocument && (
          <div className="mb-6 flex justify-end">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setShowDocument(false)}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                  !showDocument
                    ? "bg-[#1B3668] text-white border-[#1B3668]"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                Details
              </button>
              <button
                type="button"
                onClick={() => setShowDocument(true)}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                  showDocument
                    ? "bg-[#1B3668] text-white border-[#1B3668]"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                Document
              </button>
            </div>
          </div>
        )}

        {hasDocument && showDocument ? (
          <Card className="border-[#E5E7EB] bg-white shadow-sm mb-8">
            <CardHeader className="border-b bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-[#1B3668]/10 p-3 border border-[#1B3668]/20">
                    <FileText className="h-8 w-8 text-[#1B3668]" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-[#1F2937]">{meeting.title}</CardTitle>
                    <CardDescription className="text-base mt-1 text-[#6B7280]">
                      {isPastMeeting ? "Meeting Materials" : "Meeting Agenda"}
                    </CardDescription>
                  </div>
                </div>
                <a
                  href={meeting.documentUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-[#1B3668] text-white rounded-md hover:bg-[#0A2240] transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </a>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {meeting.documentType === "pdf" ? (
                <div className="aspect-[16/9] w-full rounded-lg border border-gray-200">
                  <object
                    data={`${meeting.documentUrl}#toolbar=1&view=FitH`}
                    type="application/pdf"
                    className="h-full w-full rounded-lg"
                    style={{ height: "70vh" }}
                  >
                    <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4 rounded-lg">
                      <FileText className="h-16 w-16 text-[#1B3668] mb-4" />
                      <p className="text-center mb-4">Your browser cannot display the PDF directly.</p>
                      <a
                        href={meeting.documentUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-[#1B3668] text-white rounded-md hover:bg-[#0A2240] transition-colors"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </div>
                  </object>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="relative max-w-full overflow-hidden rounded-lg border border-gray-200">
                    <Image
                      src={meeting.documentUrl || "/placeholder.svg"}
                      alt={meeting.title}
                      width={800}
                      height={600}
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t p-6 flex justify-between">
              <Button
                asChild
                variant="outline"
                className="group rounded-full px-6 border-[#1B3668] text-[#1B3668] hover:bg-[#1B3668] hover:text-white transition-all duration-200"
              >
                <Link href="/events">
                  <ChevronLeft className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
                  Back to Events
                </Link>
              </Button>

              <Button
                onClick={() => setShowDocument(false)}
                className="rounded-full px-6 bg-[#1B3668] hover:bg-[#0A2240] transition-colors duration-200"
              >
                View Meeting Details
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="border-[#E5E7EB] bg-white shadow-sm mb-8">
            <CardHeader className="border-b bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-[#1B3668]/10 p-3 border border-[#1B3668]/20">
                    <Calendar className="h-8 w-8 text-[#1B3668]" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-[#1F2937]">{meeting.title}</CardTitle>
                    <CardDescription className="text-base mt-1 text-[#6B7280] flex items-center">
                      Organized by {meeting.organizer.firstName}
                      <span className="inline-block mx-2 w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                      {formatDistanceToNow(new Date(meeting.createdAt))} ago
                    </CardDescription>
                  </div>
                </div>
                <Badge className={isPastMeeting ? "bg-gray-500" : "bg-[#F59E0B] hover:bg-[#D97706]"}>
                  {isPastMeeting ? "Past Meeting" : "Upcoming"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-[#1F2937] mb-3 flex items-center">
                    <span className="inline-block w-1 h-5 bg-[#F59E0B] mr-2 rounded"></span>
                    Description
                  </h3>
                  <p className="text-[#4B5563] whitespace-pre-line mb-6 bg-[#F9FAFB] p-4 rounded-md border border-[#E5E7EB]">
                    {meeting.description}
                  </p>

                  <h3 className="text-lg font-semibold text-[#1F2937] mb-3 flex items-center">
                    <span className="inline-block w-1 h-5 bg-[#F59E0B] mr-2 rounded"></span>
                    Details
                  </h3>
                  <div className="space-y-3 bg-[#F9FAFB] p-4 rounded-md border border-[#E5E7EB]">
                    <div className="flex items-center text-[#4B5563]">
                      <Calendar className="h-5 w-5 mr-2 text-[#1B3668]" />
                      <span>
                        Date: <span className="font-medium">{format(new Date(meeting.date), "MMMM d, yyyy")}</span>
                      </span>
                    </div>
                    <div className="flex items-center text-[#4B5563]">
                      <Clock className="h-5 w-5 mr-2 text-[#1B3668]" />
                      <span>
                        Time: <span className="font-medium">{meeting.time}</span>
                      </span>
                    </div>
                    <div className="flex items-center text-[#4B5563]">
                      <MapPin className="h-5 w-5 mr-2 text-[#1B3668]" />
                      <span>
                        Location: <span className="font-medium">{meeting.location}</span>
                      </span>
                    </div>
                    <div className="flex items-center text-[#4B5563]">
                      <Users className="h-5 w-5 mr-2 text-[#1B3668]" />
                      <span>
                        Organizer: <span className="font-medium">{meeting.organizer.firstName}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-1">
                  <Card className="border-[#E5E7EB] bg-gradient-to-b from-[#F9FAFB] to-white shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold text-[#1F2937] flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-[#F59E0B]" />
                        Meeting Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center p-2 rounded-md bg-white border border-[#E5E7EB]">
                          <span className="text-[#6B7280]">Status:</span>
                          <Badge className={isPastMeeting ? "bg-gray-500" : "bg-[#F59E0B] hover:bg-[#D97706]"}>
                            {isPastMeeting ? "Completed" : "Upcoming"}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-md bg-white border border-[#E5E7EB]">
                          <span className="text-[#6B7280]">Created:</span>
                          <span className="text-[#1F2937] font-medium">
                            {formatDistanceToNow(new Date(meeting.createdAt))} ago
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-md bg-white border border-[#E5E7EB]">
                          <span className="text-[#6B7280]">Comments:</span>
                          <span className="text-[#1F2937] font-medium">{meeting.comments?.length || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {hasDocument && (
                    <div className="mt-4">
                      <Button
                        onClick={() => setShowDocument(true)}
                        className="w-full bg-[#1B3668] hover:bg-[#0A2240] transition-colors duration-200"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Document
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#1F2937] mb-4 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-[#F59E0B]" />
            Comments ({meeting.comments?.length || 0})
          </h2>

          {meeting.comments && meeting.comments.length > 0 ? (
            <div className="space-y-4">
              {meeting.comments.map((comment) => (
                <Card
                  key={comment._id}
                  className="border-[#E5E7EB] bg-white hover:border-[#1B3668]/30 transition-all duration-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-8 w-8 border border-[#E5E7EB]">
                        <AvatarFallback className="bg-[#1B3668]/10 text-[#1B3668]">
                          {comment.author.firstName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h3 className="font-medium text-[#1F2937]">{comment.author.firstName}</h3>
                          <span className="mx-2 inline-block w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(comment.createdAt))} ago
                          </span>
                        </div>
                        <p className="text-sm text-[#1F2937] whitespace-pre-line">{comment.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-[#E5E7EB] bg-white">
              <CardContent className="p-6 text-center text-gray-500">
                No comments yet. Be the first to comment!
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="border-[#E5E7EB] bg-white shadow-sm">
          <CardHeader className="border-b p-4">
            <CardTitle className="text-lg font-semibold text-[#1F2937]">Add a Comment</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitComment)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Write your comment here..."
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-[#1B3668] hover:bg-[#0A2240] transition-colors duration-200"
                    disabled={submitting || !user}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {user ? "Post Comment" : "Login to Comment"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
