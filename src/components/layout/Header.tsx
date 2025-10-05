"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Moon, Sun, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    // Function to apply theme
    const applyTheme = (dark: boolean) => {
      setIsDark(dark);
      if (dark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    };

    // Initial theme
    if (savedTheme === "dark") applyTheme(true);
    else if (savedTheme === "light") applyTheme(false);
    else applyTheme(prefersDark.matches);

    // Listen to OS theme changes if user hasn't manually chosen
    const listener = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) applyTheme(e.matches);
    };

    prefersDark.addEventListener("change", listener);

    setMounted(true);

    return () => prefersDark.removeEventListener("change", listener);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // ✅ Handle Logout
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const showLogout = pathname.startsWith("/dashboard");

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-sm z-50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* App Title */}
        <h1
          onClick={() => router.push("/dashboard")}
          className="text-xl font-semibold cursor-pointer hover:text-primary transition-colors"
        >
          📝 Todo Board
        </h1>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          {/* Logout only on Dashboard */}
          {showLogout && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="ml-2 flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
