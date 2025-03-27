import { NextResponse, type NextRequest } from "next/server"
import connectDB from "@/server/db"
import User from "@/server/models/userModel"
import { getToken } from "next-auth/jwt"

connectDB()

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await User.findByIdAndUpdate(params.id, { isVerified: true }, { new: true })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, user }, { status: 200 })
  } catch (error) {
    const errorMessage = (error as Error).message
    console.error("Error verifying user:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

