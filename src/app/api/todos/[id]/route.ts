/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Todo from "@/models/Todo";

export async function PUT(req: Request, { params }: any) {
  const { id } = params;
  const data = await req.json();
  await connectDB();
  const updated = await Todo.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: any) {
  await connectDB();
  await Todo.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Deleted" });
}
