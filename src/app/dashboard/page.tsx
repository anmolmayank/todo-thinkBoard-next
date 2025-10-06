"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TodoCard from "@/components/TodoCard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      throw error; // 🔥 Re-throw so verifyAuth can catch it
    }
  };

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // ✅ Verify user token by hitting a protected API
        await fetchTodos();
        setIsAuthorized(true);
      } catch (error) {
        toast.error("Unable to load Todo's");
        console.warn(`User not authenticated, redirecting...${error}`);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  const handleAdd = async () => {
    if (!form.title.trim()) return toast.error("Title required");
    setLoading(true);
    try {
      const res = await axios.post("/api/todos", form);
      setTodos([res.data, ...todos]);
      setForm({ title: "", description: "" });
      toast.success("Todo added!");
    } catch {
      toast.error("Error adding todo");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      await axios.put(`/api/todos/${id}`, { completed: !completed });
      setTodos(
        todos.map((t) => (t._id === id ? { ...t, completed: !completed } : t))
      );
    } catch {
      toast.error("Error updating todo");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
      toast.success("Todo deleted");
    } catch {
      toast.error("Error deleting todo");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Checking authentication...
      </div>
    );
  }

  if (!isAuthorized) return null;

  if (isAuthorized)
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              id="title"
              type="text"
              placeholder="Todo title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              id="description"
              type="text"
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <Button onClick={handleAdd} disabled={loading}>
              {loading ? "Adding..." : "Add Todo"}
            </Button>
          </div>

          <div className="space-y-3">
            {todos.length ? (
              todos.map((todo) => (
                <TodoCard
                  key={todo._id}
                  id={todo._id}
                  title={todo.title}
                  description={todo.description}
                  completed={todo.completed}
                  onToggle={() => handleToggle(todo._id, todo.completed)}
                  onDelete={() => handleDelete(todo._id)}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">
                No todos yet — add one!
              </p>
            )}
          </div>
        </div>
      </div>
    );
}
