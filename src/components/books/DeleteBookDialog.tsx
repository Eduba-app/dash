"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { booksService } from "@/services/books.services";
import { Book } from "@/types/book";

interface DeleteBookDialogProps {
    book: Book;
    onClose: () => void;
}

export function DeleteBookDialog({ book, onClose }: DeleteBookDialogProps) {
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
                <h2 className="text-[#1C1C2E] text-xl font-bold mb-2">
                    Delete this Book
                </h2>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
                    Are you sure you want to delete this book? This action cannot be undone
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="flex-1 h-11 rounded-xl border border-[#E5E7EB] text-[#6B7280] text-sm font-medium hover:bg-[#F4F4F7] transition-colors disabled:opacity-60"
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