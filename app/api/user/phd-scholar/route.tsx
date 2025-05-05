import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/server/db';
import PhdScholar from '@/server/models/PhdScholar';
import { getToken } from 'next-auth/jwt';
import User from '@/server/models/userModel';

connectDB();

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // If user is admin or supervisor, return all PhD scholars
    const user = await User.findById(token.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let query = {};
    if (!user.isAdmin && !user.isSupervisor) {
      // For regular users, only return their own PhD scholar data
      query = { user: token.id };
    }

    const phdScholars = await PhdScholar.find(query)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ data: phdScholars }, { status: 200 });
  } catch (error) {
    console.error('Error fetching PhD Scholars:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}