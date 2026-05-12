import { UseFormRegister, FieldErrors } from "react-hook-form";
import { LoginFormData } from "../../hooks/useLogin";

interface EmailInputProps {
    register: UseFormRegister<LoginFormData>;
    errors: FieldErrors<LoginFormData>;
}

export function EmailInput({ register, errors }: EmailInputProps) {
    return (
        <div>
            <label className="block text-sm font-semibold text-[#1c1c2ec4] mb-1.5 uppercase">
                Email address
            </label>
            <input
                {...register("email")}
                type="email"
                placeholder="admin@eduba.com"
                autoComplete="email"
                className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
            />
            {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
            )}
        </div>
    );
}