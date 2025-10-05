"use client";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, loading, setUser } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    setUser(null);
    router.push("/login");
  };

  if (loading) return null;

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-sm">
      <h1 className="text-xl font-bold">TodoBoard</h1>
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-gray-700">👋 {user.username}</span>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      ) : (
        <Button onClick={() => router.push("/login")}>Login</Button>
      )}
    </nav>
  );
}
