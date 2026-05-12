import { useQuery } from "@tanstack/react-query";
import { booksService } from "@/services/books.services";
import { Book } from "@/types/book";
import { useMemo } from "react";

export function useCategoryBookCount() {
    // Fetch all books (with pagination support)
    const { data: booksData, isLoading } = useQuery({
        queryKey: ["books-for-count"],
        queryFn: async () => {
            // Fetch first page to get total count
            const firstPage = await booksService.getAll({ page: 1, limit: 100 });
            const totalPages = firstPage.data.meta.pagesCount;

            // If only one page, return it
            if (totalPages <= 1) {
                return firstPage.data.data;
            }

            // Otherwise, fetch remaining pages in parallel
            const remainingPages = Array.from(
                { length: totalPages - 1 },
                (_, i) => i + 2 // pages 2, 3, 4, ...
            );

            const otherPagesPromises = remainingPages.map((page) =>
                booksService.getAll({ page, limit: 100 })
            );

            const otherPagesResults = await Promise.all(otherPagesPromises);
            const allBooks = [
                ...firstPage.data.data,
                ...otherPagesResults.flatMap((res) => res.data.data),
            ];

            return allBooks;
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    // Calculate book count per category
    const bookCountByCategory = useMemo(() => {
        const books = booksData ?? [];
        const counts: Record<string, number> = {};
        books.forEach((book: Book) => {
            if (book.categoryId) {
                counts[book.categoryId] = (counts[book.categoryId] || 0) + 1;
            }
        });
        return counts;
    }, [booksData]);

    return { bookCountByCategory, isLoadingCounts: isLoading };
}