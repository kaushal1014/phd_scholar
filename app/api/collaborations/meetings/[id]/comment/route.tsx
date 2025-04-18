import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import dbConnect from "@/server/db"
import Meeting from "@/server/models/meeting"
import User from "@/server/models/userModel"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { content } = await req.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const user = await User.findOne({ email: token.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const meeting = await Meeting.findById(params.id)
    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 })
    }

    if (!meeting.comments) {
      meeting.comments = []
    }

    meeting.comments.push({
      content,
      author: user._id,
    })

    await meeting.save()

    const updatedMeeting = await Meeting.findById(params.id)
      .populate("organizer", "firstName email")
      .populate("comments.author", "firstName email")
      .lean()

    return NextResponse.json(updatedMeeting)
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}

