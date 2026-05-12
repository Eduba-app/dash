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
  clearSession: () => void;
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

function clearAuthCookies() {
  if (typeof document === "undefined") return;
  
  const cookies = ["access_token_readable", "user_info"];
  cookies.forEach(name => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
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

  const clearSession = useCallback(() => {
    clearAuthCookies();
    setUser(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearSession();
      window.location.href = "/login";
    }
  }, [clearSession]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}