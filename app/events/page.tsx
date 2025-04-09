"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Bell, ChevronLeft, UserPlus, CalendarClock, Loader2, ExternalLink, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "react-toastify"
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

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("monthly-meetings")
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
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
          router.push("/login?callbackUrl=/events")
          return
        }

        setUser(data.user)
      } catch (error) {
        console.error("Error fetching user:", error)
        router.push("/login?callbackUrl=/events")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  // Fetch meetings and events
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        // Fetch meetings
        const meetingsRes = await fetch("/api/collaborations/meetings")
        if (meetingsRes.ok) {
          const meetingsData = await meetingsRes.json()
          setMeetings(meetingsData)
        }

        // Fetch events
        const eventsRes = await fetch("/api/collaborations/events")
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json()
          setEvents(eventsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [user])

  const handleMeetingSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/collaborations/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to schedule meeting")
      }

      const newMeeting = await response.json()
      setMeetings([newMeeting, ...meetings])
      setIsMeetingDialogOpen(false)
      toast("Meeting scheduled successfully")
    } catch (error) {
      console.error("Error scheduling meeting:", error)
      toast("Failed to schedule meeting")
    }
  }

  const handleEventSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/collaborations/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create event")
      }

      const newEvent = await response.json()
      setEvents([newEvent, ...events])
      setIsEventDialogOpen(false)
      toast("Event created successfully")
    } catch (error) {
      console.error("Error creating event:", error)
      toast("Failed to create event")
    }
  }

  // Check if user is admin
  const isAdmin = user?.isAdmin === true

  // Filter events into past and upcoming
  const currentDate = new Date()
  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= currentDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const pastEvents = events
    .filter((event) => new Date(event.date) < currentDate)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Filter monthly meetings (assuming they are recurring monthly events)
  const monthlyMeetings = meetings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

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
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-[#F59E0B]" />
            <h1 className="text-3xl font-bold text-white">Events</h1>
          </div>
          <p className="text-blue-100 mt-2 max-w-2xl">Stay updated with all research events and monthly meetings</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Card className="border-[#E5E7EB] bg-white shadow-sm mb-8">
          <CardHeader className="border-b bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6] p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-[#1B3668]/10 p-3 border border-[#1B3668]/20">
                <Calendar className="h-8 w-8 text-[#1B3668]" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-[#1F2937]">Research Events</CardTitle>
                <CardDescription className="text-base mt-1 text-[#6B7280]">
                  View monthly meetings, upcoming events, and past events
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b px-6 py-4">
              <TabsList className="grid w-full grid-cols-3 bg-[#F3F4F6]">
                <TabsTrigger
                  value="monthly-meetings"
                  className="data-[state=active]:bg-[#1B3668] data-[state=active]:text-white transition-all duration-200 text-base py-3 font-medium"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Monthly Meetings
                </TabsTrigger>
                <TabsTrigger
                  value="upcoming-events"
                  className="data-[state=active]:bg-[#1B3668] data-[state=active]:text-white transition-all duration-200 text-base py-3 font-medium"
                >
                  <Bell className="h-5 w-5 mr-2" />
                  Upcoming Events
                </TabsTrigger>
                <TabsTrigger
                  value="past-events"
                  className="data-[state=active]:bg-[#1B3668] data-[state=active]:text-white transition-all duration-200 text-base py-3 font-medium"
                >
                  <Clock className="h-5 w-5 mr-2" />
                  Past Events
                </TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="p-6">
              <TabsContent value="monthly-meetings" className="mt-0">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-[#1F2937] flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-[#F59E0B]" />
                      Monthly Meetings
                    </h2>
                    {/* Only show for admin */}
                    {isAdmin && (
                      <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-[#1B3668] hover:bg-[#0A2240] transition-colors duration-200">
                            <CalendarClock className="h-4 w-4 mr-2" />
                            Schedule Meeting
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Schedule New Meeting</DialogTitle>
                            <DialogDescription>Schedule a new monthly meeting for researchers</DialogDescription>
                          </DialogHeader>
                          <NewEventForm onSubmit={handleMeetingSubmit} />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>

                  <div className="grid gap-4">
                    {monthlyMeetings.length > 0 ? (
                      monthlyMeetings.map((meeting) => (
                        <Link href={`/events/meetings/${meeting._id}`} key={meeting._id} className="block">
                          <Card className="border-[#E5E7EB] hover:border-[#1B3668] hover:shadow-md transition-all duration-200">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="rounded-full bg-[#1B3668]/10 p-2 flex-shrink-0 border border-[#1B3668]/20">
                                  <Calendar className="h-5 w-5 text-[#1B3668]" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h3 className="font-medium text-[#1F2937] mb-1">{meeting.title}</h3>
                                    <ExternalLink className="h-4 w-4 text-[#6B7280]" />
                                  </div>
                                  <p className="text-sm text-[#6B7280] mb-2">
                                    {meeting.description.length > 100
                                      ? `${meeting.description.substring(0, 100)}...`
                                      : meeting.description}
                                  </p>
                                  <div className="flex items-center text-xs text-[#6B7280]">
                                    <span className="font-medium">
                                      Date: {new Date(meeting.date).toLocaleDateString()}
                                    </span>
                                    <span className="inline-block mx-2 w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                                    <span>Time: {meeting.time}</span>
                                    <span className="inline-block mx-2 w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                                    <span>Location: {meeting.location}</span>
                                  </div>
                                  <div className="text-xs text-[#6B7280] mt-1">
                                    Organized by: {meeting.organizer.firstName}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No monthly meetings scheduled yet. {isAdmin ? "Schedule a new meeting!" : ""}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="upcoming-events" className="mt-0">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-[#1F2937] flex items-center">
                      <Bell className="h-5 w-5 mr-2 text-[#F59E0B]" />
                      Upcoming Events
                    </h2>
                    {/* Only show for admin */}
                    {isAdmin && (
                      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-[#1B3668] hover:bg-[#0A2240] transition-colors duration-200">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Event
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Create New Event</DialogTitle>
                            <DialogDescription>Add a new research event to the calendar</DialogDescription>
                          </DialogHeader>
                          <NewEventForm onSubmit={handleEventSubmit} />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>

                  <div className="grid gap-4">
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event) => (
                        <Link href={`/events/events/${event._id}`} key={event._id} className="block">
                          <Card className="border-[#E5E7EB] hover:border-[#1B3668] hover:shadow-md transition-all duration-200">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="rounded-full bg-[#1B3668]/10 p-2 flex-shrink-0 border border-[#1B3668]/20">
                                  <Bell className="h-5 w-5 text-[#1B3668]" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h3 className="font-medium text-[#1F2937] mb-1">{event.title}</h3>
                                    <ExternalLink className="h-4 w-4 text-[#6B7280]" />
                                  </div>
                                  <p className="text-sm text-[#6B7280] mb-2">
                                    {event.description.length > 100
                                      ? `${event.description.substring(0, 100)}...`
                                      : event.description}
                                  </p>
                                  <div className="flex items-center text-xs text-[#6B7280]">
                                    <span className="font-medium">
                                      Date: {new Date(event.date).toLocaleDateString()}
                                    </span>
                                    <span className="inline-block mx-2 w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                                    <span>Time: {event.time}</span>
                                    <span className="inline-block mx-2 w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                                    <span>Location: {event.location}</span>
                                  </div>
                                  <div className="text-xs text-[#6B7280] mt-1">
                                    Organized by: {event.organizer.firstName}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No upcoming events yet. {isAdmin ? "Add a new event!" : ""}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="past-events" className="mt-0">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-[#1F2937] flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-[#F59E0B]" />
                      Past Events
                    </h2>
                  </div>

                  <div className="grid gap-4">
                    {pastEvents.length > 0 ? (
                      pastEvents.map((event) => (
                        <Link href={`/events/events/${event._id}`} key={event._id} className="block">
                          <Card className="border-[#E5E7EB] hover:border-[#1B3668] hover:shadow-md transition-all duration-200 bg-gray-50">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="rounded-full bg-[#1B3668]/10 p-2 flex-shrink-0 border border-[#1B3668]/20">
                                  <Clock className="h-5 w-5 text-[#1B3668]" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h3 className="font-medium text-[#1F2937] mb-1">{event.title}</h3>
                                    <ExternalLink className="h-4 w-4 text-[#6B7280]" />
                                  </div>
                                  <p className="text-sm text-[#6B7280] mb-2">
                                    {event.description.length > 100
                                      ? `${event.description.substring(0, 100)}...`
                                      : event.description}
                                  </p>
                                  <div className="flex items-center text-xs text-[#6B7280]">
                                    <span className="font-medium">
                                      Date: {new Date(event.date).toLocaleDateString()}
                                    </span>
                                    <span className="inline-block mx-2 w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                                    <span>Time: {event.time}</span>
                                    <span className="inline-block mx-2 w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                                    <span>Location: {event.location}</span>
                                  </div>
                                  <div className="text-xs text-[#6B7280] mt-1">
                                    Organized by: {event.organizer.firstName}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">No past events to display.</div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
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
