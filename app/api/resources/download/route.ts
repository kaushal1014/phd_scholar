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

    // Ensure the file path is within the public directory
    const fullPath = path.join(process.cwd(), 'public', filePath)
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.error(`File not found: ${fullPath}`)
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
      'Cache-Control': 'no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }

    // For PDFs, add additional headers to allow embedding
    if (mimeType === 'application/pdf') {
      headers['Content-Disposition'] = 'inline'
      headers['X-Content-Type-Options'] = 'nosniff'
      headers['Access-Control-Allow-Origin'] = '*'
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