import { NextResponse } from "next/server";
import User from "@/server/models/userModel";
import connectDB from "@/server/db";
import crypto from "crypto";
import nodemailer from "nodemailer";

connectDB();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    // Generate a secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    // Save the token and expiry in the database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Send the reset link via email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>If you did not request this, please ignore this email.</p>`,
    });

    return NextResponse.json({ message: "Password reset link sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in reset password route:", error);
    return NextResponse.json({ error: "Failed to process password reset request" }, { status: 500 });
  }
}