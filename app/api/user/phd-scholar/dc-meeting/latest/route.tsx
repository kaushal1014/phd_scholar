import { NextResponse, NextRequest } from 'next/server'
import connectDB from '@/server/db'
import PhdScholar from '@/server/models/PhdScholar'
import { getToken } from 'next-auth/jwt'

connectDB()

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { scheduledDate, actualDate, happened } = await req.json()
    console.log('Received data:', { scheduledDate, actualDate, happened })

    const phdScholar = await PhdScholar.findOneAndUpdate(
      { 'phdMilestones.dcMeetings.DCM': { $exists: true, $ne: [] } },
      {
        $set: {
          'phdMilestones.dcMeetings.DCM.$[elem].scheduledDate': scheduledDate,
          'phdMilestones.dcMeetings.DCM.$[elem].actualDate': actualDate,
          'phdMilestones.dcMeetings.DCM.$[elem].happened': happened,
        },
      },
      {
        arrayFilters: [{ 'elem.scheduledDate': { $lte: new Date() } }],
        new: true,
      }
    )

    if (!phdScholar) {
      return NextResponse.json({ success: false, message: 'DC meeting not found' }, { status: 404 })
    }

    console.log('Updated PhdScholar:', phdScholar.phdMilestones.dcMeetings.DCM)
    return NextResponse.json({ success: true, data: phdScholar }, { status: 200 })
  } catch (error) {
    const errorMessage = (error as Error).message
    console.error('Error updating DC meeting:', errorMessage)
    return NextResponse.json({ success: false, message: errorMessage }, { status: 400 })
  }
}