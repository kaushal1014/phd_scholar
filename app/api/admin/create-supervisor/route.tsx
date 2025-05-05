import { NextResponse, NextRequest } from 'next/server'
import connectDB from '@/server/db'
import User from '@/server/models/userModel'
import { getToken } from 'next-auth/jwt'
import bcryptjs from 'bcryptjs'

connectDB()

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { firstName, lastName, email, password } = await req.json()

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    // Create new supervisor user
    const newSupervisor = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isSupervisor: true,
      isVerified: true // Automatically verify supervisor accounts
    })

    await newSupervisor.save()

    return NextResponse.json(
      { message: 'Supervisor account created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating supervisor account:', error)
    return NextResponse.json(
      { error: 'Failed to create supervisor account' },
      { status: 500 }
    )
  }
} 