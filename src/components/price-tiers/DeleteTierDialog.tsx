"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { priceTiersService } from "@/services/price-tiers.services";
import { PriceTier } from "@/types/price-tier";

interface DeleteTierDialogProps {
    tier: PriceTier;
    onClose: () => void;
}

export function DeleteTierDialog({ tier, onClose }: DeleteTierDialogProps) {
    const queryClient = useQueryClient();

    const { mutate: deleteTier, isPending } = useMutation({
        mutationFn: () => priceTiersService.delete(tier.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["price-tiers"] });
            toast.success("Price tier deleted successfully");
            onClose();
        },
        onError: () => toast.error("Failed to delete price tier"),
    });

    const hasUsage = tier.bookCount > 0 || tier.bundleCount > 0;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-xl text-center">
                <div className="w-14 h-14 bg-[#F4F4F7] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-6 h-6 text-[#A0522D]" />
                </div>
                <h2 className="text-[#1C1C2E] text-xl font-bold mb-2">
                    Delete Price Tier
                </h2>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-2">
                    Are you sure you want to delete &quot;{tier.displayName}&quot;?
                </p>
                {hasUsage && (
                    <p className="text-amber-600 text-xs bg-amber-50 rounded-xl px-3 py-2 mb-4">
                        ⚠️ This tier is used by {tier.bookCount} book(s) and{" "}
                        {tier.bundleCount} bundle(s). Deleting it may cause issues.
                    </p>
                )}
                {!hasUsage && <div className="mb-4" />}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="flex-1 h-11 cursor-pointer rounded-xl border border-[#E5E7EB] text-[#6B7280] text-sm font-medium hover:bg-[#F4F4F7] transition-colors disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => deleteTier()}
                        disabled={isPending}
                        className="flex-1 h-11 cursor-pointer rounded-xl bg-[#A0522D] text-white text-sm font-semibold hover:bg-[#8B4513] transition-colors disabled:opacity-60"
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}