"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  Bell,
  MapPin,
  Clock,
  Send,
  Loader2,
  Users,
  Calendar,
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
  comments: Comment[]
  createdAt: string
  documentUrl?: string
  documentType?: "pdf" | "image" | "pptx"
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

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showDocument, setShowDocument] = useState(false)
  const [imagesExpanded, setImagesExpanded] = useState(false)
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

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/collaborations/events/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch event")
        }
        const data = await response.json()
        setEvent(data)

        // If event has a document, show it by default
        if (data.documentUrl) {
          setShowDocument(true)
        }
      } catch (error) {
        console.error("Error fetching event:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  const onSubmitComment = async (values: z.infer<typeof commentSchema>) => {
    if (!user || !event) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/collaborations/events/${event._id}/comment`, {
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

      const updatedEvent = await response.json()
      setEvent(updatedEvent)
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
        <span className="ml-2 text-lg">Loading event details...</span>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <Button asChild variant="outline">
          <Link href="/events">
            <ChevronLeft className="mr-2 h-5 w-5" />
            Back to events
          </Link>
        </Button>
      </div>
    )
  }

  const eventDate = new Date(event.date)
  const eventTime = event.time.split(':')
  eventDate.setHours(parseInt(eventTime[0]), parseInt(eventTime[1]))
  const isPastEvent = eventDate < new Date()
  const hasDocument = !!event.documentUrl

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F3F4F6] to-[#F9FAFB] pb-12">
      <header className="bg-gradient-to-r from-[#1B3668] to-[#0A2240] shadow-md relative overflow-hidden rounded-b-2xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] rounded-b-2xl"></div>
        <div className="max-w-5xl mx-auto py-8 px-2 sm:py-10 sm:px-4 lg:px-8 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Bell className="h-8 w-8 text-[#F59E0B]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow">Event Details</h1>
          </div>
          <p className="text-blue-100 mt-2 max-w-2xl text-sm sm:text-base">Stay updated with research events and activities</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-6 px-2 sm:px-4 lg:px-8">
        <div className="mb-4 sm:mb-6">
          <Button
            asChild
            variant="outline"
            className="group rounded-full px-4 border-[#1B3668] text-[#1B3668] hover:bg-[#1B3668] hover:text-white transition-all duration-200 shadow w-full sm:w-auto"
          >
            <Link href="/events">
              <ChevronLeft className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
              Back to events
            </Link>
          </Button>
        </div>

        {hasDocument && showDocument ? (
          <Card className="border-[#E5E7EB] bg-white shadow-lg mb-8 sm:mb-10 rounded-2xl w-full">
            <CardHeader className="border-b bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6] p-4 sm:p-8 rounded-t-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-[#1B3668]/10 p-3 border border-[#1B3668]/20">
                    <FileText className="h-8 w-8 text-[#1B3668]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-3xl font-extrabold text-[#1F2937]">{event.title}</CardTitle>
                    <CardDescription className="text-sm sm:text-base mt-1 text-[#6B7280]">
                      {isPastEvent ? "Event Materials" : "Event Announcement"}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-8">
              <div className="space-y-6 sm:space-y-8">
                {/* Files Grid */}
                {event.documentUrl && (
                  <div className="w-full rounded-xl border border-gray-200 bg-[#F9FAFB] shadow-sm p-4 sm:p-6">
                    <div className="mb-4 sm:mb-6 flex items-center gap-2">
                      <FileText className="h-6 w-6 text-[#1B3668]" />
                      <span className="text-base sm:text-lg font-semibold text-[#1B3668]">Event Files</span>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                      {/* PDF and PPTX files */}
                      {event.documentUrl.split(',').map((file, index) => {
                        const fileType = file.toLowerCase().endsWith('.pdf') ? 'pdf' :
                                       file.toLowerCase().endsWith('.pptx') ? 'pptx' :
                                       file.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/) ? 'image' : '';
                        if (fileType === 'pdf') {
                          return (
                            <div key={index} className="border rounded-xl p-2 sm:p-4 col-span-full bg-white shadow-md w-full">
                              <div className="mb-2 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-[#1B3668]" />
                                <span className="font-semibold text-[#1B3668]">PDF Document</span>
                              </div>
                              <div className="w-full rounded-lg overflow-hidden border border-[#E5E7EB] shadow">
                                <iframe
                                  src={`/api/events/download?path=${encodeURIComponent(file)}`}
                                  className="w-full rounded-lg"
                                  style={{ height: "60vh", minHeight: 300, maxHeight: 400, width: "100%" }}
                                  title={`PDF Viewer ${index + 1}`}
                                />
                              </div>
                              <div className="mt-4 flex justify-center">
                                <a
                                  href={`/api/events/download?path=${encodeURIComponent(file)}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                                  className="inline-flex items-center px-4 py-2 bg-[#1B3668] text-white rounded-lg hover:bg-[#0A2240] transition-colors shadow w-full sm:w-auto justify-center"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </div>
                            </div>
                          );
                        }
                        if (fileType === 'pptx') {
                          return (
                            <div key={index} className="border rounded-xl p-2 sm:p-4 flex flex-col items-center justify-center h-40 sm:h-48 bg-gray-100 shadow-md w-full">
                              <FileText className="h-8 w-8 text-[#1B3668] mb-2" />
                              <p className="text-center mb-2 text-sm">PowerPoint Presentation</p>
                              <a
                                href={`/api/events/download?path=${encodeURIComponent(file)}`}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 bg-[#1B3668] text-white rounded-md hover:bg-[#0A2240] transition-colors text-sm shadow w-full sm:w-auto justify-center"
                    >
                                <Download className="h-3 w-3 mr-1" />
                      Download PowerPoint
                    </a>
                  </div>
                          );
                        }
                        return null;
                      })}
                      {/* Collapsible Images */}
                      {(() => {
                        const imageFiles = event.documentUrl.split(',').filter(f => f.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/));
                        if (imageFiles.length === 0) return null;
                        return (
                          <div className="border rounded-xl p-2 sm:p-4 col-span-full bg-white shadow-md w-full">
                            <div className="mb-2">
                              <button
                                className="w-full focus:outline-none group"
                                onClick={() => setImagesExpanded(v => !v)}
                              >
                                <div className="relative h-48 sm:h-64 w-full cursor-pointer group-hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
                                  <Image
                                    src={`/api/events/download?path=${encodeURIComponent(imageFiles[0])}`}
                                    alt={`Event cover image`}
                                    fill
                                    className="object-cover rounded-lg group-hover:scale-105 transition-transform"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 flex justify-center rounded-b-lg">
                                    <span className="text-white font-semibold text-xs sm:text-base">{imagesExpanded ? 'Hide Images' : `Show All Images (${imageFiles.length})`}</span>
                                  </div>
                                </div>
                              </button>
                    </div>
                            {imagesExpanded && (
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4 mt-4">
                                {imageFiles.map((img, idx) => (
                                  <div key={idx} className="relative h-40 sm:h-64 w-full rounded-lg overflow-hidden group">
                                    <Image
                                      src={`/api/events/download?path=${encodeURIComponent(img)}`}
                                      alt={`Event image ${idx + 1}`}
                                      fill
                                      className="object-cover rounded-lg group-hover:scale-105 transition-transform"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 flex justify-center rounded-b-lg">
                                      <a
                                        href={`/api/events/download?path=${encodeURIComponent(img)}`}
                                        download
                      target="_blank"
                      rel="noopener noreferrer"
                                        className="inline-flex items-center px-3 py-1 bg-white text-[#1B3668] rounded-md hover:bg-gray-100 transition-colors text-xs sm:text-sm shadow w-full sm:w-auto justify-center"
                    >
                                        <Download className="h-3 w-3 mr-1" />
                      Download Image
                    </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="border-t p-4 sm:p-8 flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between rounded-b-2xl bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6]">
              <Button
                asChild
                variant="outline"
                className="group rounded-full px-6 border-[#1B3668] text-[#1B3668] hover:bg-[#1B3668] hover:text-white transition-all duration-200 shadow w-full sm:w-auto"
              >
                <Link href="/events">
                  <ChevronLeft className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
                  Back to Events
                </Link>
              </Button>

              <Button
                onClick={() => setShowDocument(false)}
                className="rounded-full px-6 bg-[#1B3668] hover:bg-[#0A2240] transition-colors duration-200 shadow w-full sm:w-auto"
              >
                View Event Details
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="border-[#E5E7EB] bg-white shadow-lg mb-8 sm:mb-10 rounded-2xl w-full">
            <CardHeader className="border-b bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6] p-4 sm:p-8 rounded-t-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-[#1B3668]/10 p-3 border border-[#1B3668]/20">
                    <Bell className="h-8 w-8 text-[#F59E0B]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-3xl font-extrabold text-[#1F2937]">{event.title}</CardTitle>
                    <CardDescription className="text-sm sm:text-base mt-1 text-[#6B7280] flex items-center">
                      Organized by {event.organizer.firstName}
                      <span className="inline-block mx-2 w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                      {formatDistanceToNow(new Date(event.createdAt))} ago
                    </CardDescription>
                  </div>
                </div>
                <Badge className={isPastEvent ? "bg-gray-500" : "bg-[#F59E0B] hover:bg-[#D97706]"}>
                  {isPastEvent ? "Past Event" : "Upcoming"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-8">
              <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
                <div className="md:col-span-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#1F2937] mb-3 flex items-center">
                    <span className="inline-block w-1 h-5 bg-[#F59E0B] mr-2 rounded"></span>
                    Description
                  </h3>
                  <p className="text-[#4B5563] whitespace-pre-line mb-4 sm:mb-6 bg-[#F9FAFB] p-3 sm:p-4 rounded-xl border border-[#E5E7EB] shadow-sm text-sm sm:text-base">
                    {event.description}
                  </p>

                  <h3 className="text-base sm:text-lg font-bold text-[#1F2937] mb-3 flex items-center">
                    <span className="inline-block w-1 h-5 bg-[#F59E0B] mr-2 rounded"></span>
                    Details
                  </h3>
                  <div className="space-y-2 sm:space-y-3 bg-[#F9FAFB] p-3 sm:p-4 rounded-xl border border-[#E5E7EB] shadow-sm text-sm sm:text-base">
                    <div className="flex items-center text-[#4B5563]">
                      <Calendar className="h-5 w-5 mr-2 text-[#1B3668]" />
                      <span>
                        Date: <span className="font-medium">{format(new Date(event.date), "MMMM d, yyyy")}</span>
                      </span>
                    </div>
                    <div className="flex items-center text-[#4B5563]">
                      <Clock className="h-5 w-5 mr-2 text-[#1B3668]" />
                      <span>
                        Time: <span className="font-medium">{event.time}</span>
                      </span>
                    </div>
                    <div className="flex items-center text-[#4B5563]">
                      <MapPin className="h-5 w-5 mr-2 text-[#1B3668]" />
                      <span>
                        Location: <span className="font-medium">{event.location}</span>
                      </span>
                    </div>
                    <div className="flex items-center text-[#4B5563]">
                      <Users className="h-5 w-5 mr-2 text-[#1B3668]" />
                      <span>
                        Organizer: <span className="font-medium">{event.organizer.firstName}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-1">
                  <Card className="border-[#E5E7EB] bg-gradient-to-b from-[#F9FAFB] to-white shadow-sm rounded-xl w-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base sm:text-lg font-semibold text-[#1F2937] flex items-center">
                        <Bell className="h-5 w-5 mr-2 text-[#F59E0B]" />
                        Event Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        <div className="flex justify-between items-center p-2 rounded-md bg-white border border-[#E5E7EB] shadow-sm">
                          <span className="text-[#6B7280]">Status:</span>
                          <Badge className={isPastEvent ? "bg-gray-500" : "bg-[#F59E0B] hover:bg-[#D97706]"}>
                            {isPastEvent ? "Completed" : "Upcoming"}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-md bg-white border border-[#E5E7EB] shadow-sm">
                          <span className="text-[#6B7280]">Created:</span>
                          <span className="text-[#1F2937] font-medium">
                            {formatDistanceToNow(new Date(event.createdAt))} ago
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-md bg-white border border-[#E5E7EB] shadow-sm">
                          <span className="text-[#6B7280]">Comments:</span>
                          <span className="text-[#1F2937] font-medium">{event.comments?.length || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {hasDocument && (
                    <div className="mt-4">
                      <Button
                        onClick={() => setShowDocument(true)}
                        className="w-full bg-[#1B3668] hover:bg-[#0A2240] transition-colors duration-200 shadow rounded-full"
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

        <div className="mb-8 sm:mb-10">
          <h2 className="text-lg sm:text-2xl font-bold text-[#1F2937] mb-4 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-[#F59E0B]" />
            Comments ({event.comments?.length || 0})
          </h2>

          {event.comments && event.comments.length > 0 ? (
            <div className="space-y-4">
              {event.comments.map((comment) => (
                <Card
                  key={comment._id}
                  className="border-[#E5E7EB] bg-white hover:border-[#1B3668]/30 transition-all duration-200 rounded-xl shadow-sm"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-2 sm:gap-4">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-[#E5E7EB] shadow">
                        <AvatarFallback className="bg-[#1B3668]/10 text-[#1B3668] text-lg font-bold">
                          {comment.author.firstName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h3 className="font-semibold text-[#1F2937] text-sm sm:text-base">{comment.author.firstName}</h3>
                          <span className="mx-2 inline-block w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(comment.createdAt))} ago
                          </span>
                        </div>
                        <p className="text-xs sm:text-base text-[#1F2937] whitespace-pre-line mt-1">{comment.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-[#E5E7EB] bg-white rounded-xl shadow-sm">
              <CardContent className="p-4 sm:p-6 text-center text-gray-500 text-xs sm:text-base">
                No comments yet. Be the first to comment!
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="border-[#E5E7EB] bg-white shadow-lg rounded-2xl w-full">
          <CardHeader className="border-b p-4 sm:p-6">
            <CardTitle className="text-base sm:text-xl font-bold text-[#1F2937]">Add a Comment</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
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
                          className="min-h-[100px] resize-none rounded-lg shadow-sm text-xs sm:text-base"
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
                    className="bg-[#1B3668] hover:bg-[#0A2240] transition-colors duration-200 shadow rounded-full w-full sm:w-auto"
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
