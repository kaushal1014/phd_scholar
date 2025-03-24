import { NextResponse, type NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import connectDB from "@/server/db"
import mongoose from "mongoose"

// Connect to the database
connectDB()

// Get the Certificate model
const Certificate = mongoose.models.Certificate

export async function PUT(req: NextRequest) {
  try {
    // Verify authentication and admin status
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    if (!token.isAdmin) {
      return NextResponse.json({ error: "Only administrators can approve certificates" }, { status: 403 })
    }

    const data = await req.json()
    const { certificateId, action, rejectionReason } = data

    if (!certificateId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    // If rejecting, require a reason
    if (action === "reject" && !rejectionReason) {
      return NextResponse.json({ error: "Rejection reason is required" }, { status: 400 })
    }

    // Update the certificate
    const updateData = {
      approvalStatus: action === "approve" ? "approved" : "rejected",
      approvedBy: token.id,
      approvalDate: new Date(),
      ...(action === "reject" && { rejectionReason }),
    }

    const certificate = await Certificate.findByIdAndUpdate(certificateId, updateData, { new: true })

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        success: true,
        certificate,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error approving certificate:", error)
    return NextResponse.json({ error: "Failed to update certificate" }, { status: 500 })
  }
}

