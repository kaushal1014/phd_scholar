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
    const filePath = path.join(uploadDir, fileName)

    // Convert file to buffer and save it
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write the file to the filesystem
    fs.writeFileSync(filePath, buffer)

    // Return the file URL with proper content type
    const fileUrl = `/uploads/${fileName}`
    
    // For images, return both the URL and the file path
    if (type === "image") {
      return NextResponse.json({ 
        fileUrl,
        filePath: fileUrl,
        mimeType: file.type,
        fileName: file.name
      }, {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Content-Type': 'application/json'
        }
      })
    }

    // For other files, return just the URL
    return NextResponse.json({ fileUrl }, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 },
    )
  }
}

// Add a GET handler to serve the files
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const filePath = searchParams.get('path')
    
    if (!filePath) {
      return NextResponse.json({ error: "No file path provided" }, { status: 400 })
    }

    const fullPath = path.join(process.cwd(), "public", filePath)
    
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const fileBuffer = fs.readFileSync(fullPath)
    const fileExtension = path.extname(fullPath).toLowerCase()
    
    let contentType = 'application/octet-stream'
    if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
      contentType = 'image/jpeg'
    } else if (fileExtension === '.png') {
      contentType = 'image/png'
    } else if (fileExtension === '.gif') {
      contentType = 'image/gif'
    } else if (fileExtension === '.pdf') {
      contentType = 'application/pdf'
    } else if (fileExtension === '.pptx') {
      contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    }

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error("Error serving file:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to serve file" },
      { status: 500 },
    )
  }
}