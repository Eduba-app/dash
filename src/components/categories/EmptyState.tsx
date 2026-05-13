import { Plus } from "lucide-react";

interface EmptyStateProps {
    onAdd: () => void;
}

export function EmptyState({ onAdd }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center flex-1 py-32">
            <h3 className="text-[#1C1C2E] text-2xl font-bold mb-3">
                No Categories Found
            </h3>
            <p className="text-[#6B7280] text-sm text-center max-w-xs mb-8 leading-relaxed">
                It looks like you haven&apos;t added any categories yet. Start by
                creating your first category to organize your books
            </p>
            <button
                onClick={onAdd}
                className="flex items-center cursor-pointer gap-2 px-8 h-12 bg-[#A0522D] text-white text-sm font-semibold rounded-xl hover:bg-[#8B4513] transition-colors"
            >
                <Plus className="w-4 h-4" />
                Add New Category
            </button>
        </div>
    );
}