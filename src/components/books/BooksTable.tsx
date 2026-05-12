"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EditBookDialog } from "@/components/books/EditBookDialog";
import useDebounce from "@/hooks/useDebounce";
import { booksService } from "@/services/books.services";
import { Book } from "@/types/book";
import { DeleteBookDialog } from "./DeleteBookDialog";
import { EmptyState } from "./EmptyState";
import { SearchNotFound } from "./SearchNotFound";
import { TableSkeleton } from "./TableSkeleton";
import { ImportBadge } from "./ImportBadge";
import pencil from "../../../public/icons/edit-2.svg";
import trash from "../../../public/icons/trash.svg";

const ITEMS_PER_PAGE = 10;

export function BooksTable() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);
    const [editTarget, setEditTarget] = useState<Book | null>(null);
    const search = useDebounce(searchInput, 400);

    const {
        data: response,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["books", page, search],
        queryFn: () =>
            booksService.getAll({
                page,
                limit: ITEMS_PER_PAGE,
                q: search || undefined,
            }),
    });

    const books: Book[] = response?.data?.data ?? [];
    const totalPages = response?.data?.meta?.pagesCount ?? 1;

    const isEmpty = !isLoading && !isError && books.length === 0 && !search;
    const noResults = !isLoading && books.length === 0 && !!search;

    return (
        <div className="p-4 sm:p-6 flex flex-col min-h-full">
            {/* Header */}
            <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center justify-between sm:contents">
                    <h1 className="text-[#19213D] text-2xl sm:text-[32px] font-semibold">
                        Books
                    </h1>
                    <Button
                        onClick={() => router.push("/dashboard/books/add")}
                        className="sm:hidden w-10 h-10 bg-[#A0522D] text-white rounded-[12px] hover:bg-[#8B4513] transition-colors flex items-center justify-center p-0"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <div className="relative flex-1 sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input
                        value={searchInput}
                        onChange={(e) => {
                            setSearchInput(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search a Book"
                        className="w-full h-10 pl-9 pr-4 rounded-full border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
                    />
                </div>

                <Button
                    onClick={() => router.push("/dashboard/books/add")}
                    className="hidden sm:flex ml-auto items-center gap-2 px-5 h-11 bg-[#A0522D] text-white text-sm font-medium rounded-[12px] hover:bg-[#8B4513] transition-colors shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Add New Book
                </Button>
            </div>

            {/* Content */}
            {isError ? (
                <div className="bg-white rounded-2xl p-12 text-center text-[#6B7280]">
                    Failed to load books. Please try again.
                </div>
            ) : isEmpty ? (
                <EmptyState onAdd={() => router.push("/dashboard/books/add")} />
            ) : noResults ? (
                <SearchNotFound query={search} />
            ) : (
                <>
                    <div className="bg-white rounded-2xl overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-[1fr_90px] sm:grid-cols-[2fr_1fr_90px] lg:grid-cols-[2fr_1fr_1fr_1fr_90px] px-6 py-4 border-b border-[#F4F4F7]">
                            <span className="text-[#6B7280] text-sm">Name</span>
                            <span className="hidden sm:block text-[#6B7280] text-sm">
                                Category
                            </span>
                            <span className="hidden lg:block text-[#6B7280] text-sm">
                                Price
                            </span>
                            <span className="hidden lg:block text-[#6B7280] text-sm">
                                Decks
                            </span>
                            <span />
                        </div>

                        {/* Table Body */}
                        {isLoading ? (
                            <TableSkeleton />
                        ) : (
                            books.map((book: Book) => (
                                <div
                                    key={book.id}
                                    className="grid grid-cols-[1fr_90px] sm:grid-cols-[2fr_1fr_90px] lg:grid-cols-[2fr_1fr_1fr_1fr_90px] items-center px-6 py-4 border-b border-[#F4F4F7] last:border-0 hover:bg-[#FAFAFA] transition-colors"
                                >
                                    {/* Cover + info */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-12 h-14 rounded-xl overflow-hidden bg-[#F4F4F7] shrink-0">
                                            {book.coverImageUrl ? (
                                                <Image
                                                    src={book.coverImageUrl}
                                                    alt={book.title}
                                                    width={48}
                                                    height={56}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-[#E5E7EB]" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[#1C1C2E] text-sm font-medium truncate">
                                                {book.title}
                                            </p>
                                            <p className="text-[#9CA3AF] text-xs truncate max-w-50">
                                                {book.description}
                                            </p>
                                            <div className="mt-1">
                                                <ImportBadge status={book.importStatus} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <span className="hidden sm:block text-[#1C1C2E] text-sm">
                                        {book.category?.name ?? "—"}
                                    </span>
                                    {/* Price */}
                                    <span className="hidden lg:block text-[#1C1C2E] text-sm">
                                        ${(book.priceCents / 100).toFixed(0)}
                                    </span>
                                    {/* Decks */}
                                    <span className="hidden lg:block text-[#1C1C2E] text-sm">
                                        {book.deckCount ?? "—"}
                                    </span>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 justify-end">
                                        <Button
                                            onClick={() => setDeleteTarget(book)}
                                            className="w-9 h-9 rounded-[12px] bg-[#F4F4F7] flex items-center justify-center text-[#A0522D] hover:bg-red-100 hover:text-red-600 transition-colors"
                                            title="Delete book"
                                        >
                                            <Image src={trash} width={24} height={24} alt="trash" />
                                        </Button>
                                        <button
                                            onClick={() => setEditTarget(book)}
                                            title="Edit book"
                                            className="w-9 h-9 rounded-[12px] bg-[#F4F4F7] flex items-center justify-center text-[#A0522D] hover:bg-[#A0522D]/10 transition-colors"
                                        >
                                            <Image
                                                src={pencil}
                                                width={16}
                                                height={16}
                                                alt="pencil"
                                            />
                                        </button>
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
                                    className="w-9 h-9 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center text-[#6B7280] hover:bg-[#F4F4F7] disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="w-9 h-9 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center text-[#6B7280] hover:bg-[#F4F4F7] disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                            <span className="text-[#6B7280] text-sm">
                                Page {page} of {totalPages}
                            </span>
                        </div>
                    )}
                </>
            )}

            {/* Dialogs */}
            {deleteTarget && (
                <DeleteBookDialog
                    book={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                />
            )}

            {editTarget && (
                <EditBookDialog
                    book={editTarget}
                    onClose={() => setEditTarget(null)}
                />
            )}
        </div>
    );
}