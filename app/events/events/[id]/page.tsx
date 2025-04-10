"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, User, ChevronLeft, Loader2, FileText, Download } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

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
  documentUrl?: string
  documentType?: "pdf" | "image"
}

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDocument, setShowDocument] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/collaborations/events/${params.id}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Event not found")
          } else if (response.status === 401) {
            router.push("/login?callbackUrl=/collaborations/events/" + params.id)
            return
          } else {
            throw new Error("Failed to fetch event details")
          }
        }

        const data = await response.json()
        setEvent(data)

        // If event has a document, show it by default
        if (data.documentUrl) {
          setShowDocument(true)
        }
      } catch (error) {
        console.error("Error fetching event:", error)
        setError(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4C1D95]" />
        <span className="ml-2 text-lg">Loading event details...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <Button
          asChild
          variant="outline"
          className="group rounded-full px-8 border-[#1B3668] text-[#1B3668] hover:bg-[#1B3668] hover:text-white transition-all duration-200"
        >
          <Link href="/events">
            <ChevronLeft className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Events
          </Link>
        </Button>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-gray-500 text-xl mb-4">Event not found</div>
        <Button
          asChild
          variant="outline"
          className="group rounded-full px-8 border-[#1B3668] text-[#1B3668] hover:bg-[#1B3668] hover:text-white transition-all duration-200"
        >
          <Link href="/events">
            <ChevronLeft className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Events
          </Link>
        </Button>
      </div>
    )
  }

  const eventDate = new Date(event.date)
  const isPastEvent = eventDate < new Date()
  const hasDocument = !!event.documentUrl

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="bg-gradient-to-r from-[#1B3668] to-[#0A2240] shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-[#F59E0B]" />
            <h1 className="text-3xl font-bold text-white">Event Details</h1>
          </div>
          <p className="text-blue-100 mt-2 max-w-2xl">View details for the scheduled event</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
                    <CardTitle className="text-2xl font-bold text-[#1F2937]">{event.title}</CardTitle>
                    <CardDescription className="text-base mt-1 text-[#6B7280]">
                      {isPastEvent ? "Event Materials" : "Event Announcement"}
                    </CardDescription>
                  </div>
                </div>
                <a
                  href={event.documentUrl}
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
              {event.documentType === "image" ? (
                <div className="flex justify-center">
                  <div className="relative max-w-full overflow-hidden rounded-lg border border-gray-200">
                    <Image
                      src={event.documentUrl || "/placeholder.svg"}
                      alt={event.title}
                      width={800}
                      height={600}
                      className="object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="aspect-[16/9] w-full rounded-lg border border-gray-200">
                  <iframe
                    src={`${event.documentUrl}#toolbar=0`}
                    className="h-full w-full rounded-lg"
                    title={event.title}
                  />
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
                View Event Details
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
                    <CardTitle className="text-2xl font-bold text-[#1F2937]">{event.title}</CardTitle>
                    <CardDescription className="text-base mt-1 text-[#6B7280]">
                      Organized by {event.organizer.firstName}
                    </CardDescription>
                  </div>
                </div>
                {isPastEvent ? (
                  <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                    Past Event
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Upcoming
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-[#1F2937] mb-2">Description</h3>
                <p className="text-[#4B5563]">{event.description}</p>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-[#1B3668]/10 p-2 flex-shrink-0 border border-[#1B3668]/20">
                    <Calendar className="h-5 w-5 text-[#1B3668]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#6B7280]">Date</h4>
                    <p className="text-[#1F2937] font-medium">
                      {eventDate.toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-[#1B3668]/10 p-2 flex-shrink-0 border border-[#1B3668]/20">
                    <Clock className="h-5 w-5 text-[#1B3668]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#6B7280]">Time</h4>
                    <p className="text-[#1F2937] font-medium">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-[#1B3668]/10 p-2 flex-shrink-0 border border-[#1B3668]/20">
                    <MapPin className="h-5 w-5 text-[#1B3668]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#6B7280]">Location</h4>
                    <p className="text-[#1F2937] font-medium">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-[#1B3668]/10 p-2 flex-shrink-0 border border-[#1B3668]/20">
                    <User className="h-5 w-5 text-[#1B3668]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#6B7280]">Organizer</h4>
                    <p className="text-[#1F2937] font-medium">{event.organizer.firstName}</p>
                  </div>
                </div>
              </div>
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

              {hasDocument && (
                <Button
                  onClick={() => setShowDocument(true)}
                  className="rounded-full px-6 bg-[#1B3668] hover:bg-[#0A2240] transition-colors duration-200"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Document
                </Button>
              )}

              {!isPastEvent && !hasDocument && (
                <Button className="rounded-full px-6 bg-[#1B3668] hover:bg-[#0A2240] transition-colors duration-200">
                  Add to Calendar
                </Button>
              )}
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  )
}
