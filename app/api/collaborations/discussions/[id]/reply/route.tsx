import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import dbConnect from "@/server/db"
import Discussion from "@/server/models/discussion"
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

    const discussion = await Discussion.findById(params.id)
    if (!discussion) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 })
    }

    discussion.replies.push({
      content,
      author: user._id,
    })

    await discussion.save()

    const updatedDiscussion = await Discussion.findById(params.id)
      .populate("author", "firstName email")
      .populate("replies.author", "firstName email")
      .lean()

    return NextResponse.json(updatedDiscussion)
  } catch (error) {
    console.error("Error adding reply:", error)
    return NextResponse.json({ error: "Failed to add reply" }, { status: 500 })
  }
}

