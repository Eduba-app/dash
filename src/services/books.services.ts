import api from "@/lib/api/axios";
import {
  Book,
  BooksResponse,
  CreateBookPayload,
  CreateBookResponse,
  GetBooksParams,
  ReimportApkgResponse,
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

    if (payload.isFree) {
      formData.append("isFree", "true");
    } else if (payload.priceTierId) {
      formData.append("priceTierId", payload.priceTierId);
    }

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
      priceTierId?: string;
      isFree?: boolean;
      freeTrialCardCount?: number;
      isActive?: boolean;
      cover?: File | null;
    }
  ): Promise<Book> => {
    const metadataBody = {
      ...(payload.title !== undefined && { title: payload.title }),
      ...(payload.description !== undefined && { description: payload.description }),
      ...(payload.categoryId !== undefined && { categoryId: payload.categoryId }),
      ...(payload.isFree !== undefined && { isFree: payload.isFree }),
      ...(!payload.isFree && payload.priceTierId !== undefined && { priceTierId: payload.priceTierId }),
      ...(payload.freeTrialCardCount !== undefined && { freeTrialCardCount: payload.freeTrialCardCount }),
      ...(payload.isActive !== undefined && { isActive: payload.isActive }),
    };

    let book: Book | undefined;

    if (Object.keys(metadataBody).length > 0) {
      const { data } = await api.patch(`/admin/books/${id}`, metadataBody, {
        headers: { "Content-Type": "application/json" },
      });
      book = data?.data ?? data;
    }

    if (payload.cover instanceof File) {
      const formData = new FormData();
      formData.append("cover", payload.cover);

      const { data } = await api.patch(`/admin/books/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      book = data?.data ?? data;
    }

    return book ?? (await booksService.getById(id));
  },

  // DELETE /admin/books/:id
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/books/${id}`);
  },

  // PUT /admin/books/:id/reimport-apkg
  reimportApkg: async (id: string, apkg: File): Promise<ReimportApkgResponse> => {
    const formData = new FormData();
    formData.append("apkg", apkg);

    const { data } = await api.put(`/admin/books/${id}/reimport-apkg`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data?.data ?? data;
  },
};