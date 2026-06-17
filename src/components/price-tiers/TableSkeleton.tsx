export function TableSkeleton() {
    return (
        <>
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="grid grid-cols-[1fr_90px] sm:grid-cols-[2fr_1fr_90px] lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_90px] items-center px-6 py-4 border-b border-[#F4F4F7] last:border-0 animate-pulse"
                >
                    <div className="flex flex-col gap-1.5">
                        <div className="h-4 bg-[#F4F4F7] rounded w-36" />
                        <div className="h-3 bg-[#F4F4F7] rounded w-24" />
                    </div>
                    <div className="hidden sm:block h-4 bg-[#F4F4F7] rounded w-16" />
                    <div className="hidden lg:block h-4 bg-[#F4F4F7] rounded w-10" />
                    <div className="hidden lg:block h-4 bg-[#F4F4F7] rounded w-10" />
                    <div className="hidden lg:block h-5 bg-[#F4F4F7] rounded-full w-16" />
                    <div className="flex gap-2 justify-end">
                        <div className="w-9 h-9 bg-[#F4F4F7] rounded-[12px]" />
                        <div className="w-9 h-9 bg-[#F4F4F7] rounded-[12px]" />
                    </div>
                </div>
            ))}
        </>
    );
}
