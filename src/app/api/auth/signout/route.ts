import { signOut } from "@/lib/actions";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const res = await signOut();
        return NextResponse.json({...res,success:true}, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { success: false, error: (err as Error)?.message ?? "Sign out failed" },
            { status: 500 }
        );
    }
}