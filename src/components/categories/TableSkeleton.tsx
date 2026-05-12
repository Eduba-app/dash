export function TableSkeleton() {
    return (
        <>
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-4 px-6 py-4 border-b border-[#F4F4F7] last:border-0 animate-pulse"
                >
                    <div className="w-12 h-12 bg-[#F4F4F7] rounded-xl shrink-0" />
                    <div className="h-4 bg-[#F4F4F7] rounded w-32" />
                    <div className="h-4 bg-[#F4F4F7] rounded w-10 ml-auto mr-16" />
                </div>
            ))}
        </>
    );
}