"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { categoriesService } from "@/services/categories.services";
import { Category } from "@/types/category";
import { useCategoryBookCount } from "../../hooks/useCategoryBookCount";
import { CategoryDialog } from "./CategoryDialog";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { EmptyState } from "./EmptyState";
import { TableSkeleton } from "./TableSkeleton";
import pencil from "../../../public/icons/edit-2.svg";
import trash from "../../../public/icons/trash.svg";
import frame from "../../../public/images/Frame 16.png";

export function CategoriesTable() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [editTarget, setEditTarget] = useState<Category | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

    // Fetch categories
    const {
        data: result = {
            data: [],
            meta: { page: 1, limit: 100, total: 0, pagesCount: 1 },
        },
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["categories", page, search],
        queryFn: () => categoriesService.getAll({ page, limit: 10, q: search }),
    });

    // Get book counts
    const { bookCountByCategory } = useCategoryBookCount();

    const categoriesList = result.data;
    const meta = result.meta;
    const totalPages = meta.pagesCount || 1;
    const isEmpty = !isLoading && !isError && categoriesList.length === 0;

    return (
        <div className="p-4 sm:p-6 flex flex-col min-h-full">
            {/* Header */}
            <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:gap-4">
                {/* Title + mobile add button */}
                <div className="flex items-center justify-between sm:contents">
                    <h1 className="text-[#19213D] text-2xl sm:text-[32px] font-semibold">
                        Categories
                    </h1>
                    {!isEmpty && !isLoading && (
                        <Button
                            onClick={() => setShowDialog(true)}
                            className="sm:hidden w-10 h-10 cursor-pointer bg-[#A0522D] text-white rounded-[12px] hover:bg-[#8B4513] transition-colors flex items-center justify-center p-0"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Search */}
                <div className="relative flex-1 sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input
                        type="text"
                        placeholder="Search categories"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full h-10 pl-9 pr-4 rounded-full border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
                    />
                </div>

                {/* Desktop add button */}
                {!isEmpty && !isLoading && (
                    <Button
                        onClick={() => setShowDialog(true)}
                        className="hidden sm:flex ml-auto cursor-pointer items-center gap-2 px-5 h-11 bg-[#A0522D] text-white text-sm font-medium rounded-[12px] hover:bg-[#8B4513] transition-colors shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Category
                    </Button>
                )}
            </div>

            {/* Content */}
            {isError ? (
                <div className="bg-white rounded-2xl p-12 text-center text-[#6B7280]">
                    Failed to load categories. Please try again.
                </div>
            ) : isEmpty ? (
                <EmptyState onAdd={() => setShowDialog(true)} />
            ) : (
                <>
                    <div className="bg-white rounded-2xl overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-[1fr_60px_90px] sm:grid-cols-[1fr_150px_90px] px-6 py-4 border-b border-[#F4F4F7]">
                            <span className="text-[#6B7280] text-sm">Category</span>
                            <span className="text-[#6B7280] text-sm">
                                <span className="sm:hidden">Books</span>
                                <span className="hidden sm:inline">Book count</span>
                            </span>
                            <span />
                        </div>

                        {/* Table Body */}
                        {isLoading ? (
                            <TableSkeleton />
                        ) : (
                            categoriesList.map((cat: Category) => (
                                <div
                                    key={cat.id}
                                    className="grid grid-cols-[1fr_60px_90px] sm:grid-cols-[1fr_150px_90px] items-center px-6 py-4 border-b border-[#F4F4F7] last:border-0 hover:bg-[#FAFAFA] transition-colors"
                                >
                                    {/* Name + image */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                                            {cat.imageUrl && cat.imageUrl !== "test" ? (
                                                <Image
                                                    src={cat.imageUrl}
                                                    alt={cat.name}
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Image
                                                    src={frame}
                                                    width={48}
                                                    height={48}
                                                    alt="category"
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[#1C1C2E] text-sm font-medium capitalize truncate">
                                                {cat.name}
                                            </p>
                                            <p className="text-[#9CA3AF] text-xs truncate">
                                                {cat.slug}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Book count */}
                                    <span className="text-[#1C1C2E] text-sm">
                                        {bookCountByCategory[cat.id] || 0}
                                    </span>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 justify-end">
                                        <Button
                                            onClick={() => setDeleteTarget(cat)}
                                            className="w-9 h-9 cursor-pointer rounded-[12px] bg-[#F4F4F7] flex items-center justify-center text-[#A0522D] hover:bg-red-100 hover:text-red-600 transition-colors"
                                            title="Delete category"
                                        >
                                            <Image src={trash} width={24} height={24} alt="trash" />
                                        </Button>
                                        <Button
                                            onClick={() => setEditTarget(cat)}
                                            title="Edit category"
                                            className="w-9 h-9 cursor-pointer rounded-[12px] bg-[#F4F4F7] flex items-center justify-center text-[#A0522D] hover:bg-[#A0522D]/10 transition-colors"
                                        >
                                            <Image
                                                src={pencil}
                                                width={16}
                                                height={16}
                                                alt="pencil"
                                            />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {!isLoading && totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="w-9 h-9 cursor-pointer rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center text-[#6B7280] hover:bg-[#F4F4F7] disabled:opacity-40"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="w-9 h-9 rounded-xl cursor-pointer border border-[#E5E7EB] bg-white flex items-center justify-center text-[#6B7280] hover:bg-[#F4F4F7] disabled:opacity-40"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                            <span className="text-[#6B7280] text-sm">
                                Page {page} of {totalPages} • {meta.total} categories
                            </span>
                        </div>
                    )}
                </>
            )}

            {/* Dialogs */}
            {(showDialog || editTarget) && (
                <CategoryDialog
                    category={editTarget || undefined}
                    onClose={() => {
                        setShowDialog(false);
                        setEditTarget(null);
                    }}
                />
            )}

            {deleteTarget && (
                <DeleteCategoryDialog
                    category={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
}