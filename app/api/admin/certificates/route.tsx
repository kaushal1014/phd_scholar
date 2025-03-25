import { NextResponse, type NextRequest } from "next/server"
import connectDB from "@/server/db"
import { getToken } from "next-auth/jwt"
import Certificate from "@/server/models/certificate" // Ensure the correct path to the Certificate model

// Connect to the database
connectDB()

export async function GET(req: NextRequest) {
  try {
    // Verify authentication and admin status
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    if (!token.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const phdId = searchParams.get("phdId")

    const query: any = {}
    if(phdId) {
        query.phdScholar = phdId
      }
    // Fetch certificates
    const certificates = await Certificate.find(query)
      .sort({ uploadDate: -1 })
      .populate("phdScholar", "personalDetails.firstName personalDetails.lastName")

    return NextResponse.json({ certificates }, { status: 200 })
  } catch (error) {
    console.error("Error fetching certificates:", error)
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 })
  }
}

