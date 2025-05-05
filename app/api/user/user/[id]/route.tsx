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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await connectDB()
    const user = await User.findById(params.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    // Delete linked PhD scholar if exists
    if (user.phdScholar) {
      await PhdScholar.findByIdAndDelete(user.phdScholar)
    }
    await User.findByIdAndDelete(params.id)
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 })
  } catch (error) {
    const errorMessage = (error as Error).message
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}