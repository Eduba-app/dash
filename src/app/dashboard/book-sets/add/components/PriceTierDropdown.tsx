"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Plus } from "lucide-react";
import { PriceTier } from "@/types/price-tier";
import { PriceTierDialog } from "@/components/price-tiers/PriceTierDialog";

interface PriceTierDropdownProps {
    value: string;
    onChange: (id: string) => void;
    priceTiers: PriceTier[];
    placeholder?: string;
}

export function PriceTierDropdown({
    value,
    onChange,
    priceTiers,
    placeholder = "Select a price tier",
}: PriceTierDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const queryClient = useQueryClient();

    const selected = priceTiers.find((t) => t.id === value);

    const handleCreate = () => {
        setIsOpen(false);
        setShowCreateDialog(true);
    };

    const handleCreateClose = () => {
        setShowCreateDialog(false);
        // Refetch price tiers after creating
        queryClient.invalidateQueries({ queryKey: ["price-tiers"] });
    };

    return (
        <>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full h-12 px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] cursor-pointer flex items-center justify-between"
                >
                    <span className={`truncate ${!selected ? "text-[#9CA3AF]" : ""}`}>
                        {selected
                            ? `${selected.displayName} ($${(selected.priceCents / 100).toFixed(0)})`
                            : placeholder}
                    </span>
                    <ChevronDown
                        className={`text-[#9CA3AF] transition-transform duration-200 w-4 h-4 ${isOpen ? "rotate-180" : ""
                            }`}
                    />
                </button>

                {isOpen && (
                    <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-3xl border border-[#EBEFF6] shadow-2xl max-h-60 overflow-auto">
                        {/* Existing tiers */}
                        {priceTiers.map((tier) => (
                            <div
                                key={tier.id}
                                className={`px-5 py-3 text-sm cursor-pointer transition-colors ${value === tier.id ? "bg-[#F6F8FC]" : "hover:bg-[#F6F8FC]"
                                    }`}
                                onClick={() => {
                                    onChange(tier.id);
                                    setIsOpen(false);
                                }}
                            >
                                <span className="font-medium">{tier.displayName}</span>
                                <span className="text-[#9CA3AF] ml-2">
                                    (${(tier.priceCents / 100).toFixed(0)})
                                </span>
                            </div>
                        ))}

                        {priceTiers.length === 0 && (
                            <div className="px-5 py-3 text-sm text-[#9CA3AF]">
                                No price tiers available
                            </div>
                        )}

                        {/* Divider + Create new */}
                        <div className="border-t border-[#EBEFF6]">
                            <div
                                onClick={handleCreate}
                                className="px-5 py-3 text-sm cursor-pointer hover:bg-[#FFF9F5] transition-colors flex items-center gap-2 text-[#A0522D] font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Create new price tier
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Inline Create Dialog */}
            {showCreateDialog && (
                <PriceTierDialog onClose={handleCreateClose} />
            )}
        </>
    );
}