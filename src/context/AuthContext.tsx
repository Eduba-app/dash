"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id:        string;
  name:      string;
  email:     string;
  role:      string;
  avatarUrl?: string | null;
}

interface AuthContextType {
  user:      User | null;
  isLoading: boolean;
  login:     (email: string, password: string) => Promise<void>;
  logout:    () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getUserFromCookie(): User | null {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie.match(/(^|;\s*)user_info=([^;]+)/);
    if (!match) return null;
    return JSON.parse(decodeURIComponent(match[2]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,      setUser]      = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router     = useRouter();
  const initialized = useRef(false); 

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const u = getUserFromCookie();
    setUser(u);
    setIsLoading(false);
  }, []); 

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    setUser(data.user);
    router.push("/dashboard");
  }, [router]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}