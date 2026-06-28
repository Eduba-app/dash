"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { priceTiersService } from "@/services/price-tiers.services";
import { PriceTier } from "@/types/price-tier";
import { DollarSign } from "lucide-react";

const tierSchema = z.object({
    displayName: z.string().min(1, "Display name is required"),
    productId: z.string().min(1, "Product ID is required"),
    priceUSD: z.number().min(0, "Price must be 0 or more"),
    isActive: z.boolean(),
});
type TierForm = z.infer<typeof tierSchema>;

interface PriceTierDialogProps {
    tier?: PriceTier;
    onClose: () => void;
}

export function PriceTierDialog({ tier, onClose }: PriceTierDialogProps) {
    const queryClient = useQueryClient();
    const isEdit = !!tier;

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<TierForm>({
        resolver: zodResolver(tierSchema),
        defaultValues: {
            displayName: tier?.displayName || "",
            productId: tier?.productId || "",
            priceUSD: tier ? tier.priceCents / 100 : 0,
            isActive: tier?.isActive ?? true,
        },
    });

    const { mutate: saveTier, isPending } = useMutation({
        mutationFn: (data: TierForm) => {
            const payload = {
                displayName: data.displayName,
                productId: data.productId,
                priceCents: Math.round(data.priceUSD * 100),
                isActive: data.isActive,
            };
            if (isEdit) {
                return priceTiersService.update(tier.id, payload);
            }
            return priceTiersService.create(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["price-tiers"] });
            toast.success(
                isEdit
                    ? "Price tier updated successfully"
                    : "Price tier created successfully"
            );
            onClose();
        },
        onError: () =>
            toast.error(
                isEdit ? "Failed to update price tier" : "Failed to create price tier"
            ),
    });

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl">
                <h2 className="text-[#19213D] text-[18px] font-semibold mb-5">
                    {isEdit ? "Edit Price Tier" : "Add Price Tier"}
                </h2>

                <form
                    onSubmit={handleSubmit((d) => saveTier(d))}
                    className="space-y-4"
                >
                    {/* Display Name */}
                    <div>
                        <label className="block text-sm font-medium text-[#19213D] mb-1.5">
                            Display Name
                        </label>
                        <input
                            {...register("displayName")}
                            placeholder='e.g. "Book Tier $10"'
                            className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
                        />
                        {errors.displayName && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.displayName.message}
                            </p>
                        )}
                    </div>

                    {/* Product ID */}
                    <div>
                        <label className="block text-sm font-medium text-[#19213D] mb-1.5">
                            Product ID{" "}
                            <span className="text-[#9CA3AF] font-normal">
                                (App Store / Play Store)
                            </span>
                        </label>
                        <input
                            {...register("productId")}
                            placeholder="e.g. wepioners.eduba.tier.price_2000"
                            className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm font-mono outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
                        />
                        {errors.productId && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.productId.message}
                            </p>
                        )}
                    </div>

                    {/* Price USD */}
                    <div>
                        <label className="block text-sm font-medium text-[#19213D] mb-1.5">
                            Price (USD)
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#FFF0EB] border border-[#F0C4A8] rounded-full flex items-center justify-center">
                                <DollarSign className="w-3.5 h-3.5 text-[#A0522D]" />
                            </div>
                            <input
                                type="number"
                                min={0}
                                step={0.01}
                                {...register("priceUSD", { valueAsNumber: true })}
                                onFocus={(e) => e.target.select()}
                                className="w-full h-12 pl-12 pr-4 rounded-xl border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
                            />
                        </div>
                        {errors.priceUSD && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.priceUSD.message}
                            </p>
                        )}
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between py-1">
                        <label className="text-sm font-medium text-[#19213D]">
                            Active
                        </label>
                        <Controller
                            control={control}
                            name="isActive"
                            render={({ field: { onChange, value } }) => (
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        aria-label="input"
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) => onChange(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#A0522D]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A0522D]" />
                                </label>
                            )}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 cursor-pointer h-11 text-sm font-medium transition-colors rounded-[12px] bg-[#EBEFF6] border border-[#E5E7EB] text-[#9D4A2F] hover:bg-[#F4F4F7]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 cursor-pointer h-11 text-sm transition-colors disabled:opacity-60 rounded-[12px] bg-[#A0522D] text-white font-medium hover:bg-[#8B4513]"
                        >
                            {isPending
                                ? isEdit
                                    ? "Updating..."
                                    : "Creating..."
                                : isEdit
                                    ? "Update"
                                    : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}