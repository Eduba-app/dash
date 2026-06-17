"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { priceTiersService } from "@/services/price-tiers.services";
import { PriceTier } from "@/types/price-tier";
import { PriceTierDialog } from "./PriceTierDialog";
import { DeleteTierDialog } from "./DeleteTierDialog";
import { EmptyState } from "./EmptyState";
import { TableSkeleton } from "./TableSkeleton";
import pencil from "../../../public/icons/edit-2.svg";
import trash from "../../../public/icons/trash.svg";

const ITEMS_PER_PAGE = 10;

export function PriceTiersTable() {
    const [page, setPage] = useState(1);
    const [dialogTarget, setDialogTarget] = useState<PriceTier | "new" | null>(
        null
    );
    const [deleteTarget, setDeleteTarget] = useState<PriceTier | null>(null);

    const {
        data: response,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["price-tiers", page],
        queryFn: () =>
            priceTiersService.getAll({ page, limit: ITEMS_PER_PAGE }),
    });

    const tiers: PriceTier[] = response?.data?.data ?? [];
    const totalPages = response?.data?.meta?.pagesCount ?? 1;

    const isEmpty = !isLoading && !isError && tiers.length === 0;

    return (
        <div className="p-4 sm:p-6 flex flex-col min-h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-[#19213D] text-2xl sm:text-[32px] font-semibold">
                    Price Tiers
                </h1>
                <Button
                    onClick={() => setDialogTarget("new")}
                    className="flex items-center gap-2 px-5 h-11 bg-[#A0522D] text-white text-sm font-medium rounded-[12px] hover:bg-[#8B4513] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Price Tier</span>
                </Button>
            </div>

            {/* Content */}
            {isError ? (
                <div className="bg-white rounded-2xl p-12 text-center text-[#6B7280]">
                    Failed to load price tiers. Please try again.
                </div>
            ) : isEmpty ? (
                <EmptyState onAdd={() => setDialogTarget("new")} />
            ) : (
                <>
                    <div className="bg-white rounded-2xl overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-[1fr_90px] sm:grid-cols-[2fr_1fr_90px] lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_90px] px-6 py-4 border-b border-[#F4F4F7]">
                            <span className="text-[#6B7280] text-sm">Name</span>
                            <span className="hidden sm:block text-[#6B7280] text-sm">
                                Price
                            </span>
                            <span className="hidden lg:block text-[#6B7280] text-sm">
                                Books
                            </span>
                            <span className="hidden lg:block text-[#6B7280] text-sm">
                                Bundles
                            </span>
                            <span className="hidden lg:block text-[#6B7280] text-sm">
                                Status
                            </span>
                            <span />
                        </div>

                        {/* Table Body */}
                        {isLoading ? (
                            <TableSkeleton />
                        ) : (
                            tiers.map((tier) => (
                                <div
                                    key={tier.id}
                                    className="grid grid-cols-[1fr_90px] sm:grid-cols-[2fr_1fr_90px] lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_90px] items-center px-6 py-4 border-b border-[#F4F4F7] last:border-0 hover:bg-[#FAFAFA] transition-colors"
                                >
                                    {/* Name + Product ID */}
                                    <div className="min-w-0">
                                        <p className="text-[#1C1C2E] text-sm font-medium truncate">
                                            {tier.displayName}
                                        </p>
                                        <p className="text-[#9CA3AF] text-xs truncate font-mono">
                                            {tier.productId}
                                        </p>
                                    </div>

                                    {/* Price */}
                                    <span className="hidden sm:block text-[#1C1C2E] text-sm font-semibold">
                                        ${(tier.priceCents / 100).toFixed(2)}
                                    </span>

                                    {/* Books count */}
                                    <span className="hidden lg:block text-[#1C1C2E] text-sm">
                                        {tier.bookCount}
                                    </span>

                                    {/* Bundles count */}
                                    <span className="hidden lg:block text-[#1C1C2E] text-sm">
                                        {tier.bundleCount}
                                    </span>

                                    {/* Status */}
                                    <div className="hidden lg:block">
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${tier.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-500"
                                                }`}
                                        >
                                            {tier.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 justify-end">
                                        <Button
                                            onClick={() => setDeleteTarget(tier)}
                                            className="w-9 h-9 rounded-[12px] bg-[#F4F4F7] flex items-center justify-center text-[#A0522D] hover:bg-red-100 hover:text-red-600 transition-colors"
                                            title="Delete tier"
                                        >
                                            <Image src={trash} width={24} height={24} alt="trash" />
                                        </Button>
                                        <button
                                            onClick={() => setDialogTarget(tier)}
                                            title="Edit tier"
                                            className="w-9 h-9 rounded-[12px] bg-[#F4F4F7] flex items-center justify-center text-[#A0522D] hover:bg-[#A0522D]/10 transition-colors"
                                        >
                                            <Image
                                                src={pencil}
                                                width={16}
                                                height={16}
                                                alt="pencil"
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {!isLoading && totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="w-9 h-9 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center text-[#6B7280] hover:bg-[#F4F4F7] disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="w-9 h-9 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center text-[#6B7280] hover:bg-[#F4F4F7] disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                            <span className="text-[#6B7280] text-sm">
                                Page {page} of {totalPages}
                            </span>
                        </div>
                    )}
                </>
            )}

            {/* Create/Edit Dialog */}
            {dialogTarget && (
                <PriceTierDialog
                    tier={dialogTarget === "new" ? undefined : dialogTarget}
                    onClose={() => setDialogTarget(null)}
                />
            )}

            {/* Delete Dialog */}
            {deleteTarget && (
                <DeleteTierDialog
                    tier={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
}