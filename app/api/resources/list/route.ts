import { NextRequest, NextResponse } from "next/server"
import { readdir } from "fs/promises"
import path from "path"

// Map directory names to category names
const dirToCategoryMap: { [key: string]: string } = {
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
    const baseDir = path.join(process.cwd(), "public", "pdf", "relatedInformation")
    const files: { path: string; title: string; category: string }[] = []

    // Read each category directory
    for (const [dir, category] of Object.entries(dirToCategoryMap)) {
      try {
        const dirPath = path.join(baseDir, dir)
        const fileNames = await readdir(dirPath)
        
        // Add each file to the list
        for (const fileName of fileNames) {
          if (fileName.endsWith('.pdf') || fileName.endsWith('.zip')) {
            const extension = fileName.endsWith('.pdf') ? '.pdf' : '.zip'
            files.push({
              path: `pdf/relatedInformation/${dir}/${fileName}`,
              title: fileName.replace(extension, '').replace(/_/g, ' '),
              category: category
            })
          }
        }
      } catch (error) {
        console.error(`Error reading directory ${dir}:`, error)
        // Continue with other directories even if one fails
        continue
      }
    }

    return NextResponse.json(files)
  } catch (error) {
    console.error("Error listing files:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
} 