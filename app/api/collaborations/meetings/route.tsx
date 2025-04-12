import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import dbConnect from "@/server/db"
import Meeting from "@/server/models/meeting"
import User from "@/server/models/userModel"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const meetings = await Meeting.find({}).populate("organizer", "firstName email").sort({ date: 1 }).lean()

    return NextResponse.json(meetings)
  } catch (error) {
    console.error("Error fetching meetings:", error)
    return NextResponse.json({ error: "Failed to fetch meetings" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("IN MEETINGS")
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { title, description, date, time, location, documentUrl, documentType } = await req.json()

    if (!title || !description || !date || !time || !location) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const user = await User.findOne({ email: token.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const meeting = new Meeting({
      title,
      description,
      date,
      time,
      location,
      organizer: user._id,
      documentUrl,
      documentType,
    })

    await meeting.save()

    const populatedMeeting = await Meeting.findById(meeting._id).populate("organizer", "firstName email").lean()

    return NextResponse.json(populatedMeeting, { status: 201 })
  } catch (error) {
    console.error("Error creating meeting:", error)
    return NextResponse.json({ error: "Failed to create meeting" }, { status: 500 })
  }
}
