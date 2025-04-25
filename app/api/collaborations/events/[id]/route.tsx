import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import dbConnect from "@/server/db"
import Event from "@/server/models/event"
import User from "@/server/models/userModel"

// No authentication check for GET
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const event = await Event.findById(params.id)
      .populate("organizer", "firstName email")
      .populate("comments.author", "firstName email")
      .lean()

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const user = await User.findOne({ email: token.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user is admin
    if (!user.isAdmin) {
      return NextResponse.json({ error: "Only admins can update events" }, { status: 403 })
    }

    const { title, description, date, time, location, documentUrl, documentType } = await req.json()

    if (!title || !description || !date || !time || !location) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const event = await Event.findById(params.id)
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Update event fields
    event.title = title
    event.description = description
    event.date = date
    event.time = time
    event.location = location
    event.documentUrl = documentUrl
    event.documentType = documentType

    await event.save()

    const updatedEvent = await Event.findById(params.id)
      .populate("organizer", "firstName email")
      .populate("comments.author", "firstName email")
      .lean()

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const user = await User.findOne({ email: token.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user is admin
    if (!user.isAdmin) {
      return NextResponse.json({ error: "Only admins can delete events" }, { status: 403 })
    }

    const event = await Event.findById(params.id)
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    await Event.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
