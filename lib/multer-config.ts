import multer from "multer"
import { join } from "path"
import { mkdir } from "fs/promises"
import { existsSync } from "fs"
import { v4 as uuidv4 } from "uuid"
import type { Request, Response } from "express"

// Configure multer for different file types
export const configureMulter = (fileType: "pdf" | "image") => {
  // Configure storage
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      // Create uploads directory if it doesn't exist
      const uploadDir = join(process.cwd(), "public", "uploads", fileType)

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

  // Configure file filter
  const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (fileType === "pdf" && file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"))
    }

    if (fileType === "image" && !file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"))
    }

    cb(null, true)
  }

  // Configure upload limits
  const limits = {
    fileSize: fileType === "pdf" ? 5 * 1024 * 1024 : 2 * 1024 * 1024, // 5MB for PDFs, 2MB for images
  }

  // Return configured multer instance
  return multer({
    storage,
    fileFilter,
    limits,
  })
}

// Helper function to process multer middleware
export function runMiddleware(req: Request, res: Response, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}
