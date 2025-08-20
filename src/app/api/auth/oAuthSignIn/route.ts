import { oAuthSignIn } from '@/lib/actions'
import { NextResponse } from 'next/server' 


export async function POST() {
  try {
    const url = await oAuthSignIn(); // رجع URL بدل redirect
    return NextResponse.json({success: true, url });
  } catch (error) {
    console.error('OAuth sign-in failed', error);
    return NextResponse.json({success: false, error: String(error) }, { status: 500 });
  }
}
