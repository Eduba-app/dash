export interface PriceTier {
    id: string;
    productId: string;          // e.g. "wepioners.eduba.tier.price_2000"
    priceCents: number;
    displayName: string;        // e.g. "Book Tier $10"
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    bookCount: number;          // how many books use this tier
    bundleCount: number;        // how many bundles use this tier
}

export interface CreatePriceTierPayload {
    productId: string;
    priceCents: number;
    displayName: string;
    isActive?: boolean;
}

export interface GetPriceTiersParams {
    page?: number;
    limit?: number;
}

export interface PriceTiersResponse {
    status: string;
    data: {
        data: PriceTier[];
        meta: {
            page: number;
            limit: number;
            total: number;
            pagesCount: number;
        };
    };
}