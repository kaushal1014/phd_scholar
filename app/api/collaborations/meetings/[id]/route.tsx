import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import dbConnect from "@/server/db"
import Meeting from "@/server/models/meeting"
import User from "@/server/models/userModel"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const meeting = await Meeting.findById(params.id)
      .populate("organizer", "firstName email")
      .populate("comments.author", "firstName email")
      .lean()
    console.log(meeting)
    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 })
    }

    return NextResponse.json(meeting)
  } catch (error) {
    console.error("Error fetching meeting:", error)
    return NextResponse.json({ error: "Failed to fetch meeting" }, { status: 500 })
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
      return NextResponse.json({ error: "Only admins can update meetings" }, { status: 403 })
    }

    const { title, description, date, time, location, documentUrl, documentType } = await req.json()

    if (!title || !description || !date || !time || !location) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const meeting = await Meeting.findById(params.id)
    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 })
    }

    // Update meeting fields
    meeting.title = title
    meeting.description = description
    meeting.date = date
    meeting.time = time
    meeting.location = location
    meeting.documentUrl = documentUrl
    meeting.documentType = documentType

    await meeting.save()

    const updatedMeeting = await Meeting.findById(params.id)
      .populate("organizer", "firstName email")
      .populate("comments.author", "firstName email")
      .lean()

    return NextResponse.json(updatedMeeting)
  } catch (error) {
    console.error("Error updating meeting:", error)
    return NextResponse.json({ error: "Failed to update meeting" }, { status: 500 })
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
      return NextResponse.json({ error: "Only admins can delete meetings" }, { status: 403 })
    }

    const meeting = await Meeting.findById(params.id)
    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 })
    }

    await Meeting.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Meeting deleted successfully" })
  } catch (error) {
    console.error("Error deleting meeting:", error)
    return NextResponse.json({ error: "Failed to delete meeting" }, { status: 500 })
  }
}

