import { oAuthSignIn } from '@/lib/actions'
import { NextResponse } from 'next/server' 


export async function POST() {
  try {
    const url = await oAuthSignIn(); 
    return NextResponse.json({success: true, url });
  } catch  {
    return NextResponse.json({success: false, error: 'OAuth sign-in failed' }, { status: 500 });
  }
}
