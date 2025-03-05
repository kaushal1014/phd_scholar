import { NextResponse, NextRequest } from 'next/server'
import connectDB from '@/server/db'
import PhdScholar from '@/server/models/PhdScholar'
import { getToken } from 'next-auth/jwt'

connectDB()

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const phdScholar = await PhdScholar.findById(params.id)
    if (!phdScholar) {
      return NextResponse.json({ error: 'PhD Scholar not found' }, { status: 404 })
    }

    return NextResponse.json({ data: phdScholar }, { status: 200 })
  } catch (error) {
    const errorMessage = (error as Error).message
    console.error('Error fetching PhD Scholar:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}