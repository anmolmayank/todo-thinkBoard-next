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
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const fetchTodos = async () => {
    try {
      const res = await axios.get("/api/todos");
      setTodos(res.data);
    } catch {
      toast.error("Failed to load todos");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

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
      setTodos(todos.map(t => (t._id === id ? { ...t, completed: !completed } : t)));
    } catch {
      toast.error("Error updating todo");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
      toast.success("Todo deleted");
    } catch {
      toast.error("Error deleting todo");
    }
  };

  // ✅ Handle Logout
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await axios.post("/api/auth/logout");
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">My Todo Board</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={logoutLoading}
          >
            {logoutLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Todo title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <Input
            placeholder="Description (optional)"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <Button onClick={handleAdd} disabled={loading}>
            {loading ? "Adding..." : "Add Todo"}
          </Button>
        </div>

        <div className="space-y-3">
          {todos.length ? (
            todos.map(todo => (
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
            <p className="text-center text-gray-500">No todos yet — add one!</p>
          )}
        </div>
      </div>
    </div>
  );
}
