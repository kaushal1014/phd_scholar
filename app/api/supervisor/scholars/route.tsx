import { NextResponse, NextRequest } from 'next/server'
import connectDB from '@/server/db'
import PhdScholar from '@/server/models/PhdScholar'
import User from '@/server/models/userModel'
import { getToken } from 'next-auth/jwt'

connectDB()

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the supervisor's name from the user record
    const supervisor = await User.findById(token.id)
    if (!supervisor || !supervisor.isSupervisor) {
      return NextResponse.json({ error: 'Not a supervisor' }, { status: 403 })
    }

    const supervisorName = `${supervisor.firstName} ${supervisor.lastName}`

    // Find all scholars where this supervisor is either the main supervisor or co-supervisor
    const scholars = await PhdScholar.find({
      $or: [
        { researchSupervisor: supervisorName },
        { researchCoSupervisor: supervisorName }
      ]
    })

    return NextResponse.json(scholars, { status: 200 })
  } catch (error) {
    console.error('Error fetching supervisor scholars:', error)
    return NextResponse.json({ error: 'Failed to fetch scholars' }, { status: 500 })
  }
} 