import dbConnect from "@/lib/dbConnect";
import { createVerificationCode } from "@/lib/helpers";
import { sendVerificationEmailCode } from "@/lib/mail/sendVerificationCode";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });

    await dbConnect();

    // Find the user once
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    // Check if a code exists and has not expired
    if (user.verification?.code?.hex && Date.now() < user.verification.code.expires) {
      return NextResponse.json({ success: true, message: "Verification code already sent" ,email,desc:'check your email inbox'}, { status: 400 });
    }

    // Create new code
    const code = String(createVerificationCode());
    const expiresAt = Date.now() + 10 * 60 * 1000; // 1 minute

    // Update user with new code
    user.verification = {isVerified:false, code: { hex: code, expires: expiresAt } };
    await user.save();

    await sendVerificationEmailCode({ from: '"SyncFlow" <marouaneramali67@gmail.com>', to:email, subject: "Email Verification Code" }, String(user.name), code);

    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully",
      desc: "Check your email inbox",
    });
  } catch{
    return NextResponse.json({ success: false, error:"send verification code error faced: try again"}, { status: 500 });
  }
}
