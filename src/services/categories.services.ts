import api from "@/lib/api/axios";
import { Category, CreateCategoryPayload } from "@/types/category";

export const categoriesService = {
  getAll: async (params: { page?: number; limit?: number; q?: string } = {}): Promise<{
    data: Category[];
    meta: { page: number; limit: number; total: number; pagesCount: number };
  }> => {
    const { data } = await api.get("/admin/categories", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        ...(params.q ? { q: params.q } : {}),
      },
    });

    return {
      data: Array.isArray(data?.data?.data) ? data.data.data : [],
      meta: data?.data?.meta ?? { page: 1, limit: 10, total: 0, pagesCount: 1 },
    };
  },

  create: async (payload: CreateCategoryPayload & { image?: File }): Promise<Category> => {
    const formData = new FormData();

    formData.append("name", payload.name);

    if (payload.image) {
      formData.append("image", payload.image);
    }

    const { data } = await api.post("/admin/categories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  update: async (
    id: string,
    payload: { name?: string; image?: File | null }
  ): Promise<Category> => {
    const formData = new FormData();

    // Only append fields that are provided
    if (payload.name !== undefined) {
      formData.append("name", payload.name);
    }
    // Optional image (null means remove, File means replace)
    if (payload.image instanceof File) {
      formData.append("image", payload.image);
    }

    const { data } = await api.patch(`/admin/categories/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  deactivate: async (id: string): Promise<void> => {
    await api.delete(`/admin/categories/${id}`);
  },
};