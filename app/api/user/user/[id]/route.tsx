import { NextResponse, NextRequest } from 'next/server'
import connectDB from '@/server/db'
import User from '@/server/models/userModel'
import PhdScholar from '@/server/models/PhdScholar'
import { getToken } from 'next-auth/jwt'

console.log('Connecting to database...')
connectDB()
console.log('Database connected')

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('Received request for user ID:', params.id)
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      console.log('Unauthorized request')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Received params:', params)

    const user = await User.findById(params.id)
    console.log('Fetched user:', user)
    if (!user) {
      console.log('User not found')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ data: user }, { status: 200 })
  } catch (error) {
    const errorMessage = (error as Error).message
    console.error('Error fetching user:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}