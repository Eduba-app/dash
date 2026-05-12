import { DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UseFormSetValue } from "react-hook-form";

interface BookFormInputs {
    title: string;
    description: string;
    categoryId: string;
    priceUSD: number;
    freeTrialCardCount?: number;
}

interface PriceInputProps {
    value: number;
    onChange: (value: number) => void;
    setValue: UseFormSetValue<BookFormInputs>;
}

export function PriceInput({ value, onChange, setValue }: PriceInputProps) {
    return (
        <div className="bg-white rounded-[32px] p-5 border-[1.5px] border-[#EBEFF6]">
            <h2 className="text-[#19213D] font-semibold text-[20px] mb-4">Price</h2>
            <label className="block text-sm text-[#19213D] font-semibold mb-1.5">
                Price (USD)
            </label>
            <div className="relative">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#FFF0EB] border border-[#F0C4A8] rounded-full flex items-center justify-center">
                    <DollarSign className="w-3.5 h-3.5 text-[#A0522D]" />
                </div>
                <Input
                    type="number"
                    min={0}
                    step={1}
                    value={value}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                        const v = parseFloat(e.target.value) || 0;
                        onChange(v);
                        setValue("priceUSD", v);
                    }}
                    className="w-full h-10 pl-10 pr-4 rounded-full border border-[#E5E7EB] bg-white text-sm"
                />
            </div>
        </div>
    );
}