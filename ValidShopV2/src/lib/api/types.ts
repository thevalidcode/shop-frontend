export type ProductPublic = {
  id: number;
  shopScopeId: number;
  uid: string;
  name: string;
  description: string;
  category: string;
  type: string;
  min: number;
  max: number;
  price: number;
  status: string;
  stock: number;
  imageUrl: string | null;
  galleryUrls: string[];
  isFeatured: boolean;
  brand: string | null;
  comparePrice: number | null;
  slug: string;
  discountType: string | null;
  discountValue: number | null;
  timestamp: string;
};

export type ShopData = {
  shopId: number;
  plan: string;
  status: string;
  timestamp: string;
};

export type SiteData = Record<string, unknown>;
export type DesignStyles = Record<string, unknown>;
