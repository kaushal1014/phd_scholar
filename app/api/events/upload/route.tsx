import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { getToken } from "next-auth/jwt"
import path from "path"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"

// Since Next.js API routes don't support the traditional Express middleware pattern,
// we need to create a custom implementation for file uploads

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the form data
    const formData = await req.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Validate file type
    if (type === "pdf" && file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }

    if (type === "pptx" && !file.name.endsWith('.pptx')) {
      return NextResponse.json({ error: "Only PPTX files are allowed" }, { status: 400 })
    }

    if (type === "image" && !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    // Validate file size
    const maxSize = type === "image" ? 2 * 1024 * 1024 : 5 * 1024 * 1024 // 5MB for PDFs/PPTX, 2MB for images
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File size exceeds the limit (${maxSize / (1024 * 1024)}MB)`,
        },
        { status: 400 },
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const fileExtension = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    console.log(fileName)
    const filePath = path.join(uploadDir, fileName)

    // Convert file to buffer and save it
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write the file to the filesystem
    fs.writeFileSync(filePath, buffer)

    // Generate the file URL
    const fileUrl = `/uploads/${fileName}`

    return NextResponse.json({ fileUrl })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 },
    )
  }
}
