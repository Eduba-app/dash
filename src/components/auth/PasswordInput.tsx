import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { LoginFormData } from "../../hooks/useLogin";

interface PasswordInputProps {
    register: UseFormRegister<LoginFormData>;
    errors: FieldErrors<LoginFormData>;
    showPassword: boolean;
    onTogglePassword: () => void;
}

export function PasswordInput({
    register,
    errors,
    showPassword,
    onTogglePassword,
}: PasswordInputProps) {
    return (
        <div>
            <label className="block text-sm font-semibold text-[#1c1c2ec4] mb-1.5 uppercase">
                Password
            </label>
            <div className="relative">
                <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full h-12 px-4 pr-12 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
                />
                <button
                    type="button"
                    onClick={onTogglePassword}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
            {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
            )}
        </div>
    );
}