import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/server/db";
import PhdScholar from "@/server/models/PhdScholar";
import User from "@/server/models/userModel";
import { getToken } from "next-auth/jwt";

connectDB();

// 🔹 GET: Fetch a PhD Scholar (Now also fetches linked User details)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔄 Populate User Data along with PhD Scholar Data
    const phdScholar = await PhdScholar.findById(params.id).populate("user");
    
    if (!phdScholar) {
      return NextResponse.json({ error: "PhD Scholar not found" }, { status: 404 });
    }

    return NextResponse.json({ data: phdScholar }, { status: 200 });
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Error fetching PhD Scholar:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// 🔹 PUT: Update a PhD Scholar (Now also updates linked User)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedData = await req.json();

    // ✅ Update PhD Scholar
    const phdScholar = await PhdScholar.findByIdAndUpdate(params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!phdScholar) {
      return NextResponse.json({ error: "PhD Scholar not found" }, { status: 404 });
    }

    // ✅ If PhD Scholar has a linked User, update it as well
    if (phdScholar.user) {
      await User.findByIdAndUpdate(phdScholar.user, {
        firstName: updatedData.personalDetails?.firstName,
        lastName: updatedData.personalDetails?.lastName,
      });
    }
    console.log(phdScholar.user)
    return NextResponse.json({ data: phdScholar }, { status: 200 });
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Error updating PhD Scholar:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

