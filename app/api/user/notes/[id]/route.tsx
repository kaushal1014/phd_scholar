import { NextResponse, type NextRequest } from "next/server"
import connectDB from "@/server/db"
import User from "@/server/models/userModel"
import { getToken } from "next-auth/jwt"

connectDB()

// Add a notes field to the User model if it doesn't exist
// This would typically be done in the User model file

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await User.findById(params.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ notes: user.notes || "" }, { status: 200 })
  } catch (error) {
    const errorMessage = (error as Error).message
    console.error("Error fetching user notes:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { notes } = await req.json()

    const user = await User.findByIdAndUpdate(params.id, { notes }, { new: true })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, user }, { status: 200 })
  } catch (error) {
    const errorMessage = (error as Error).message
    console.error("Error updating user notes:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

