import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Todo from "@/models/Todo";

export async function GET(req: Request) {
  const userId = req.headers.get("userid")!;
  await connectDB();
  const todos = await Todo.find({ userId });
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const body = await req.json();
  await connectDB();
  const todo = await Todo.create(body);
  return NextResponse.json(todo);
}
