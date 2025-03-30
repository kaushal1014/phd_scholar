import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { getToken } from "next-auth/jwt"
import dbConnect from "@/server/db"
import Discussion from "@/server/models/discussion"
import User from "@/server/models/userModel"

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const discussions = await Discussion.find({})
      .populate("author", "firstName email")
      .populate("replies.author", "firstName email")
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(discussions)
  } catch (error) {
    console.error("Error fetching discussions:", error)
    return NextResponse.json({ error: "Failed to fetch discussions" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    await dbConnect()

    const { title, content, author } = await req.json()
    console.log(author)

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }
    console.log(token.email)
    const user = await User.findOne({ email: token.email })
    console.log(user)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const discussion = new Discussion({
      title,
      content,
      author:user.id ,
      replies: [],
    })

    await discussion.save()

    const populatedDiscussion = await Discussion.findById(discussion._id).populate("author", "firstName email").lean()

    return NextResponse.json(populatedDiscussion, { status: 201 })
  } catch (error) {
    console.error("Error creating discussion:", error)
    return NextResponse.json({ error: "Failed to create discussion" }, { status: 500 })
  }
}

