import api from "@/lib/api/axios";
import { Category, CreateCategoryPayload } from "@/types/category";

export const categoriesService = {
  getAll: async (params: { page?: number; limit?: number; q?: string } = {}): Promise<{
    data: Category[];
    meta: { page: number; limit: number; total: number; pagesCount: number };
  }> => {
    const { data } = await api.get("/admin/categories", {
      params: {
        page:  params.page  ?? 1,
        limit: params.limit ?? 10,   // ← كانت 100 ثابتة، دلوقتي بتاخد من params
        ...(params.q ? { q: params.q } : {}),
      },
    });

    return {
      data: Array.isArray(data?.data?.data) ? data.data.data : [],
      meta: data?.data?.meta ?? { page: 1, limit: 10, total: 0, pagesCount: 1 },
    };
  },

  create: async (payload: CreateCategoryPayload): Promise<Category> => {
    const { data } = await api.post("/admin/categories", {
      name:         payload.name,
      slug:         payload.slug,
      displayOrder: payload.displayOrder ?? 0,
    });
    return data;
  },

  deactivate: async (id: string): Promise<void> => {
    await api.delete(`/admin/categories/${id}`);
  },
};