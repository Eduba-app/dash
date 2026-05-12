export function TableSkeleton() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="grid grid-cols-[1fr_90px] sm:grid-cols-[2fr_1fr_90px] lg:grid-cols-[2fr_1fr_1fr_1fr_90px] items-center px-6 py-4 border-b border-[#F4F4F7] animate-pulse"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-14 bg-[#F4F4F7] rounded-xl shrink-0" />
                        <div className="space-y-2">
                            <div className="h-4 bg-[#F4F4F7] rounded w-32" />
                            <div className="h-3 bg-[#F4F4F7] rounded w-48" />
                        </div>
                    </div>
                    <div className="hidden sm:block h-4 bg-[#F4F4F7] rounded w-16" />
                    <div className="hidden lg:block h-4 bg-[#F4F4F7] rounded w-16" />
                    <div className="hidden lg:block h-4 bg-[#F4F4F7] rounded w-16" />
                    <div className="flex gap-2 justify-end">
                        <div className="w-9 h-9 bg-[#F4F4F7] rounded-xl" />
                        <div className="w-9 h-9 bg-[#F4F4F7] rounded-xl" />
                    </div>
                </div>
            ))}
        </>
    );
}