import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { comparePassword, generateToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  await connectDB();
  const user = await User.findOne({ username });
  if (!user || !(await comparePassword(password, user.password)))
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

  const token = generateToken(user._id.toString());
  return NextResponse.json({ token, username });
}
