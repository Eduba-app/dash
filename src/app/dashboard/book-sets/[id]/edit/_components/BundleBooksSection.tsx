"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { booksService } from "@/services/books.services";
import { bundlesService } from "@/services/bundles.services";
import { Book } from "@/types/book";

interface BundleBooksSectionProps {
    bundleId: string;
    currentBookIds: string[];
}

export function BundleBooksSection({
    bundleId,
    currentBookIds,
}: BundleBooksSectionProps) {
    const queryClient = useQueryClient();
    const [bookIds, setBookIds] = useState<Set<string>>(
        new Set(currentBookIds)
    );
    const [loadingBookId, setLoadingBookId] = useState<string | null>(null);

    // Fetch ALL books (paginated — fetch enough)
    const { data: booksResponse, isLoading } = useQuery({
        queryKey: ["books-for-bundle"],
        queryFn: () => booksService.getAll({ page: 1, limit: 100 }),
    });
    const allBooks: Book[] = booksResponse?.data?.data ?? [];

    // Add book mutation
    const { mutate: addBook } = useMutation({
        mutationFn: (bookId: string) => bundlesService.addBook(bundleId, bookId),
        onSuccess: (_, bookId) => {
            setBookIds((prev) => new Set(prev).add(bookId));
            queryClient.invalidateQueries({ queryKey: ["bundle", bundleId] });
            toast.success("Book added to set");
            setLoadingBookId(null);
        },
        onError: () => {
            toast.error("Failed to add book");
            setLoadingBookId(null);
        },
    });

    // Remove book mutation
    const { mutate: removeBook } = useMutation({
        mutationFn: (bookId: string) =>
            bundlesService.removeBook(bundleId, bookId),
        onSuccess: (_, bookId) => {
            setBookIds((prev) => {
                const next = new Set(prev);
                next.delete(bookId);
                return next;
            });
            queryClient.invalidateQueries({ queryKey: ["bundle", bundleId] });
            toast.success("Book removed from set");
            setLoadingBookId(null);
        },
        onError: () => {
            toast.error("Failed to remove book");
            setLoadingBookId(null);
        },
    });

    const toggleBook = (bookId: string) => {
        setLoadingBookId(bookId);
        if (bookIds.has(bookId)) {
            removeBook(bookId);
        } else {
            addBook(bookId);
        }
    };

    return (
        <div className="bg-white rounded-[32px] p-5 border-[1.5px] border-[#EBEFF6]">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#19213D] font-semibold text-[20px]">Books</h2>
                <span className="text-[#9CA3AF] text-sm">
                    {bookIds.size} selected
                </span>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 p-3 animate-pulse"
                        >
                            <div className="w-5 h-5 bg-[#F4F4F7] rounded" />
                            <div className="w-10 h-12 bg-[#F4F4F7] rounded-lg" />
                            <div className="space-y-1.5 flex-1">
                                <div className="h-4 bg-[#F4F4F7] rounded w-32" />
                                <div className="h-3 bg-[#F4F4F7] rounded w-48" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : allBooks.length === 0 ? (
                <p className="text-[#9CA3AF] text-sm py-6 text-center">
                    No books available. Add some books first.
                </p>
            ) : (
                <>
                    {/* Table Header */}
                    <div className="grid grid-cols-[28px_1fr_100px_80px] gap-3 px-3 py-2 border-b border-[#F4F4F7]">
                        <span />
                        <span className="text-[#6B7280] text-xs">Book name</span>
                        <span className="text-[#6B7280] text-xs hidden sm:block">
                            Category
                        </span>
                        <span className="text-[#6B7280] text-xs hidden sm:block">
                            Decks
                        </span>
                    </div>

                    {/* Books List */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {allBooks.map((book) => {
                            const isSelected = bookIds.has(book.id);
                            const isBookLoading = loadingBookId === book.id;

                            return (
                                <div
                                    key={book.id}
                                    onClick={() => !isBookLoading && toggleBook(book.id)}
                                    className={`grid grid-cols-[28px_1fr_100px_80px] gap-3 items-center px-3 py-3 border-b border-[#F4F4F7] last:border-0 cursor-pointer transition-colors ${isSelected
                                            ? "bg-[#A0522D]/5"
                                            : "hover:bg-[#FAFAFA]"
                                        } ${isBookLoading ? "opacity-50 pointer-events-none" : ""}`}
                                >
                                    {/* Checkbox */}
                                    <div
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected
                                                ? "bg-[#A0522D] border-[#A0522D]"
                                                : "border-[#D1D5DB] bg-white"
                                            }`}
                                    >
                                        {isSelected && (
                                            <svg
                                                className="w-3 h-3 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={3}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Cover + Info */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-12 rounded-lg overflow-hidden bg-[#F4F4F7] shrink-0">
                                            {book.coverImageUrl ? (
                                                <Image
                                                    src={book.coverImageUrl}
                                                    alt={book.title}
                                                    width={40}
                                                    height={48}
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
                                            <p className="text-[#9CA3AF] text-xs truncate">
                                                {book.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <span className="text-[#1C1C2E] text-sm hidden sm:block truncate">
                                        {book.category?.name ?? "—"}
                                    </span>

                                    {/* Decks */}
                                    <span className="text-[#1C1C2E] text-sm hidden sm:block">
                                        {book.deckCount ?? "—"}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}