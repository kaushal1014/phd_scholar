import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import mime from 'mime-types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('path')

    if (!filePath) {
      return new NextResponse('File path is required', { status: 400 })
    }

    // Ensure the file path is within your uploads directory
    const fullPath = path.join(process.cwd(), 'public', filePath)
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return new NextResponse('File not found', { status: 404 })
    }

    // Read file
    const fileBuffer = fs.readFileSync(fullPath)
    
    // Get mime type
    const mimeType = mime.lookup(fullPath) || 'application/octet-stream'
    
    // Get filename
    const fileName = path.basename(fullPath)

    // Set appropriate headers based on file type
    const headers: Record<string, string> = {
      'Content-Type': mimeType,
      'Content-Length': fileBuffer.length.toString(),
    }

    // For PDFs, add additional headers to allow embedding
    if (mimeType === 'application/pdf') {
      headers['Content-Disposition'] = 'inline'
      headers['X-Content-Type-Options'] = 'nosniff'
    } else {
      headers['Content-Disposition'] = `attachment; filename="${fileName}"`
    }

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, { headers })
  } catch (error) {
    console.error('Error downloading file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 