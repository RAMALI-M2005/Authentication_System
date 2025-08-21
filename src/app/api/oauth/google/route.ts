import { connectUserToAccount } from "@/lib/actions";
import { OAuthClient } from "@/lib/oauth/base";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest
) {
  const code = req.nextUrl.searchParams.get("code");

  const redirectUrl = new URL("/dashboard", req.nextUrl.origin);

  try {
    if (!code) throw new Error("Failed to connect. Please try again.");

    const oAuthUser = await new OAuthClient().fetchUser(code);
     await connectUserToAccount(oAuthUser);

    return NextResponse.redirect(redirectUrl);

  } catch  {
    return NextResponse.redirect(redirectUrl);
  }
}



