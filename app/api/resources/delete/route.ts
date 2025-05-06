import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { unlink } from "fs/promises"
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
      // Delete the file
      await unlink(fullPath)
      return NextResponse.json({ success: true }, { status: 200 })
    } catch (error: any) {
      // If file doesn't exist, return success (idempotent delete)
      if (error.code === 'ENOENT') {
        return NextResponse.json({ success: true }, { status: 200 })
      }
      throw error
    }
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
} 