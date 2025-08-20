import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";

export async function POST(req: Request) {
  const { sessionId } = await req.json();

  if (!sessionId) {
    return NextResponse.json(null, { status: 401 });
  }

  await dbConnect();

  const user = await User.findOne({ sessionId }).populate("sessionId");

  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  return NextResponse.json(user);
}
