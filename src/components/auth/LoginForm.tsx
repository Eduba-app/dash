"use client";

import { useLogin } from "../../hooks/useLogin";
import { LoginHeader } from "./LoginHeader";
import { SessionExpiredAlert } from "./SessionExpiredAlert";
import { ErrorAlert } from "./ErrorAlert";
import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./PasswordInput";
import { SubmitButton } from "./SubmitButton";

export function LoginForm() {
    const {
        form,
        showPassword,
        setShowPassword,
        error,
        isExpired,
        onSubmit,
    } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = form;

    return (
        <div className="min-h-dvh bg-[#F4F4F7] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-sm w-full max-w-md overflow-hidden">
                {/* Header */}
                <LoginHeader />

                {/* Form */}
                <div className="p-6 sm:p-10 pt-5 sm:pt-7">
                    {/* Alerts */}
                    <SessionExpiredAlert isExpired={isExpired} />
                    <ErrorAlert message={error} />

                    {/* Login Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <EmailInput register={register} errors={errors} />

                        <PasswordInput
                            register={register}
                            errors={errors}
                            showPassword={showPassword}
                            onTogglePassword={() => setShowPassword(!showPassword)}
                        />

                        <SubmitButton isSubmitting={isSubmitting} />
                    </form>
                </div>
            </div>
        </div>
    );
}