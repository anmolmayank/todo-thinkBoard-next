import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { comparePassword, generateToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  await connectDB();
  const user = await User.findOne({ email });
  if (!user || !(await comparePassword(password, user.password)))
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

  const token = generateToken(user._id.toString(), user.email, user.name);
  const response = NextResponse.json({ message: "Login successful" });

  // Store JWT in HTTP-only cookie
  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return response;
}
