import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { promises as fs } from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Read the CSV file
    const csvFilePath = path.join(process.cwd(), 'data', 'scholars.csv')
    console.log('Attempting to read CSV file from:', csvFilePath)
    
    try {
      const fileContent = await fs.readFile(csvFilePath, 'utf-8')
      console.log('Successfully read CSV file')
      
      // Parse CSV data
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
      })
      console.log('Successfully parsed CSV data:', records.length, 'records found')

      // Calculate statistics
      const facultyStats: Record<string, { total: number, FT: number, IPT: number, EPT: number }> = {}
      const modeStats = {
        FT: 0,
        IPT: 0,
        EPT: 0
      }

      records.forEach((record: any) => {
        // Faculty statistics
        let faculty = record.Faculty || 'Unknown'
        if (faculty.startsWith('PhD engg')) {
          faculty = 'PhD engg'
        }
        if (!facultyStats[faculty]) {
          facultyStats[faculty] = {
            total: 0,
            FT: 0,
            IPT: 0,
            EPT: 0
          }
        }
        facultyStats[faculty].total++

        // Mode statistics
        const mode = record.Mode?.toUpperCase() || 'Unknown'
        if (mode === 'FT') {
          facultyStats[faculty].FT++
          modeStats.FT++
        } else if (mode === 'IPT') {
          facultyStats[faculty].IPT++
          modeStats.IPT++
        } else if (mode === 'EPT') {
          facultyStats[faculty].EPT++
          modeStats.EPT++
        }
      })

      return NextResponse.json({
        facultyStats,
        modeStats,
        total: records.length,
        rawRecords: records
      })
    } catch (fileError) {
      console.error('Error reading or parsing CSV file:', fileError)
      return NextResponse.json({ 
        error: 'Failed to read or parse CSV file',
        details: fileError instanceof Error ? fileError.message : 'Unknown error'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error processing statistics:', error)
    return NextResponse.json({ 
      error: 'Failed to process statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 