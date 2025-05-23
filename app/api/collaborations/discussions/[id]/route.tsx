import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import dbConnect from "@/server/db"
import Discussion from "@/server/models/discussion"
import User from "@/server/models/userModel"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const discussion = await Discussion.findById(params.id)
      .populate("author", "firstName email")
      .populate("replies.author", "firstName email")
      .lean()

    if (!discussion) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 })
    }

    return NextResponse.json(discussion)
  } catch (error) {
    console.error("Error fetching discussion:", error)
    return NextResponse.json({ error: "Failed to fetch discussion" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Check if user is admin
    const user = await User.findOne({ email: token.email })
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const deleted = await Discussion.findByIdAndDelete(params.id)
    if (!deleted) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting discussion:", error)
    return NextResponse.json({ error: "Failed to delete discussion" }, { status: 500 })
  }
}

