import api from "@/lib/api/axios";
import {
  Bundle,
  BundleDetail,
  BundlesResponse,
  CreateBundlePayload,
  UpdateBundlePayload,
  GetBundlesParams,
} from "@/types/bundle";

export const bundlesService = {
  // GET /admin/bundles — List bundles (paginated)
  getAll: async (params?: GetBundlesParams): Promise<BundlesResponse> => {
    const { data } = await api.get("/admin/bundles", {
      params: {
        page:  params?.page  ?? 1,
        limit: params?.limit ?? 10,
        ...(params?.q ? { q: params.q } : {}),
      },
    });
    return data;
  },

  // GET /admin/bundles/:id — Get bundle details (includes bundleBooks)
  getById: async (id: string): Promise<BundleDetail> => {
    const { data } = await api.get(`/admin/bundles/${id}`);
    return data?.data ?? data;
  },

  // POST /admin/bundles — Create a new bundle
  create: async (payload: CreateBundlePayload): Promise<Bundle> => {
    const formData = new FormData();

    // Text fields first
    formData.append("title", payload.title);
    if (payload.description) {
      formData.append("description", payload.description);
    }
    formData.append("categoryId", payload.categoryId);
    formData.append("priceTierId", payload.priceTierId);
    if (payload.durationDays !== undefined) {
      formData.append("durationDays", String(payload.durationDays));
    }

    // Cover image last
    if (payload.cover) {
      formData.append("cover", payload.cover);
    }

    const { data } = await api.post("/admin/bundles", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data?.data ?? data;
  },

  // PUT /admin/bundles/:id — Update bundle
  update: async (
    id: string,
    payload: UpdateBundlePayload
  ): Promise<Bundle> => {
    const formData = new FormData();

    if (payload.title !== undefined) {
      formData.append("title", payload.title);
    }
    if (payload.description !== undefined) {
      formData.append("description", payload.description);
    }
    if (payload.categoryId !== undefined) {
      formData.append("categoryId", payload.categoryId);
    }
    if (payload.priceTierId !== undefined) {
      formData.append("priceTierId", payload.priceTierId);
    }
    if (payload.durationDays !== undefined) {
      formData.append("durationDays", String(payload.durationDays));
    }
    if (payload.isActive !== undefined) {
      formData.append("isActive", String(payload.isActive));
    }

    // Optional cover (File = replace)
    if (payload.cover instanceof File) {
      formData.append("cover", payload.cover);
    }

    const { data } = await api.put(`/admin/bundles/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data?.data ?? data;
  },

  // DELETE /admin/bundles/:id — Delete bundle
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/bundles/${id}`);
  },

  // POST /admin/bundles/:id/books/:bookId — Add book to bundle
  addBook: async (bundleId: string, bookId: string): Promise<void> => {
    await api.post(`/admin/bundles/${bundleId}/books/${bookId}`);
  },

  // DELETE /admin/bundles/:id/books/:bookId — Remove book from bundle
  removeBook: async (bundleId: string, bookId: string): Promise<void> => {
    await api.delete(`/admin/bundles/${bundleId}/books/${bookId}`);
  },
};