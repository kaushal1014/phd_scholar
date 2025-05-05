import { NextResponse } from "next/server"
import connectDB from "@/server/db"
import PhdScholar from "@/server/models/PhdScholar"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const supervisorId = token.id;
    console.log('Supervisor ID:', supervisorId);
    await connectDB()
    const now = new Date()
    // Find all scholars supervised by this supervisor
    const scholars = await PhdScholar.find({
      researchSupervisor: supervisorId,
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
        match: { deletedAt: null }
      })
    console.log('Number of scholars found:', scholars.length);

    const meetings = []
    for (const scholar of scholars) {
      if (!scholar.user) continue;
      if (!scholar.phdMilestones?.dcMeetings?.DCM) continue;
      console.log('Scholar:', scholar._id, scholar.personalDetails, scholar.admissionDetails);
      const upcomingMeetings = scholar.phdMilestones.dcMeetings.DCM.filter(
        (meeting: any) => meeting?.scheduledDate && new Date(meeting.scheduledDate) >= now && !meeting.happened,
      )
      console.log('Upcoming meetings for scholar', scholar._id, ':', upcomingMeetings);
      if (upcomingMeetings.length > 0) {
        const closestMeeting = upcomingMeetings.reduce((closest: any, meeting: any) => {
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
    console.log('Final meetings array:', meetings);
    meetings.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    return NextResponse.json({ meetings })
  } catch (error) {
    console.error("Error fetching supervisor's upcoming meetings:", error)
    return NextResponse.json({ error: "Failed to fetch upcoming meetings" }, { status: 500 })
  }
} 