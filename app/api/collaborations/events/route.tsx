import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import dbConnect from "@/server/db"
import Event from "@/server/models/event"
import User from "@/server/models/userModel"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const events = await Event.find({})
      .populate("organizer", "firstName email")
      .sort({ date: -1, time: -1 })
      .lean()

    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
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

    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      organizer: user._id,
      documentUrl,
      documentType,
    })

    await event.save()
    console.log("in events")
    const populatedEvent = await Event.findById(event._id).populate("organizer", "firstName email").lean()

    return NextResponse.json(populatedEvent, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
