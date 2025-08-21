import { createUserSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
  const { email, code } = await req.json();
  await dbConnect();

  try {
    const user = await User.findOne({ email });
    if (!user)
      return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 400 });

    // check code expiration
    if (Date.now() > user.verification?.code?.expires && user.verification?.code?.expires != 0)
      return new Response(JSON.stringify({ success: false, message: "Code Expired" }), { status: 400 });

    if (code !== user.verification?.code?.hex)
      return new Response(JSON.stringify({ success: false, message: "Code Not Correct" }), { status: 400 });

    // mark verified
    user.verification.isVerified = true;
    user.verification.code.hex = "";
    user.verification.code.expires = 0;
    await user.save();

    await createUserSession(String(user._id), await cookies());

    return new Response(JSON.stringify({ success: true, message: `Your email ${email} is verified` }), { status: 200 });

  } catch {
    return new Response(JSON.stringify({ success: false, message: "Something went wrong with Code verification" }), { status: 500 });
  }
}