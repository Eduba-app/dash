"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { usersService } from "@/services/users.services";
import { User } from "@/types/user";

interface DeactivateUserDialogProps {
    user: User;
    onClose: () => void;
}

export function DeactivateUserDialog({
    user,
    onClose,
}: DeactivateUserDialogProps) {
    const queryClient = useQueryClient();

    const { mutate: deactivateUser, isPending } = useMutation({
        mutationFn: () => usersService.deactivate(user.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("User deactivated successfully");
            onClose();
        },
        onError: () => toast.error("Failed to deactivate user"),
    });

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-xl text-center">
                <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldOff className="w-6 h-6 text-[#9D4A2F]" />
                </div>
                <h2 className="text-[#1C1C2E] text-xl font-bold mb-2">
                    Deactivate User
                </h2>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-2">
                    Are you sure you want to deactivate{" "}
                    <span className="font-semibold text-[#1C1C2E]">{user.name}</span>?
                </p>
                <p className="text-[#9CA3AF] text-xs mb-6">
                    The user will not be able to log in. This can be done even if they
                    have active subscriptions.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="flex-1 h-11 rounded-xl border border-[#E5E7EB] text-[#6B7280] text-sm font-medium hover:bg-[#F4F4F7] transition-colors disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => deactivateUser()}
                        disabled={isPending}
                        className="flex-1 h-11 rounded-xl bg-[#9D4A2F] text-white text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-60"
                    >
                        {isPending ? "Deactivating..." : "Deactivate"}
                    </button>
                </div>
            </div>
        </div>
    );
}