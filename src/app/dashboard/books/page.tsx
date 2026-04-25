"use client";

import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounce";
import { booksService } from "@/services/books.services";
import { Book, ImportStatus } from "@/types/book";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import pencil from "../../../../public/icons/edit-2.svg";
import trash from "../../../../public/icons/trash.svg";

const ITEMS_PER_PAGE = 10;

// ─── Import Status Badge
function ImportBadge({ status }: { status: ImportStatus }) {
  const styles: Record<ImportStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100   text-blue-700",
    READY: "bg-green-100  text-green-700",
    FAILED: "bg-red-100    text-red-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

// ─── Delete Dialog
function DeleteDialog({ book, onClose }: { book: Book; onClose: () => void }) {
  const queryClient = useQueryClient();

  const { mutate: deleteBook, isPending } = useMutation({
    mutationFn: () => booksService.delete(book.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book deleted successfully");
      onClose();
    },
    onError: () => toast.error("Failed to delete book"),
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-xl text-center">
        <div className="w-14 h-14 bg-[#F4F4F7] rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-[#A0522D]" />
        </div>
        <h2 className="text-[#1C1C2E] text-xl font-bold mb-2">Delete this Book</h2>
        <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
          Are you sure you want to delete this book? the book assigned to it
          will become &quot;Uncategorized.&quot; This action cannot be undone
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-[#E5E7EB] text-[#6B7280] text-sm font-medium hover:bg-[#F4F4F7] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteBook()}
            disabled={isPending}
            className="flex-1 h-11 rounded-xl bg-[#A0522D] text-white text-sm font-semibold hover:bg-[#8B4513] transition-colors disabled:opacity-60"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-32">
      <h3 className="text-[#1C1C2E] text-2xl font-bold mb-3">No Books Added Yet</h3>
      <p className="text-[#6B7280] text-sm text-center max-w-sm mb-8 leading-relaxed">
        Start building your library by adding your first book. You can upload
        PDFs, set prices, and create flashcards.
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-8 h-12 bg-[#A0522D] text-white text-sm font-semibold rounded-xl hover:bg-[#8B4513] transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add New Book
      </button>
    </div>
  );
}

// ─── Search Not Found
function SearchNotFound({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-24 h-24 bg-[#FFF0EB] rounded-full flex items-center justify-center">
        <Search className="w-10 h-10 text-[#A0522D]/40" />
      </div>
      <p className="text-[#6B7280] text-sm">
        We couldn&apos;t find results for &quot;{query}&quot;
      </p>
    </div>
  );
}

// ─── Skeleton
function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="grid grid-cols-[1fr_90px] sm:grid-cols-[2fr_1fr_90px] lg:grid-cols-[2fr_1fr_1fr_1fr_90px] items-center px-6 py-4 border-b border-[#F4F4F7] animate-pulse">
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

// ─── Main Page
export default function BooksPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);
  const search = useDebounce(searchInput, 400);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["books", page, search],
    queryFn: () => booksService.getAll({ page, limit: ITEMS_PER_PAGE, q: search || undefined }),
  });

  const books: Book[] = response?.data?.data ?? [];
  const totalPages = response?.data?.meta?.pagesCount ?? 1;

  const isEmpty = !isLoading && !isError && books.length === 0 && !search;
  const noResults = !isLoading && books.length === 0 && !!search;

  return (
    <div className="p-4 sm:p-6 flex flex-col min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:gap-4">
        {/* Title + mobile add button */}
        <div className="flex items-center justify-between sm:contents">
          <h1 className="text-[#19213D] text-2xl sm:text-[32px] font-semibold">Books</h1>
          <Button
            onClick={() => router.push("/dashboard/books/add")}
            className="sm:hidden w-10 h-10 bg-[#A0522D] text-white rounded-[12px] hover:bg-[#8B4513] transition-colors flex items-center justify-center p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
            placeholder="Search a Book"
            className="w-full h-10 pl-9 pr-4 rounded-full border border-[#E5E7EB] bg-white text-[#1C1C2E] text-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/10 transition-all"
          />
        </div>

        {/* Desktop add button */}
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
              <span className="hidden sm:block text-[#6B7280] text-sm">Category</span>
              <span className="hidden lg:block text-[#6B7280] text-sm">Price</span>
              <span className="hidden lg:block text-[#6B7280] text-sm">Decks</span>
              <span />
            </div>

            {/* Rows */}
            {isLoading ? <SkeletonRows /> : (
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
                      <p className="text-[#1C1C2E] text-sm font-medium truncate">{book.title}</p>
                      <p className="text-[#9CA3AF] text-xs truncate max-w-50">{book.description}</p>
                      <div className="mt-1">
                        <ImportBadge status={book.importStatus} />
                      </div>
                    </div>
                  </div>

                  {/* Category — hidden on mobile */}
                  <span className="hidden sm:block text-[#1C1C2E] text-sm">{book.category?.name ?? "—"}</span>
                  {/* Price — hidden below lg */}
                  <span className="hidden lg:block text-[#1C1C2E] text-sm">${(book.priceCents / 100).toFixed(0)}</span>
                  {/* Decks — hidden below lg */}
                  <span className="hidden lg:block text-[#1C1C2E] text-sm">{book.deckCount ?? "—"}</span>

                  {/* Actions */}
                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      onClick={() => setDeleteTarget(book)}
                      className="w-9 h-9 rounded-[12px] bg-[#F4F4F7] flex items-center justify-center text-[#A0522D] hover:bg-[#A0522D]/10 transition-colors"
                    >
                      <Image src={trash} width={24} height={24} alt="trash" />
                    </Button>
                    <button
                      disabled
                      title="Coming soon"
                      className="w-9 h-9 rounded-[12px] bg-[#F4F4F7] flex items-center justify-center text-[#A0522D] opacity-40 cursor-not-allowed"
                    >
                      <Image src={pencil} width={16} height={16} alt="pencil" />
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
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center text-[#6B7280] hover:bg-[#F4F4F7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center text-[#6B7280] hover:bg-[#F4F4F7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <span className="text-[#6B7280] text-sm">Page {page} of {totalPages}</span>
            </div>
          )}
        </>
      )}

      {deleteTarget && (
        <DeleteDialog book={deleteTarget} onClose={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
