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
    
    // Text fields first (Postman requirement)
    formData.append("title",       payload.title);
    formData.append("description", payload.description);
    formData.append("categoryId",  payload.categoryId);
    formData.append("priceCents",  String(payload.priceCents));
    
    if (payload.freeTrialCardCount !== undefined) {
      formData.append("freeTrialCardCount", String(payload.freeTrialCardCount));
    }
    
    // Files last
    formData.append("cover", payload.cover);
    formData.append("apkg",  payload.apkg);

    const { data } = await api.post("/admin/books", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data?.data ?? data;
  },

  // PATCH /admin/books/:id
  update: async (
    id: string,
    payload: {
      title?: string;
      description?: string;
      categoryId?: string;
      priceCents?: number;
      freeTrialCardCount?: number;
      isActive?: boolean;
      cover?: File | null;
    }
  ): Promise<Book> => {
    // If only updating metadata without cover, try JSON first
    if (!(payload.cover instanceof File) && payload.isActive !== undefined) {
      // Try JSON request for boolean fields
      try {
        const { data } = await api.patch(`/admin/books/${id}`, {
          ...(payload.title !== undefined && { title: payload.title }),
          ...(payload.description !== undefined && { description: payload.description }),
          ...(payload.categoryId !== undefined && { categoryId: payload.categoryId }),
          ...(payload.priceCents !== undefined && { priceCents: payload.priceCents }),
          ...(payload.freeTrialCardCount !== undefined && { freeTrialCardCount: payload.freeTrialCardCount }),
          isActive: payload.isActive,
        }, {
          headers: { "Content-Type": "application/json" },
        });
        return data?.data ?? data;
      } catch (error) {
        // If JSON fails, fall back to FormData
        console.warn("JSON update failed, falling back to FormData", error);
      }
    }

    // Use FormData (required when uploading cover)
    const formData = new FormData();

    // Only append provided fields (text fields first)
    if (payload.title !== undefined) {
      formData.append("title", payload.title);
    }
    if (payload.description !== undefined) {
      formData.append("description", payload.description);
    }
    if (payload.categoryId !== undefined) {
      formData.append("categoryId", payload.categoryId);
    }
    if (payload.priceCents !== undefined) {
      formData.append("priceCents", String(payload.priceCents));
    }
    if (payload.freeTrialCardCount !== undefined) {
      formData.append("freeTrialCardCount", String(payload.freeTrialCardCount));
    }
    if (payload.isActive !== undefined) {
      // Try different formats
      formData.append("isActive", payload.isActive ? "true" : "false");
    }

    // Optional new cover (File means replace)
    if (payload.cover instanceof File) {
      formData.append("cover", payload.cover);
    }

    const { data } = await api.patch(`/admin/books/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data?.data ?? data;
  },

  // DELETE /admin/books/:id
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/books/${id}`);
  },
};