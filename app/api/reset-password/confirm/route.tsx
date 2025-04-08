import { NextResponse } from "next/server";
import User from "@/server/models/userModel";
import connectDB from "@/server/db";
import bcryptjs from "bcryptjs";

connectDB();

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    // Validate input
    if (!token || !newPassword) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Find the user by token and check if the token is still valid
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Check if token is not expired
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}