interface SubmitButtonProps {
    isSubmitting: boolean;
}

export function SubmitButton({ isSubmitting }: SubmitButtonProps) {
    return (
        <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-[#A0522D] hover:bg-[#8B4513] text-white font-semibold rounded-xl transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
            {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                    <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                    Signing in...
                </span>
            ) : (
                "Sign in"
            )}
        </button>
    );
}