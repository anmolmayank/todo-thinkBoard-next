import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  await connectDB();
  const existing = await User.findOne({ username });
  if (existing) return NextResponse.json({ message: "User exists" }, { status: 400 });

  const hashed = await hashPassword(password);
  const user = await User.create({ username, password: hashed });
  return NextResponse.json({ message: "User registered", user });
}
