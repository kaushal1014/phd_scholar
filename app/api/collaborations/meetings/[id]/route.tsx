import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import dbConnect from "@/server/db"
import Meeting from "@/server/models/meeting"

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

