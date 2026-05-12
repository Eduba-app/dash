import { UseFormSetValue } from "react-hook-form";

interface BookFormInputs {
    title: string;
    description: string;
    categoryId: string;
    priceUSD: number;
    freeTrialCardCount?: number;
}

interface FreeCardsInputProps {
    value: number;
    onChange: (value: number) => void;
    setValue: UseFormSetValue<BookFormInputs>;
}

export function FreeCardsInput({
    value,
    onChange,
    setValue,
}: FreeCardsInputProps) {
    return (
        <div className="bg-white rounded-[32px] p-5 border-[1.5px] border-[#EBEFF6]">
            <h2 className="text-[#19213D] font-semibold text-[20px] mb-4">
                Free Cards
            </h2>
            <input
                type="number"
                min={0}
                value={value}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                    const v = parseInt(e.target.value) || 0;
                    onChange(v);
                    setValue("freeTrialCardCount", v);
                }}
                placeholder="0"
                className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
            />
        </div>
    );
}