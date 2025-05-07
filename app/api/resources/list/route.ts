import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { readdir, stat } from "fs/promises"
import path from "path"

// Map directory names to category names exactly as shown in the resources page
const categoryMap: { [key: string]: string } = {
  "General_Information": "General Information",
  "dcM": "Doctoral Committee Meetings",
  "PhD_Proposal_Defense": "Ph.D. Proposal Defense",
  "Ph.D._Comprehensive_Exam": "Ph.D. Comprehensive Exam",
  "Ph.D._Synopsis_Submission": "Ph.D. Synopsis Submission",
  "Ph.D._Thesis_Format": "Ph.D. Thesis Format",
  "courseWork": "Course Work Syllabus"
}

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const category = searchParams.get("category")

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 })
    }

    // Map the category to the directory name
    const directoryName = Object.entries(categoryMap).find(
      ([_, value]) => value === category
    )?.[0]

    if (!directoryName) {
      console.error(`Invalid category: ${category}`)
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    const directoryPath = path.join(process.cwd(), "public", "pdf", "relatedInformation", directoryName)
    console.log(`Looking for files in: ${directoryPath}`)

    try {
      // Check if directory exists
      const dirStats = await stat(directoryPath)
      if (!dirStats.isDirectory()) {
        console.error(`Path is not a directory: ${directoryPath}`)
        return NextResponse.json({ error: "Invalid directory" }, { status: 400 })
      }

      // Read directory contents
      const files = await readdir(directoryPath)
      console.log(`Found ${files.length} files in directory`)
      
      // Get file stats for each file
      const fileDetails = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(directoryPath, file)
          const fileStats = await stat(filePath)
          return {
            name: file,
            path: `/pdf/relatedInformation/${directoryName}/${file}`,
            size: fileStats.size,
            lastModified: fileStats.mtime,
            isAdmin: token.isAdmin
          }
        })
      )

      // Filter for PDF and ZIP files only
      const validFiles = fileDetails.filter(file => 
        file.name.toLowerCase().endsWith('.pdf') || 
        file.name.toLowerCase().endsWith('.zip')
      )

      console.log(`Returning ${validFiles.length} valid files`)
      return NextResponse.json({ 
        files: validFiles,
        category: category
      }, {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`Directory not found: ${directoryPath}`)
        return NextResponse.json({ files: [], category: category }, { status: 200 })
      }
      console.error("Error reading directory:", error)
      return NextResponse.json({ error: "Failed to read directory" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in list operation:", error)
    return NextResponse.json({ error: "Failed to process list request" }, { status: 500 })
  }
} 