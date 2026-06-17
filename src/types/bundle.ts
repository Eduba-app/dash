import { PriceTier } from "./price-tier";

export interface BundleCategory {
    id: string;
    name: string;
    slug: string;
}

export interface Bundle {
    id: string;
    categoryId: string;
    title: string;                      
    description: string;
    coverImageUrl: string | null;
    priceTierId: string;                 
    durationDays: number;               
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    category: BundleCategory;
    priceTier: Omit<PriceTier, "bookCount" | "bundleCount">;
    bookCount: number;
    subscriptionCount: number;
}

/** Nested book inside bundleBooks (detail endpoint) */
export interface BundleBookEntry {
    id: string;
    bundleId: string;
    bookId: string;
    createdAt: string;
    book: {
        id: string;
        title: string;
        description: string;
        coverImageUrl: string | null;
        priceTierId: string;
        priceTier: { id: string; productId: string; priceCents: number; displayName: string };
        categoryId: string;
        category: { id: string; name: string };
    };
}

/** Extended response from GET /admin/bundles/{id} */
export interface BundleDetail extends Bundle {
    coverStorageKey?: string;
    bundleBooks: BundleBookEntry[];
    _count?: { subscriptions: number };
}

export interface CreateBundlePayload {
    title: string;
    description?: string;
    categoryId: string;
    priceTierId: string;                 // ⚠️ NOT priceCents directly
    durationDays?: number;
    cover?: File;
}

export interface UpdateBundlePayload {
    title?: string;
    description?: string;
    categoryId?: string;
    priceTierId?: string;
    durationDays?: number;
    isActive?: boolean;
    cover?: File | null;
}

export interface GetBundlesParams {
    page?: number;
    limit?: number;
    q?: string;
}

export interface BundlesResponse {
    status: string;
    data: {
        data: Bundle[];
        meta: {
            page: number;
            limit: number;
            total: number;
            pagesCount: number;
        };
    };
}