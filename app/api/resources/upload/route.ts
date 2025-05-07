import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import fs from "fs"

// Map category names to their directory names exactly as shown in the resources page
const categoryToDirMap: { [key: string]: string } = {
  "General Information": "General_Information",
  "Doctoral Committee Meetings": "dcM",
  "Ph.D. Proposal Defense": "PhD_Proposal_Defense",
  "Ph.D. Comprehensive Exam": "Ph.D._Comprehensive_Exam",
  "Ph.D. Synopsis Submission": "Ph.D._Synopsis_Submission",
  "Ph.D. Thesis Format": "Ph.D._Thesis_Format",
  "Course Work Syllabus": "courseWork"
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication and admin status
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as string
    const title = formData.get("title") as string

    if (!file || !category || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate file type (allow both PDF and ZIP)
    if (!file.type.includes("pdf") && !file.type.includes("zip")) {
      return NextResponse.json({ error: "Only PDF and ZIP files are allowed" }, { status: 400 })
    }

    // Get the correct directory name for the category
    const dirName = categoryToDirMap[category]
    if (!dirName) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    // Create a safe filename (similar to existing files)
    const safeTitle = title.replace(/[^a-zA-Z0-9-_]/g, "_")
    const fileExtension = file.type.includes("pdf") ? ".pdf" : ".zip"
    const filename = `${safeTitle}${fileExtension}`

    // Determine the upload directory based on category
    const uploadDir = path.join(process.cwd(), "public", "pdf", "relatedInformation", dirName)
    
    try {
      // Create directory if it doesn't exist
      await mkdir(uploadDir, { recursive: true })
      
      // Write the file
      const fileBuffer = Buffer.from(await file.arrayBuffer())
      await writeFile(path.join(uploadDir, filename), fileBuffer)

      // Verify the file was written successfully
      const filePath = path.join(uploadDir, filename)
      const stats = await fs.promises.stat(filePath)
      
      if (stats.size === 0) {
        throw new Error("File was not written properly")
      }

      return NextResponse.json(
        { 
          success: true,
          filePath: `pdf/relatedInformation/${dirName}/${filename}`,
          fileSize: stats.size
        },
        { 
          status: 200,
          headers: {
            'Cache-Control': 'no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      )
    } catch (error) {
      console.error("Error creating directory or writing file:", error)
      return NextResponse.json({ error: "Failed to create directory or write file" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
} 