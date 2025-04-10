import type { NextRequest, NextResponse } from "next/server"
import multer from "multer"
import { join } from "path"
import { mkdir } from "fs/promises"
import { existsSync } from "fs"
import { v4 as uuidv4 } from "uuid"

// Configure multer storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads")

    try {
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }
      cb(null, uploadDir)
    } catch (error) {
      cb(error as Error, uploadDir)
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueId = uuidv4()
    const fileExtension = file.originalname.split(".").pop()
    cb(null, `${uniqueId}.${fileExtension}`)
  },
})

// Configure upload
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})

// Helper function to process multer middleware
export function runMulterMiddleware(req: NextRequest, res: NextResponse, middleware: any) {
  return new Promise((resolve, reject) => {
    middleware(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}
