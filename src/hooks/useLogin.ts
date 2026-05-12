import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export function useLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const searchParams = useSearchParams();

  const isExpired = searchParams.get("expired") === "true";

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data.email, data.password);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid email or password"
      );
    }
  };

  return {
    form,
    showPassword,
    setShowPassword,
    error,
    isExpired,
    onSubmit,
  };
}