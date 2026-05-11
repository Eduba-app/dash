"use client";

import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import logo from "../../../../public/images/logo.svg";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      await login(data.email, data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    }
  };

  return (
    <div className="min-h-dvh bg-[#F4F4F7] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-sm w-full max-w-md overflow-hidden">

        {/* Top: Logo + Title */}
        <div className="p-6 sm:p-10 pb-5 sm:pb-7 border-b border-[#F0EEF0]">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center">
              <Image src={logo} width={62} height={62} alt="logo" />
            </div>
            <div>
              <span className="font-bold text-2xl text-[#1C1C2E] tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>EDUBA</span>
              <p className="text-xs text-[#9CA3AF] uppercase tracking-wider">Admin Portal</p>
            </div>
          </div>

          <h1
            className="text-[#1C1C2E] text-2xl sm:text-3xl font-bold mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Welcome back
          </h1>
          <p className="text-[#6B7280] text-sm">Sign in to your admin account</p>
        </div>

        {/* Bottom: Form */}
        <div className="p-6 sm:p-10 pt-5 sm:pt-7">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#1c1c2ec4] mb-1.5 uppercase">
                Email address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="admin@eduba.com"
                className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1c1c2ec4] mb-1.5 uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#A0522D] hover:bg-[#8B4513] text-white font-semibold rounded-xl transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : "Sign in"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}