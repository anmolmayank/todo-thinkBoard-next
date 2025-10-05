/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Todo from "@/models/Todo";

/**
 * GET: Fetch a specific todo by ID
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ Required in Next.js 15
  await connectDB();

  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(todo, { status: 200 });
  } catch (error) {
    console.error("GET /api/todos/[id] error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

/**
 * PUT: Update a specific todo by ID
 */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();

  try {
    const data = await req.json();

    const updatedTodo = await Todo.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedTodo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    console.error("PUT /api/todos/[id] error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

/**
 * DELETE: Remove a specific todo by ID
 */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();

  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Todo deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/todos/[id] error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}


