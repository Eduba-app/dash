import api from "@/lib/api/axios";
import {
    PriceTier,
    PriceTiersResponse,
    CreatePriceTierPayload,
    GetPriceTiersParams,
} from "@/types/price-tier";

export const priceTiersService = {
    // GET /admin/price-tiers — List price tiers (paginated)
    getAll: async (params?: GetPriceTiersParams): Promise<PriceTiersResponse> => {
        const { data } = await api.get("/admin/price-tiers", {
            params: {
                page: params?.page ?? 1,
                limit: params?.limit ?? 20,
            },
        });
        return data;
    },

    // GET /admin/price-tiers/:id — Get price tier details
    getById: async (id: string): Promise<PriceTier> => {
        const { data } = await api.get(`/admin/price-tiers/${id}`);
        return data?.data ?? data;
    },

    // POST /admin/price-tiers — Create new price tier
    create: async (payload: CreatePriceTierPayload): Promise<PriceTier> => {
        const { data } = await api.post("/admin/price-tiers", payload);
        return data?.data ?? data;
    },

    // POST /admin/price-tiers/:id — Update price tier
    // ⚠️ API uses POST (not PATCH/PUT) for updates
    update: async (
        id: string,
        payload: Partial<CreatePriceTierPayload>
    ): Promise<PriceTier> => {
        const { data } = await api.post(`/admin/price-tiers/${id}`, payload);
        return data?.data ?? data;
    },

    // DELETE /admin/price-tiers/:id — Delete price tier
    delete: async (id: string): Promise<void> => {
        await api.delete(`/admin/price-tiers/${id}`);
    },
};