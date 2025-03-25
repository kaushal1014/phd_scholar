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

    // Define milestone fields to check
    const milestoneFields = [
      "comprehensiveExamDate",
      "proposalDefenseDate",
      "openSeminarDate1",
      "preSubmissionSeminarDate",
      "synopsisSubmissionDate",
      "thesisSubmissionDate",
      "thesisDefenseDate",
      "awardOfDegreeDate",
    ]

    // Create a query to find scholars with upcoming milestones
    const query = {
      $or: milestoneFields.map((field) => ({
        [`phdMilestones.${field}`]: { $gte: now },
      })),
    }

    const scholars = await PhdScholar.find(query)
      .select("personalDetails admissionDetails phdMilestones user")
      .populate("user", "firstName lastName email") // Populate user details

    // Extract and format the milestones
    const milestones = []

    for (const scholar of scholars) {
      let closestMilestone = null
      let closestDate = null

      for (const field of milestoneFields) {
        const date = scholar.phdMilestones[field]

        if (date && new Date(date) >= now && (!closestDate || new Date(date) < new Date(closestDate))) {
          closestMilestone = {
            _id: `${scholar._id}-${field}`,
            type: field,
            date: date,
            phdScholar: {
              _id: scholar._id,
              personalDetails: scholar.personalDetails,
              admissionDetails: scholar.admissionDetails,
              user: scholar.user, // Include user details
            },
          }
          closestDate = date
        }
      }

      if (closestMilestone) {
        milestones.push(closestMilestone)
      }
    }

    // Sort by date (closest first)
    milestones.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return NextResponse.json({ milestones })
  } catch (error) {
    console.error("Error fetching upcoming milestones:", error)
    return NextResponse.json({ error: "Failed to fetch upcoming milestones" }, { status: 500 })
  }
}