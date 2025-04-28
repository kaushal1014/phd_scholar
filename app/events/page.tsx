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
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import NewEventForm from "@/components/new-event-form"
import ReactCalendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

// Add custom styles for the calendar
const calendarStyles = `
  .react-calendar {
    width: 350px;
    max-width: 100%;
    border: none;
    font-family: inherit;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    border-radius: 0.5rem;
    padding: 0.5rem;
  }
  
  .react-calendar__navigation {
    margin-bottom: 0.5rem;
  }
  
  .react-calendar__navigation button {
    min-width: 30px;
    background: none;
    font-size: 0.875rem;
    color: #1B3668;
  }
  
  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: #f3f4f6;
  }
  
  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .react-calendar__month-view__weekdays__weekday {
    padding: 0.5rem;
  }
  
  .react-calendar__tile {
    padding: 0.5rem;
    font-size: 0.875rem;
    border-radius: 0.25rem;
  }
  
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #f3f4f6;
  }
  
  .react-calendar__tile--last-saturday {
    background-color: #3b82f6 !important;
    color: white !important;
  }
  
  .react-calendar__tile--today {
    background-color: #10b981 !important;
    color: white !important;
  }

  .react-calendar__tile--last-saturday-today {
    background-color: #8b5cf6 !important;
    color: white !important;
  }

  /* Remove active date highlighting */
  .react-calendar__tile--active {
    background: none !important;
    color: inherit !important;
  }
  
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background-color: #f3f4f6 !important;
  }
`

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
  documentType?: "pdf" | "image" | "pptx"
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("upcoming-events")
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)
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
      if (!meetingsRes.ok) {
        throw new Error(`Failed to fetch meetings: ${meetingsRes.statusText}`)
      }
      const meetingsData = await meetingsRes.json()
      setMeetings(meetingsData)

      // Fetch events
      const eventsRes = await fetch("/api/collaborations/events")
      if (!eventsRes.ok) {
        throw new Error(`Failed to fetch events: ${eventsRes.statusText}`)
      }
      const eventsData = await eventsRes.json()
      setEvents(eventsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      throw error // Re-throw the error to be caught by the useEffect
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)
        await Promise.all([fetchData(), fetchUser()])
      } catch (error) {
        console.error("Error initializing data:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
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
      } else {
        setMeetings([updatedMeeting, ...meetings])
        }
      
      setIsMeetingDialogOpen(false)
      setEditingMeeting(null)
    } catch (error) {
      console.error("Error with meeting:", error)
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
        } else {
        setEvents([updatedEvent, ...events])
        }
      
      setIsEventDialogOpen(false)
      setEditingEvent(null)
    } catch (error) {
      console.error("Error with event:", error)
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
      } catch (error) {
      console.error("Error deleting meeting:", error)
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
      } catch (error) {
      console.error("Error deleting event:", error)
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

  // Filter events by date and time
  const currentDateTime = new Date()
  console.log("Current DateTime:", currentDateTime)
  
  const upcomingEvents = events.filter(event => {
    console.log("Event data:", event)
    try {
      const eventDate = typeof event.date === 'string' ? new Date(event.date) : event.date
      const [hours, minutes] = event.time.split(':')
      eventDate.setHours(parseInt(hours, 10))
      eventDate.setMinutes(parseInt(minutes, 10))
      console.log("Parsed Event DateTime:", eventDate, "Event:", event.title)
      return eventDate >= currentDateTime
    } catch (error) {
      console.error("Error parsing date for event:", event, error)
      return false
    }
  })

  const pastEvents = events.filter(event => {
    try {
      const eventDate = typeof event.date === 'string' ? new Date(event.date) : event.date
      const [hours, minutes] = event.time.split(':')
      eventDate.setHours(parseInt(hours, 10))
      eventDate.setMinutes(parseInt(minutes, 10))
      return eventDate < currentDateTime
    } catch (error) {
      console.error("Error parsing date for event:", event, error)
      return false
    }
  })

  console.log("Total Events:", events.length)
  console.log("Upcoming Events:", upcomingEvents.length)
  console.log("Past Events:", pastEvents.length)

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.getDate(),
      month: date.toLocaleString("default", { month: "short" }),
      year: date.getFullYear(),
    }
  }

  const getLastSaturdays = () => {
    const lastSaturdays = []
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    
    // Calculate for previous, current, and next year
    for (let year = currentYear - 1; year <= currentYear + 1; year++) {
      for (let month = 0; month < 12; month++) {
        const lastDay = new Date(year, month + 1, 0)
        const lastSaturday = new Date(lastDay)
        
        // Move back to the last Saturday
        while (lastSaturday.getDay() !== 6) {
          lastSaturday.setDate(lastSaturday.getDate() - 1)
        }
        
        lastSaturdays.push(lastSaturday)
      }
    }
    
    return lastSaturdays
  }

  const tileClassName = ({ date }: { date: Date }) => {
    const lastSaturdays = getLastSaturdays()
    const isLastSaturday = lastSaturdays.some(
      saturday => 
        date.getDate() === saturday.getDate() &&
        date.getMonth() === saturday.getMonth() &&
        date.getFullYear() === saturday.getFullYear()
    )
    
    const isToday = 
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear()
    
    if (isLastSaturday && isToday) return 'react-calendar__tile--last-saturday-today'
    if (isLastSaturday) return 'react-calendar__tile--last-saturday'
    if (isToday) return 'react-calendar__tile--today'
    return ''
  }

  const EventCard = ({ event, onEdit, onDelete }: { event: Event; onEdit: (event: Event) => void; onDelete: (id: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false)
    const files = event.documentUrl?.split(',').filter(Boolean) || []

    const handleFileDownload = async (filePath: string) => {
      try {
        const response = await fetch(`/api/events/download?path=${encodeURIComponent(filePath)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/octet-stream',
          },
        })
        
        if (!response.ok) {
          throw new Error('Failed to download file')
        }

        // Get the filename from the path
        const fileName = filePath.split('/').pop() || 'download'

        // Create a blob from the response
        const blob = await response.blob()
        
        // Create a download link and trigger it
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } catch (error) {
        console.error('Error downloading file:', error)
        alert('Failed to download file. Please try again.')
      }
    }

    return (
      <div className="mb-4">
        <Link href={`/events/events/${event._id}`} className="block">
          <Card className="hover:border-[#1B3668] hover:shadow-md transition-all duration-200">
            <CardContent className="p-0">
              <div className="flex">
                <div className="w-24 bg-gray-50 border-r border-gray-200 flex flex-col items-center justify-center p-3">
                  <div className="text-center">
                    <span className="block text-sm font-medium text-[#1B3668]">{formatDate(event.date).month}</span>
                    <span className="block text-3xl font-bold text-[#1B3668]">{formatDate(event.date).day}</span>
                    <span className="block text-xs text-[#1B3668]">{formatDate(event.date).year}</span>
                  </div>
                  <div className="mt-2 text-xs font-medium bg-[#1B3668]/10 text-[#1B3668] px-2 py-1 rounded-full">
                    {event.time}
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <Badge className="bg-[#1B3668]">Event</Badge>
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
                    {files.length > 0 && (
                      <div className="flex items-center">
                        <FileText className="h-3.5 w-3.5 mr-1 text-[#1B3668]" />
                        <span className="text-[#1B3668]">
                          {files.length} {files.length === 1 ? 'File' : 'Files'} attached
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        {user?.isAdmin && (
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(event)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(event._id)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    )
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
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <style jsx>{calendarStyles}</style>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Events & Meetings</h1>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Monthly Meeting Calendar</h2>
              <button
                onClick={() => setShowCalendar(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <ReactCalendar
              tileClassName={tileClassName}
              className="border-0"
              selectRange={false}
              onClickDay={undefined}
              value={null}
              tileDisabled={() => true}
            />
            <div className="mt-4 text-xs sm:text-sm text-gray-600">
              <p>• Last Saturdays of each month are highlighted in blue</p>
              <p>• Today's date is highlighted in green</p>
              <p>• If today is a last Saturday, it's highlighted in purple</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B3668]">Events</h1>
            <p className="text-blue-500 text-sm sm:text-base">Stay updated with all research events</p>
          </div>
          {user?.isAdmin && (
            <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1B3668] text-white hover:bg-[#0F2341] w-full sm:w-auto">
                  <CalendarClock className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
                  <DialogDescription>
                    {editingEvent 
                      ? "Update the event details below"
                      : "Schedule a new event"}
                  </DialogDescription>
                </DialogHeader>
                <NewEventForm
                  onSubmit={handleEventSubmit}
                  initialData={editingEvent}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
        <p className="text-gray-500 text-xs sm:text-sm">View upcoming events and past events</p>
      </div>

      {/* Regular Monthly Meeting Schedule */}
      <div className="bg-blue-50 border-l-4 border-[#1B3668] p-3 sm:p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-[#1B3668]" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm sm:text-base font-medium text-[#1B3668]">Regular Monthly Meeting Schedule</h3>
              <p className="text-xs sm:text-sm text-blue-700 mt-1">
                Last Saturday of every month at PESU RF conference room during 10am to 12pm.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCalendar(true)}
            className="flex items-center gap-2 bg-[#1B3668] text-white px-4 py-2 rounded-lg hover:bg-[#0F2341] transition-colors w-full sm:w-auto"
          >
            <Calendar className="h-4 w-4" />
            View Calendar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 sm:space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("upcoming-events")}
          className={`px-4 py-2 rounded-lg w-full sm:w-auto ${
            activeTab === "upcoming-events"
              ? "bg-[#1B3668] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Upcoming Events
        </button>
        <button
          onClick={() => setActiveTab("past-events")}
          className={`px-4 py-2 rounded-lg w-full sm:w-auto ${
            activeTab === "past-events"
              ? "bg-[#1B3668] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Past Events
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4 sm:space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <>
            {/* Upcoming Events Tab */}
            {activeTab === "upcoming-events" && (
              <div className="space-y-2 sm:space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold text-[#1B3668]">
                  Upcoming Events
                </h2>
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <EventCard key={event._id} event={event} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-4 sm:p-6 text-center">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No upcoming events</h3>
                      <p className="text-gray-500 text-xs sm:text-base">
                        There are currently no upcoming events scheduled. Check back later for updates.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Past Events Tab */}
            {activeTab === "past-events" && (
              <div className="space-y-2 sm:space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold text-[#1B3668]">
                  Past Events
                </h2>
                {pastEvents.length > 0 ? (
                  pastEvents.map((event) => (
                    <EventCard key={event._id} event={event} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-4 sm:p-6 text-center">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No past events</h3>
                      <p className="text-gray-500 text-xs sm:text-base">
                        There are no past events to display.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export type {Meeting, Event}