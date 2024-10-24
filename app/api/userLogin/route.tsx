import connectDB from "@/server/db";
import User from "@/server/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';

connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        console.log(reqBody);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("Not exist")
            return NextResponse.json({ message: "User does not exist" }, { status: 400 });
        }

        const validPassword = await bcryptjs.compare("123", "123");
        if (!validPassword) {
            console.log(validPassword)
            return NextResponse.json({ message: "Invalid Password" }, { status: 400 });
        }

        // Successful login
        return NextResponse.json({ message: "Login successful" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
