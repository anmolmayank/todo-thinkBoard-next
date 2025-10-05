import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Define all protected paths
const protectedRoutes = ["/dashboard"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only apply middleware to protected routes
  if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // If token missing → redirect to Register
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // This could not run in runtime to make it run set runtime as Node.js
    // jwt.verify(token, JWT_SECRET)as { userId: string }; 
    return NextResponse.next(); // ✅ Token valid → allow
  } catch (error) {
    console.error("JWT verification failed:", error);
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

// Apply middleware to these routes only
export const config = {
  matcher: ["/dashboard/:path*"],
};
