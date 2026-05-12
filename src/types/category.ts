export interface Category {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  iconUrl: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
}