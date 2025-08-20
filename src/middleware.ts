// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

const privateRoutes = ["/dashboard", "/settings", "/profile"]; 
const publicRoutes = ["/account", "/auth"]; 

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get session id from cookies
  const sessionId = request.cookies.get("sessionId")?.value;

  let user = null;

  if (sessionId) {
    try {
      // 👇 نعمل طلب لـ API route بدل الاتصال المباشر بالـ DB
      const res = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (res.ok) {
        user = await res.json();
      }
    } catch (error) {
      console.error("Middleware auth error:", error);
    }
  }

  // Private routes protection
  if (privateRoutes.some(route => pathname.startsWith(route)) && !user) {
    return NextResponse.redirect(new URL("/account/sign-in", request.url));
  }

  // Public routes protection
  if (publicRoutes.some(route => pathname.startsWith(route)) && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
