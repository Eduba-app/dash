import { UseFormRegister, FieldErrors } from "react-hook-form";

interface BookDetailsInputs {
    title: string;
    description: string;
    categoryId: string;
    priceUSD: number;
    freeTrialCardCount?: number;
}

interface BookDetailsSectionProps {
    register: UseFormRegister<BookDetailsInputs>;
    errors: FieldErrors<BookDetailsInputs>;
}

export function BookDetailsSection({
    register,
    errors,
}: BookDetailsSectionProps) {
    return (
        <div className="bg-white rounded-[32px] p-5 space-y-5 border-[1.5px] border-[#EBEFF6]">
            <h2 className="text-[#19213D] font-semibold text-[24px]">Book details</h2>

            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-[#19213D] mb-2.5">
                    Book Title
                </label>
                <input
                    {...register("title")}
                    placeholder="Label"
                    className="w-full h-12 px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
                />
                {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                )}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-[#19213D] mb-2.5">
                    Description
                </label>
                <textarea
                    {...register("description")}
                    rows={7}
                    placeholder="Book description..."
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all resize-none"
                />
                {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.description.message}
                    </p>
                )}
            </div>
        </div>
    );
}