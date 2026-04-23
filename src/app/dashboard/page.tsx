"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import balance from "../../../public/icons/Balance Icon.svg";
import users from "../../../public/icons/Customer Icon.svg";
import timer from "../../../public/icons/timer.svg";
import { booksService } from "@/services/books.services";
import { Book } from "@/types/book";

// ─── Book Row 
function BookRow({ book }: { book: Book }) {
  return (
    <div className="grid grid-cols-[2fr_1fr_auto] items-center px-4 py-3 border-b border-[#F6F8FC] last:border-0 hover:bg-[#FAFAFA] transition-colors">
      {/* Name + cover */}
      <div className="flex items-center gap-3">
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
            <div className="w-full h-full bg-[#EBEFF6] rounded-xl" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[#19213D] text-sm font-medium truncate">{book.title}</p>
          <p className="text-[#5D6481] text-xs truncate max-w-55 mt-0.5">
            {book.description}
          </p>
        </div>
      </div>

      {/* Category */}
      <span className="text-[#19213D] text-sm">{book.category?.name ?? "—"}</span>

      {/* Price */}
      <span className="text-[#19213D] text-sm font-medium">
        ${(book.priceCents / 100).toFixed(0)}
      </span>
    </div>
  );
}

// ─── Skeleton
function BookSkeleton() {
  return (
    <div className="grid grid-cols-[2fr_1fr_auto] items-center px-4 py-3 border-b border-[#F6F8FC] animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-14 bg-[#EBEFF6] rounded-xl shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-[#EBEFF6] rounded-lg w-36" />
          <div className="h-3 bg-[#EBEFF6] rounded-lg w-52" />
        </div>
      </div>
      <div className="h-4 bg-[#EBEFF6] rounded-lg w-16" />
      <div className="h-4 bg-[#EBEFF6] rounded-lg w-10" />
    </div>
  );
}

// ─── Main Page 
export default function DashboardPage() {
  const { data: booksResponse, isLoading } = useQuery({
    queryKey: ["books", 1, ""],
    queryFn: () => booksService.getAll({ page: 1, limit: 7 }),
  });

  const books: Book[] = booksResponse?.data?.data ?? [];

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-[#19213D] text-[32px] font-semibold">Dashboard</h1>

      {/* ── Overview ── */}
      <div className="bg-white rounded-2xl p-6">
        <h2 className="text-[#19213D] text-base font-medium mb-4">Overview</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 bg-[#F6F8FC] rounded-[32px] border-[1.5px] border-[#EBEFF6] p-2">
          {/* Users */}
          <div className="bg-white border-[1.5px] border-[#E5E7EB] rounded-[24px] py-4 px-8">
            <div className="flex items-center gap-2 text-[#5D6481] text-sm font-medium mb-3">
              <Image src={users} width={24} height={24} alt="users icon" />
              <span>Users</span>
            </div>
            <p className="text-[#19213D] text-[60px] font-semibold">1,293</p>
          </div>

          {/* Revenue */}
          <div className="bg-transparent p-4">
            <div className="flex items-center gap-2 text-[#5D6481] text-sm font-medium mb-3">
              <Image src={balance} width={24} height={24} alt="balance icon" />
              <span>Revenue</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-[#19213D] text-[60px] font-medium">265K</p>
              <span className="text-[#5D6481] text-sm">last 30 days</span>
            </div>
          </div>

          {/* Study Time */}
          <div className="bg-transparent p-4">
            <div className="flex items-center gap-2 text-[#5D6481] text-sm font-medium mb-3">
              <Image src={timer} width={24} height={24} alt="timer icon" />
              <span>Study time in hours</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-[#19213D] text-[60px] font-medium">360</p>
              <span className="text-[#5D6481] text-sm">last 30 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Most Studied Books ── */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-[#19213D] text-base font-semibold">
            Most studied books
          </h2>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_auto] px-4 py-3 border-y border-[#F6F8FC]">
          <span className="text-[#5D6481] text-sm">Name</span>
          <span className="text-[#5D6481] text-sm">Category</span>
          <span className="text-[#5D6481] text-sm">Price</span>
        </div>

        {/* Rows */}
        {isLoading ? (
          Array.from({ length: 7 }).map((_, i) => <BookSkeleton key={i} />)
        ) : books.length === 0 ? (
          <div className="py-16 text-center text-[#5D6481] text-sm">
            No books available yet
          </div>
        ) : (
          books.map((book) => <BookRow key={book.id} book={book} />)
        )}
      </div>
    </div>
  );
}