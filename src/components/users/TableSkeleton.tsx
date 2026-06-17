export function TableSkeleton() {
    return (
        <>
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="grid grid-cols-[1fr_90px] sm:grid-cols-[2fr_1fr_90px] lg:grid-cols-[2fr_1fr_1fr_1fr_90px] items-center px-6 py-4 border-b border-[#F4F4F7] animate-pulse"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F4F4F7] rounded-full shrink-0" />
                        <div className="space-y-2">
                            <div className="h-4 bg-[#F4F4F7] rounded w-28" />
                            <div className="h-3 bg-[#F4F4F7] rounded w-40" />
                        </div>
                    </div>
                    <div className="hidden sm:block h-4 bg-[#F4F4F7] rounded w-8" />
                    <div className="hidden lg:block h-5 bg-[#F4F4F7] rounded-full w-16" />
                    <div className="hidden lg:block h-4 bg-[#F4F4F7] rounded w-20" />
                    <div className="flex gap-2 justify-end">
                        <div className="w-9 h-9 bg-[#F4F4F7] rounded-xl" />
                        <div className="w-9 h-9 bg-[#F4F4F7] rounded-xl" />
                    </div>
                </div>
            ))}
        </>
    );
}