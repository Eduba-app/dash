export type ImportStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED";

export interface Book {
  id: string;
  title: string;
  description: string;
  coverImageUrl: string | null;  // ← coverImageUrl مش coverUrl
  priceCents: number;
  freeTrialCardCount?: number;
  isActive: boolean;
  importStatus: ImportStatus;
  importError: string | null;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  deckCount?: number;
  createdAt: string;
}

export interface BooksMeta {
  page: number;
  limit: number;
  total: number;
  pagesCount: number;  // ← pagesCount مش totalPages
}

export interface BooksResponse {
  status: string;
  data: {
    data: Book[];
    meta: BooksMeta;
  };
}

export interface CreateBookResponse {
  bookId: string;
  jobId: string;
  importStatus: ImportStatus;
}

export interface CreateBookPayload {
  title: string;
  description: string;
  categoryId: string;
  priceCents: number;
  freeTrialCardCount?: number;
  cover: File;
  apkg: File;
}

export interface GetBooksParams {
  page?: number;
  limit?: number;
  q?: string;
  categoryId?: string;
  importStatus?: ImportStatus;
}