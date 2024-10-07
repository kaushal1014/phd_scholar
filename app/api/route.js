import connectDB from "@/server/db";
import { NextResponse } from "next/server";

export async function GET(req) {

        await connectDB();
        return NextResponse.json({message:"Connected"},{status:200});
}