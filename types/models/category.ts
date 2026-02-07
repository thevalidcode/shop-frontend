export type CategoryStatus = "ACTIVE" | "INACTIVE";

export interface Category {
  id: number;
  shopScopedId: number;
  uid: string;
  name: string;
  slug: string;
  iconUrl?: string | null;
  bannerUrl?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
  position?: number;
  parentUid?: string | null;
  shopId: number;
}
