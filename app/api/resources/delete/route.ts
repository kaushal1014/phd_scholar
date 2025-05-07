import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { unlink, stat } from "fs/promises"
import path from "path"

export async function DELETE(req: NextRequest) {
  try {
    // Verify authentication and admin status
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { filePath } = await req.json()

    if (!filePath) {
      return NextResponse.json({ error: "File path is required" }, { status: 400 })
    }

    // Construct the full path to the file
    const fullPath = path.join(process.cwd(), "public", filePath)

    try {
      // Check if file exists and get its stats
      const stats = await stat(fullPath)
      if (!stats.isFile()) {
        return NextResponse.json({ error: "Not a file" }, { status: 400 })
      }

      // Delete the file
      await unlink(fullPath)

      // Verify the file was deleted
      try {
        await stat(fullPath)
        // If we get here, the file still exists
        return NextResponse.json({ error: "File could not be deleted" }, { status: 500 })
      } catch (error) {
        // File was successfully deleted
        return NextResponse.json({ 
          success: true,
          message: "File deleted successfully"
        }, { 
          status: 200,
          headers: {
            'Cache-Control': 'no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        })
      }
    } catch (error: any) {
      // If file doesn't exist, return success (idempotent delete)
      if (error.code === 'ENOENT') {
        return NextResponse.json({ 
          success: true,
          message: "File already deleted"
        }, { status: 200 })
      }
      console.error("Error deleting file:", error)
      return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in delete operation:", error)
    return NextResponse.json({ error: "Failed to process delete request" }, { status: 500 })
  }
} 