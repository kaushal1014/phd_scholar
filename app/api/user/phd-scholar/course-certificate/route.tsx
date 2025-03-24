import { NextResponse, type NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import connectDB from "@/server/db"
import PhdScholar from "@/server/models/PhdScholar"
import mongoose from "mongoose"
import multer from "multer"
import { join } from "path"
import { mkdir, writeFile } from "fs/promises"
import { existsSync } from "fs"

// Connect to the database
connectDB()

// Define the certificate schema
const certificateSchema = new mongoose.Schema({
  phdScholar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PhdScholar",
    required: true,
  },
  courseNumber: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  approvalDate: {
    type: Date,
    default: null,
  },
  rejectionReason: {
    type: String,
    default: "",
  },
})

// Create or get the model
const Certificate = mongoose.models.Certificate || mongoose.model("Certificate", certificateSchema)
export default Certificate

// Configure multer for file storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only PDF files
    if (file.mimetype === "application/pdf") {
      cb(null, true)
    } else {
      cb(new Error("Only PDF files are allowed") as any, false)
    }
  },
})

// Helper function to run multer middleware
function runMiddleware(req: NextRequest, middleware: any) {
  return new Promise((resolve, reject) => {
    // @ts-ignore - NextRequest is not exactly the same as Express Request
    middleware(req, { json: () => {} } as any, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Process the file upload with multer
    try {
      // @ts-ignore - NextRequest is not exactly the same as Express Request
      await runMiddleware(req, upload.single("file"))
    } catch (error) {
      console.error("Multer error:", error)
      return NextResponse.json({ error: "File upload failed" }, { status: 400 })
    }

    // Get form data
    const formData = await req.formData()
    const phdId = formData.get("phdId") as string
    const courseNumber = formData.get("courseNumber") as string
    const file = formData.get("file") as File

    if (!file || !phdId || !courseNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify the PhD scholar exists
    const phdScholar = await PhdScholar.findById(phdId)
    if (!phdScholar) {
      return NextResponse.json({ error: "PhD Scholar not found" }, { status: 404 })
    }

    // Create directory structure if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads", "certificates", phdId, courseNumber)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate a unique filename
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/\s+/g, "-")}`
    const filePath = join(uploadDir, fileName)

    // Save the file to disk
    const fileBuffer = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(fileBuffer))

    // Create the file URL (relative to the public directory)
    const fileUrl = `/uploads/certificates/${phdId}/${courseNumber}/${fileName}`

    // Create a new certificate record
    const certificate = new Certificate({
      phdScholar: phdId,
      courseNumber,
      fileName: file.name,
      fileUrl,
      approvalStatus: "pending",
      approvedBy: null,
      approvalDate: null,
      rejectionReason: "",
    })

    await certificate.save()

    return NextResponse.json(
      {
        success: true,
        certificate: {
          _id: certificate._id,
          fileName: certificate.fileName,
          fileUrl: certificate.fileUrl,
          uploadDate: certificate.uploadDate,
          approvalStatus: certificate.approvalStatus,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error uploading certificate:", error)
    return NextResponse.json({ error: "Failed to upload certificate" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const phdId = searchParams.get("phdId") as string
    const courseNumber = searchParams.get("courseNumber")

    if (!phdId || !courseNumber) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Fetch certificates
    const certificates = await Certificate.find({
      phdScholar: phdId,
      courseNumber,
    }).sort({ uploadDate: -1 })

    return NextResponse.json({ certificates }, { status: 200 })
  } catch (error) {
    console.error("Error fetching certificates:", error)
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 })
  }
}

