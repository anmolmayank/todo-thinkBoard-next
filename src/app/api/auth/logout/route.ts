import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out successfully" });

  const cookieStore = cookies();
  (await cookieStore).delete("token"); // Removes old cookie

  return res;
}
