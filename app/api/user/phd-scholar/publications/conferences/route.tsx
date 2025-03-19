import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/server/db'
import PhdScholar from '@/server/models/PhdScholar'

export async function PUT(req: NextRequest) {
  try {
    await connectDB()

    const { phdId, conference } = await req.json()

    if (!phdId || !conference) {
      return NextResponse.json({ error: 'Missing phdId or conference data' }, { status: 400 })
    }

    const phdScholar = await PhdScholar.findById(phdId) // Use findById to query using phdId

    if (!phdScholar) {
      return NextResponse.json({ error: 'PhD Scholar not found' }, { status: 404 })
    }

    phdScholar.publications.conferences.push(conference)
    await phdScholar.save()

    return NextResponse.json(phdScholar, { status: 200 })
  } catch (error) {
    console.error('Error updating conference publication:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: "hi" }, { status: 200 })
}