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

    const body = await req.json()
    const { scheduledDate, actualDate, happened, _id } = body
    console.log('Received data:', { scheduledDate, actualDate, happened, _id })

    if (!body || !_id) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const phdScholar = await PhdScholar.findOneAndUpdate(
      { 'phdMilestones.dcMeetings.DCM._id': _id },
      {
        $set: {
          'phdMilestones.dcMeetings.DCM.$.scheduledDate': scheduledDate,
          'phdMilestones.dcMeetings.DCM.$.actualDate': actualDate,
          'phdMilestones.dcMeetings.DCM.$.happened': happened,
        },
      },
      {
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