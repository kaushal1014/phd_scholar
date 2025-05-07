import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import mime from 'mime-types'

export async function GET(request: Request) {
  try {
    const { searchParams, pathname } = new URL(request.url)
    
    // Try to get the file path from query parameter first, then from pathname
    let filePath = searchParams.get('path')
    
    if (!filePath) {
      // If no query parameter, try to get it from the pathname
      // Remove '/api/events/download' from the start if it exists
      filePath = pathname.replace(/^\/api\/events\/download\/?/, '')
      // If still no path, return error
      if (!filePath) {
        return new NextResponse('File path is required', { status: 400 })
      }
    }

    // Clean the file path to prevent directory traversal
    const cleanPath = filePath.split('/').filter(Boolean).join('/')
    
    // Ensure the file path is within your uploads directory
    const fullPath = path.join(process.cwd(), 'public', cleanPath)
    
    // Check if file exists
    try {
      const stats = await fs.promises.stat(fullPath)
      if (!stats.isFile()) {
        console.error(`Not a file: ${fullPath}`)
        return new NextResponse('Not a file', { status: 400 })
      }
    } catch (error) {
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
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Last-Modified': new Date().toUTCString()
    }

    // For PDFs, add additional headers to allow embedding
    if (mimeType === 'application/pdf') {
      headers['Content-Disposition'] = 'inline'
      headers['X-Content-Type-Options'] = 'nosniff'
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
      headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
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