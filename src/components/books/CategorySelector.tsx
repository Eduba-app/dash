import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Control, Controller, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Category } from "@/types/category";

interface BookFormInputs {
    title: string;
    description: string;
    categoryId: string;
    priceUSD: number;
    freeTrialCardCount?: number;
}

interface CategorySelectorProps {
    control: Control<BookFormInputs>;
    setValue: UseFormSetValue<BookFormInputs>;
    errors: FieldErrors<BookFormInputs>;
    categories: Category[];
}

export function CategorySelector({
    control,
    setValue,
    errors,
    categories,
}: CategorySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-[32px] p-5 border-[1.5px] border-[#EBEFF6] relative">
            <h2 className="text-[#19213D] font-semibold text-[20px] mb-4">
                Category
            </h2>
            <Controller
                control={control}
                name="categoryId"
                render={({ field: { onChange, value } }) => (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full h-12 px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] cursor-pointer flex items-center justify-between"
                        >
                            <span className="truncate">
                                {value
                                    ? categories.find((cat) => cat.id === value)?.name
                                    : "Select a category"}
                            </span>
                            <ChevronDown
                                className={`text-[#9CA3AF] transition-transform duration-200 w-4 h-4 ${isOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {isOpen && (
                            <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-3xl border border-[#EBEFF6] shadow-2xl max-h-60 overflow-auto">
                                {categories.map((cat) => (
                                    <div
                                        key={cat.id}
                                        className={`px-5 py-3 text-sm cursor-pointer transition-colors ${value === cat.id
                                                ? "bg-[#F6F8FC]"
                                                : "hover:bg-[#F6F8FC]"
                                            }`}
                                        onClick={() => {
                                            onChange(cat.id);
                                            setValue("categoryId", cat.id);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {cat.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            />
            {errors.categoryId && (
                <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>
            )}
        </div>
    );
}