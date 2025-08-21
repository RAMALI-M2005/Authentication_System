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
      return new Response(
        JSON.stringify({ success: false, message: "user not found" }),
        { status: 400 }
      );

    if (Date.now() > user.verification.code.expires) {
     return new Response(
        JSON.stringify({ success: false, message: "Code Expired" }),
        { status: 400 }
      );
    }

    const isCodeVerified = (code === user.verification.code.hex);

    if(!isCodeVerified)   return new Response(
        JSON.stringify({ success: false, message: "Code Not Correct" }),
        { status: 400 }
    );

    const id = String(user._id);

    await createUserSession(id,await cookies());

     return new Response(
        JSON.stringify({ success: true, message:  `your email ${email} is verified`}),
        { status: 200 }
    );

  } catch {
      return new Response(
        JSON.stringify({ success: false, message: "something went wrong with Code verification" }),
        { status: 500 }
      );
  }
}
