import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/server/db"
import Event from "@/server/models/event"

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
