import { NextResponse } from "next/server"
import connectDB from "@/server/db"
import PhdScholar from "@/server/models/PhdScholar"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get current date
    const now = new Date()

    // Find all upcoming DC meetings (scheduled in the future and not happened yet)
    const scholars = await PhdScholar.find({
      $and: [
        { "phdMilestones": { $exists: true } },
        { "phdMilestones.dcMeetings": { $exists: true } },
        { "phdMilestones.dcMeetings.DCM": { $exists: true } },
        {
          "phdMilestones.dcMeetings.DCM": {
            $elemMatch: {
              scheduledDate: { $gte: now },
              happened: false,
            },
          },
        },
      ],
    })
      .select("personalDetails admissionDetails phdMilestones.dcMeetings user")
      .populate({
        path: "user",
        select: "firstName lastName email",
        match: { deletedAt: null } // Only populate if user is not deleted
      })

    // Extract and format the meetings
    const meetings = []

    for (const scholar of scholars) {
      // Skip if user is null (deleted user or no matching user)
      if (!scholar.user) continue;

      // Skip if phdMilestones or dcMeetings is not properly initialized
      if (!scholar.phdMilestones?.dcMeetings?.DCM) continue;

      const upcomingMeetings = scholar.phdMilestones.dcMeetings.DCM.filter(
        (meeting: any) => meeting?.scheduledDate && new Date(meeting.scheduledDate) >= now && !meeting.happened,
      )

      if (upcomingMeetings.length > 0) {
        const closestMeeting = upcomingMeetings.reduce((closest:any, meeting:any) => {
          return !closest || new Date(meeting.scheduledDate) < new Date(closest.scheduledDate) ? meeting : closest
        }, null)

        if (closestMeeting) {
          meetings.push({
            _id: closestMeeting._id,
            scheduledDate: closestMeeting.scheduledDate,
            happened: closestMeeting.happened,
            phdScholar: {
              _id: scholar._id,
              personalDetails: scholar.personalDetails || {},
              admissionDetails: scholar.admissionDetails || {},
              user: scholar.user,
            },
          })
        }
      }
    }

    // Sort by date (closest first)
    meetings.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())

    return NextResponse.json({ meetings })
  } catch (error) {
    console.error("Error fetching upcoming meetings:", error)
    return NextResponse.json({ error: "Failed to fetch upcoming meetings" }, { status: 500 })
  }
}