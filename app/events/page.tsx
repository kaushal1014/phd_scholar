"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Bell, ChevronLeft, UserPlus, CalendarClock, Loader2, Clock, FileText, MapPin, User, Info, ExternalLink } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "react-toastify"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import NewEventForm from "@/components/new-event-form"

// Types
interface UserType {
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
  documentUrl?: string
  documentType?: "pdf" | "image"
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
  documentUrl?: string
  documentType?: "pdf" | "image"
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("monthly-meetings")
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const router = useRouter()

  // Fetch user data
  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/session")
      if (!response.ok) {
        setUser(null)
        return
      }

      const data = await response.json()
      setUser(data.user || null)
    } catch (error) {
      console.error("Error fetching user:", error)
      setUser(null)
    }
  }

  // Fetch meetings and events
  const fetchData = async () => {
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
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    fetchUser()
  }, [])

  const handleMeetingSubmit = async (data: any) => {
    if (!data) {
      setIsMeetingDialogOpen(false)
      setEditingMeeting(null)
      return
    }

    try {
      const url = editingMeeting 
        ? `/api/collaborations/meetings/${editingMeeting._id}`
        : "/api/collaborations/meetings"
      
      const method = editingMeeting ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(editingMeeting ? "Failed to update meeting" : "Failed to schedule meeting")
      }

      const updatedMeeting = await response.json()
      
      if (editingMeeting) {
        setMeetings(meetings.map(m => m._id === updatedMeeting._id ? updatedMeeting : m))
        toast.success("Meeting updated successfully")
      } else {
        setMeetings([updatedMeeting, ...meetings])
        toast.success("Meeting scheduled successfully")
      }
      
      setIsMeetingDialogOpen(false)
      setEditingMeeting(null)
    } catch (error) {
      console.error("Error with meeting:", error)
      toast.error(editingMeeting ? "Failed to update meeting" : "Failed to schedule meeting")
    }
  }

  const handleEventSubmit = async (data: any) => {
    if (!data) {
      setIsEventDialogOpen(false)
      setEditingEvent(null)
      return
    }

    try {
      const url = editingEvent 
        ? `/api/collaborations/events/${editingEvent._id}`
        : "/api/collaborations/events"
      
      const method = editingEvent ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(editingEvent ? "Failed to update event" : "Failed to create event")
      }

      const updatedEvent = await response.json()
      
      if (editingEvent) {
        setEvents(events.map(e => e._id === updatedEvent._id ? updatedEvent : e))
        toast.success("Event updated successfully")
      } else {
        setEvents([updatedEvent, ...events])
        toast.success("Event created successfully")
      }
      
      setIsEventDialogOpen(false)
      setEditingEvent(null)
    } catch (error) {
      console.error("Error with event:", error)
      toast.error(editingEvent ? "Failed to update event" : "Failed to create event")
    }
  }

  const handleDeleteMeeting = async (meetingId: string) => {
    if (!confirm("Are you sure you want to delete this meeting?")) return

    try {
      const response = await fetch(`/api/collaborations/meetings/${meetingId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete meeting")
      }

      setMeetings(meetings.filter(m => m._id !== meetingId))
      toast.success("Meeting deleted successfully")
    } catch (error) {
      console.error("Error deleting meeting:", error)
      toast.error("Failed to delete meeting")
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const response = await fetch(`/api/collaborations/events/${eventId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete event")
      }

      setEvents(events.filter(e => e._id !== eventId))
      toast.success("Event deleted successfully")
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("Failed to delete event")
    }
  }

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting)
    setIsMeetingDialogOpen(true)
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setIsEventDialogOpen(true)
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

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.getDate(),
      month: date.toLocaleString("default", { month: "short" }),
      year: date.getFullYear(),
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#1B3668] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#1F2937]">Loading Academic Events</h3>
          <p className="text-sm text-[#6B7280] mt-2">Please wait while we retrieve the latest research events</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#1B3668] py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="h-8 w-8 text-[#F59E0B]" />
            <h1 className="text-3xl font-bold text-white">Events</h1>
          </div>
          <p className="text-blue-100">Stay updated with all research events and monthly meetings</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gray-100 rounded-full p-3">
              <Calendar className="h-6 w-6 text-[#1B3668]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Research Events</h2>
              <p className="text-gray-500 text-sm">View monthly meetings, upcoming events, and past events</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab("monthly-meetings")}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "monthly-meetings"
                    ? "border-[#1B3668] text-[#1B3668]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Monthly Meetings
              </button>
              <button
                onClick={() => setActiveTab("upcoming-events")}
                className={`py-2 px-4 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === "upcoming-events"
                    ? "border-[#1B3668] text-[#1B3668]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Bell className="h-4 w-4 mr-2" />
                Upcoming Events
              </button>
              <button
                onClick={() => setActiveTab("past-events")}
                className={`py-2 px-4 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === "past-events"
                    ? "border-[#1B3668] text-[#1B3668]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Clock className="h-4 w-4 mr-2" />
                Past Events
              </button>
            </div>
          </div>

          {/* Monthly Meetings Tab */}
          {activeTab === "monthly-meetings" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-[#F59E0B]" />
                  Monthly Meetings
                </h3>
                {isAdmin && (
                  <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#1B3668] hover:bg-[#0A2240]">
                        <CalendarClock className="h-4 w-4 mr-2" />
                        Schedule Meeting
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>
                          {editingMeeting ? "Edit Meeting" : "Schedule New Meeting"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingMeeting 
                            ? "Update the meeting details"
                            : "Schedule a new monthly meeting for researchers"}
                        </DialogDescription>
                      </DialogHeader>
                      <NewEventForm 
                        onSubmit={handleMeetingSubmit} 
                        type="meeting"
                        initialData={editingMeeting}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {/* Monthly Meeting Schedule Notice */}
              <div className="bg-blue-50 border-l-4 border-[#1B3668] p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-[#1B3668]" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-[#1B3668]">Regular Monthly Meeting Schedule</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Last Saturday of every month at PESU RF conference room during 10am to 12pm.
                    </p>
                  </div>
                </div>
              </div>

              {/* Meetings List */}
              <div className="space-y-4">
                {monthlyMeetings.length > 0 ? (
                  monthlyMeetings.map((meeting) => {
                    const formattedDate = formatDate(meeting.date)
                    return (
                      <div key={meeting._id} className="mb-4">
                        <Link href={`/events/meetings/${meeting._id}`} className="block">
                          <div className="border border-gray-200 rounded-lg hover:border-[#1B3668] hover:shadow-md transition-all duration-200 overflow-hidden">
                            <div className="flex">
                              <div className="w-24 bg-gray-50 border-r border-gray-200 flex flex-col items-center justify-center p-3">
                                <div className="text-center">
                                  <span className="block text-sm font-medium text-[#1B3668]">{formattedDate.month}</span>
                                  <span className="block text-3xl font-bold text-[#1B3668]">{formattedDate.day}</span>
                                  <span className="block text-xs text-[#1B3668]">{formattedDate.year}</span>
                                </div>
                                <div className="mt-2 text-xs font-medium bg-[#1B3668]/10 text-[#1B3668] px-2 py-1 rounded-full">
                                  {meeting.time}
                                </div>
                              </div>
                              <div className="flex-1 p-4">
                                <div className="flex items-start justify-between">
                                  <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                                  <Badge className="bg-[#1B3668]">Meeting</Badge>
                                </div>
                                <p className="text-sm text-gray-500 mt-1 mb-2 line-clamp-2">{meeting.description}</p>
                                <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-gray-500">
                                  <div className="flex items-center">
                                    <MapPin className="h-3.5 w-3.5 mr-1 text-[#1B3668]" />
                                    <span>{meeting.location}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <User className="h-3.5 w-3.5 mr-1 text-[#1B3668]" />
                                    <span>Organized by: {meeting.organizer.firstName}</span>
                                  </div>
                                  {meeting.documentUrl && (
                                    <div className="flex items-center">
                                      <FileText className="h-3.5 w-3.5 mr-1 text-[#1B3668]" />
                                      <span className="text-[#1B3668]">
                                        {meeting.documentType === "pdf" ? "PDF Document" : "Image"} available
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {meeting.documentUrl && (
                                <div className="w-24 border-l border-gray-200 bg-gray-50 flex items-center justify-center">
                                  {meeting.documentType === "image" ? (
                                    <div className="relative h-full w-full">
                                      <Image
                                        src={meeting.documentUrl || "/placeholder.svg?height=100&width=100"}
                                        alt={`Document for ${meeting.title}`}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center p-2">
                                      <FileText className="h-8 w-8 text-[#1B3668]" />
                                      <span className="text-xs text-center text-[#1B3668] mt-1">View Document</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                        {isAdmin && (
                          <div className="flex gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditMeeting(meeting)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteMeeting(meeting._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No monthly meetings scheduled</h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                      There are currently no monthly meetings scheduled. Check back later for updates.
                    </p>
                    {isAdmin && (
                      <Button onClick={() => setIsMeetingDialogOpen(true)} className="bg-[#1B3668] hover:bg-[#0A2240]">
                        <CalendarClock className="h-4 w-4 mr-2" />
                        Schedule a Meeting
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upcoming Events Tab */}
          {activeTab === "upcoming-events" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-[#F59E0B]" />
                  Upcoming Events
                </h3>
                {isAdmin && (
                  <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#1B3668] hover:bg-[#0A2240]">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>
                          {editingEvent ? "Edit Event" : "Create New Event"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingEvent 
                            ? "Update the event details"
                            : "Create a new event for researchers"}
                        </DialogDescription>
                      </DialogHeader>
                      <NewEventForm 
                        onSubmit={handleEventSubmit} 
                        type="event"
                        initialData={editingEvent}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {/* Upcoming Events List */}
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => {
                    const formattedDate = formatDate(event.date)
                    return (
                      <div key={event._id} className="mb-4">
                        <Link href={`/events/events/${event._id}`} className="block">
                          <div className="border border-gray-200 rounded-lg hover:border-[#1B3668] hover:shadow-md transition-all duration-200 overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                              <div className="w-full md:w-24 bg-[#1B3668]/5 md:border-r border-gray-200 flex flex-col items-center justify-center p-3">
                                <div className="text-center">
                                  <span className="block text-sm font-medium text-[#1B3668]">{formattedDate.month}</span>
                                  <span className="block text-3xl font-bold text-[#1B3668]">{formattedDate.day}</span>
                                  <span className="block text-xs text-[#1B3668]">{formattedDate.year}</span>
                                </div>
                                <div className="mt-2 text-xs font-medium bg-[#1B3668]/10 text-[#1B3668] px-2 py-1 rounded-full">
                                  {event.time}
                                </div>
                              </div>
                              <div className="flex-1 p-4">
                                <div className="flex items-start justify-between">
                                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                                  <Badge className="bg-[#1B3668]">Upcoming</Badge>
                                </div>
                                <p className="text-sm text-gray-500 mt-1 mb-2 line-clamp-2">{event.description}</p>
                                <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-gray-500">
                                  <div className="flex items-center">
                                    <MapPin className="h-3.5 w-3.5 mr-1 text-[#1B3668]" />
                                    <span>{event.location}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <User className="h-3.5 w-3.5 mr-1 text-[#1B3668]" />
                                    <span>Organized by: {event.organizer.firstName}</span>
                                  </div>
                                  {event.documentUrl && (
                                    <div className="flex items-center">
                                      <FileText className="h-3.5 w-3.5 mr-1 text-[#1B3668]" />
                                      <span className="text-[#1B3668]">
                                        {event.documentType === "pdf" ? "PDF Document" : "Image"} available
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {event.documentUrl && (
                                <div className="w-full md:w-32 h-32 md:h-auto border-t md:border-l border-gray-200 bg-gray-50 flex items-center justify-center">
                                  {event.documentType === "image" ? (
                                    <div className="relative h-full w-full">
                                      <Image
                                        src={event.documentUrl || "/placeholder.svg?height=100&width=100"}
                                        alt={`Document for ${event.title}`}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center p-4">
                                      <FileText className="h-10 w-10 text-[#1B3668]" />
                                      <span className="text-xs text-center text-[#1B3668] mt-2">View Document</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                        {isAdmin && (
                          <div className="flex gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditEvent(event)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteEvent(event._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No upcoming events</h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                      There are currently no upcoming events scheduled. Check back later for updates.
                    </p>
                    {isAdmin && (
                      <Button onClick={() => setIsEventDialogOpen(true)} className="bg-[#1B3668] hover:bg-[#0A2240]">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add New Event
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Past Events Tab */}
          {activeTab === "past-events" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-500" />
                  Past Events
                </h3>
              </div>

              {/* Past Events List */}
              <div className="space-y-4">
                {pastEvents.length > 0 ? (
                  pastEvents.map((event) => {
                    const formattedDate = formatDate(event.date)
                    return (
                      <Link href={`/events/events/${event._id}`} key={event._id} className="block">
                        <div className="border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-md transition-all duration-200 overflow-hidden bg-gray-50">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-24 bg-gray-100 md:border-r border-gray-200 flex flex-col items-center justify-center p-3">
                              <div className="text-center">
                                <span className="block text-sm font-medium text-gray-500">{formattedDate.month}</span>
                                <span className="block text-3xl font-bold text-gray-500">{formattedDate.day}</span>
                                <span className="block text-xs text-gray-500">{formattedDate.year}</span>
                              </div>
                              <div className="mt-2 text-xs font-medium bg-gray-200 text-gray-500 px-2 py-1 rounded-full">
                                {event.time}
                              </div>
                            </div>
                            <div className="flex-1 p-4">
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-gray-700">{event.title}</h4>
                                <Badge variant="outline" className="text-gray-500 border-gray-400">
                                  Past
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mt-1 mb-2 line-clamp-2">{event.description}</p>
                              <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-gray-500">
                                <div className="flex items-center">
                                  <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500" />
                                  <span>{event.location}</span>
                                </div>
                                <div className="flex items-center">
                                  <User className="h-3.5 w-3.5 mr-1 text-gray-500" />
                                  <span>Organized by: {event.organizer.firstName}</span>
                                </div>
                                {event.documentUrl && (
                                  <div className="flex items-center">
                                    <FileText className="h-3.5 w-3.5 mr-1 text-gray-500" />
                                    <span>{event.documentType === "pdf" ? "PDF Document" : "Image"} available</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {event.documentUrl && (
                              <div className="w-full md:w-32 h-32 md:h-auto border-t md:border-l border-gray-200 bg-gray-100 flex items-center justify-center opacity-70">
                                {event.documentType === "image" ? (
                                  <div className="relative h-full w-full">
                                    <Image
                                      src={event.documentUrl || "/placeholder.svg?height=100&width=100"}
                                      alt={`Document for ${event.title}`}
                                      fill
                                      className="object-cover grayscale"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center p-4">
                                    <FileText className="h-10 w-10 text-gray-400" />
                                    <span className="text-xs text-center text-gray-500 mt-2">View Archive</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  })
                ) : (
                  <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No past events</h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                      There are no past events in the archive yet. Events will appear here after they have taken place.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export type {Meeting, Event}