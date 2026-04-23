import api from "@/lib/api/axios";
import {
  Book,
  BooksResponse,
  CreateBookPayload,
  CreateBookResponse,
  GetBooksParams,
} from "@/types/book";

export const booksService = {
  // GET /admin/books
  getAll: async (params?: GetBooksParams): Promise<BooksResponse> => {
    const { data } = await api.get("/admin/books", {
      params: {
        page:  params?.page  ?? 1,
        limit: params?.limit ?? 10,
        ...(params?.q            ? { q: params.q }                       : {}),
        ...(params?.categoryId   ? { categoryId: params.categoryId }     : {}),
        ...(params?.importStatus ? { importStatus: params.importStatus } : {}),
      },
    });
    return data; // { status, data: { data: Book[], meta: {...} } }
  },

  // GET /admin/books/:id
  getById: async (id: string): Promise<Book> => {
    const { data } = await api.get(`/admin/books/${id}`);
    return data?.data ?? data;
  },

  // POST /admin/books
  create: async (payload: CreateBookPayload): Promise<CreateBookResponse> => {
    const formData = new FormData();
    formData.append("title",       payload.title);
    formData.append("description", payload.description);
    formData.append("categoryId",  payload.categoryId);
    formData.append("priceCents",  String(payload.priceCents));
    if (payload.freeTrialCardCount !== undefined) {
      formData.append("freeTrialCardCount", String(payload.freeTrialCardCount));
    }
    formData.append("cover", payload.cover);
    formData.append("apkg",  payload.apkg);

    const { data } = await api.post("/admin/books", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data?.data ?? data;
  },

  // DELETE /admin/books/:id
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/books/${id}`);
  },
};