"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import type { PhdScholar } from "@/types"
import CalendarComponent from "react-calendar"
import 'react-calendar/dist/Calendar.css';
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface SupervisorTrackerProps {
  scholars: PhdScholar[]
}

export function SupervisorTracker({ scholars }: SupervisorTrackerProps) {
  const router = useRouter()
  const now = new Date()

  // Gather all DC meeting dates for all scholars
  const allMeetingDates: { date: Date, scholar: any, meeting: any }[] = []
  for (const scholar of scholars) {
    if (!scholar.phdMilestones?.dcMeetings?.DCM) continue
    for (const meeting of scholar.phdMilestones.dcMeetings.DCM) {
      if (meeting?.scheduledDate) {
        allMeetingDates.push({
          date: new Date(meeting.scheduledDate),
          scholar,
          meeting,
        })
      }
    }
  }

  // For calendar selection
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const meetingsOnSelectedDate = selectedDate
    ? allMeetingDates.filter(md => md.date.toDateString() === selectedDate.toDateString())
    : []

  // Compute upcoming meetings from scholars
  const upcomingMeetings = useMemo(() => {
    const meetings: any[] = []
    for (const scholar of scholars) {
      if (!scholar.phdMilestones?.dcMeetings?.DCM) continue
      const futureMeetings = scholar.phdMilestones.dcMeetings.DCM.filter(
        (meeting: any) => meeting?.scheduledDate && new Date(meeting.scheduledDate) >= now && !meeting.happened
      )
      for (const meeting of futureMeetings) {
        meetings.push({
          _id: meeting._id || `meeting-${scholar._id || 'unknown'}-${meeting.scheduledDate}`,
          scheduledDate: meeting.scheduledDate,
          happened: meeting.happened,
          phdScholar: {
            _id: scholar._id || 'unknown',
            personalDetails: scholar.personalDetails,
            admissionDetails: scholar.admissionDetails,
          },
        })
      }
    }
    // Sort by date (soonest first)
    meetings.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    return meetings
  }, [scholars])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getDaysRemaining = (dateString: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const targetDate = new Date(dateString)
    targetDate.setHours(0, 0, 0, 0)
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const navigateToScholar = (scholarId: string) => {
    router.push(`/supervisor/scholar/${scholarId}`)
  }

  const [showCalendar, setShowCalendar] = useState(false)

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl text-[#1B3668]">Upcoming DC Meetings</CardTitle>
      </CardHeader>
      <CardContent>
        <Button className="mb-4 bg-[#1B3668] hover:bg-[#1B3668]/90" onClick={() => setShowCalendar(true)}>
          Show DC Meetings Calendar
        </Button>
        <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>DC Meetings Calendar</DialogTitle>
            </DialogHeader>
            <div>
              <CalendarComponent
                value={selectedDate}
                onChange={date => setSelectedDate(date as Date)}
                tileClassName={({ date, view }) => {
                  if (view === 'month' && allMeetingDates.some(md => md.date.toDateString() === date.toDateString())) {
                    return "meeting-highlight";
                  }
                  return undefined;
                }}
              />
              {selectedDate && meetingsOnSelectedDate.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <h4 className="font-semibold mb-2 text-blue-900">Meetings on {selectedDate.toLocaleDateString()}</h4>
                  <ul className="space-y-2">
                    {meetingsOnSelectedDate.map((md, idx) => (
                      <li key={idx} className="flex flex-col">
                        <span className="font-medium text-[#1B3668]">
                          {md.scholar.personalDetails.firstName} {md.scholar.personalDetails.lastName}
                        </span>
                        <span className="text-sm text-muted-foreground">Department: {md.scholar.admissionDetails.department}</span>
                        <span className="text-sm text-muted-foreground">Time: {formatDate(md.meeting.scheduledDate)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCalendar(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {upcomingMeetings.length > 0 ? (
          <div className="space-y-4">
            {upcomingMeetings.map((meeting) => {
              const daysRemaining = getDaysRemaining(meeting.scheduledDate)
              return (
                <Card key={meeting._id} className="bg-white shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-[#1B3668]/10 p-3 rounded-full mr-4">
                          <Calendar className="h-5 w-5 text-[#1B3668]" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium text-[#1B3668]">
                              {meeting.phdScholar.personalDetails.firstName} {meeting.phdScholar.personalDetails.lastName}
                            </h3>
                            <Badge
                              className={`ml-2 ${
                                daysRemaining <= 3
                                  ? "bg-red-500"
                                  : daysRemaining <= 7
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                            >
                              {daysRemaining === 0
                                ? "Today"
                                : daysRemaining === 1
                                  ? "Tomorrow"
                                  : `${daysRemaining} days`}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Department: {meeting.phdScholar.admissionDetails.department}
                          </p>
                          <div className="flex items-center mt-1">
                            <Clock className="h-4 w-4 text-gray-500 mr-1" />
                            <p className="text-sm text-muted-foreground">{formatDate(meeting.scheduledDate)}</p>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => navigateToScholar(meeting.phdScholar._id)}
                        className="bg-[#1B3668] hover:bg-[#1B3668]/90"
                      >
                        View Scholar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center p-6 text-muted-foreground">
            <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>No upcoming DC meetings</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SupervisorTracker; 