import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/server/db';
import User from '@/server/models/userModel';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find();
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching user IDs:', error);
    return NextResponse.json({ error: 'Failed to fetch user IDs' }, { status: 500 });
  }
}