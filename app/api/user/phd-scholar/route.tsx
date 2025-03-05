import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/server/db';
import PhdScholar from '@/server/models/PhdScholar';
import { getToken } from 'next-auth/jwt';
import User from '@/server/models/userModel';
import { ObjectId } from 'mongodb';

connectDB();

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(token.id);
    if (!user || !user.phdScholar) {
      return NextResponse.json({ error: 'PhD Scholar data not found' }, { status: 404 });
    }

    const phdScholarId = new ObjectId(user.phdScholar);

    const phdScholar = await PhdScholar.findById(phdScholarId.toString());
    if (!phdScholar) {
      return NextResponse.json({ error: 'PhD Scholar data not found' }, { status: 404 });
    }

    return NextResponse.json(phdScholar, { status: 200 });
  } catch (error) {
    console.error('Error fetching PhD Scholar data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}