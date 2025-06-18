import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/server/db';
import User from '@/server/models/userModel';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find();
    console.log("AllUsers API: Found", users.length, "users in database");
    const mappedUsers = users.map(user => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      isSupervisor: user.isSupervisor,
      phdScholar: user.phdScholar,
    }));
    console.log("AllUsers API: Returning", mappedUsers.length, "mapped users");
    return NextResponse.json(mappedUsers);
  } catch (error) {
    console.error('Error fetching user IDs:', error);
    return NextResponse.json({ error: 'Failed to fetch user IDs' }, { status: 500 });
  }
}