export type SupplierSourceType = "EXTERNAL" | "SYSTEM_INTERNAL";
export type SupplierMarginType = "percentage" | "fixed";

export interface Supplier {
  id: number;
  shopScopedId: number;
  uid: string;
  name: string;
  image?: string | null;
  apiUrl: string;
  percentage: number;
  sync: boolean;
  isInternal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierSourceStore {
  shopId?: number;
  uid?: string;
  name: string;
  url: string;
  image: string | null;
  isInternal: boolean;
}

export interface SupplierSourceStoresResponse {
  suppliers: SupplierSourceStore[];
  meta: {
    total: number;
    page: number;
    pages: number;
    limit: number;
    unfilteredTotal?: number;
  };
}

export interface SupplierSourceProduct {
  productId: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  min: number;
  max: number;
  stock: number;
  status: "ACTIVE" | "OUT_OF_STOCK";
  imageUrl: string | null;
  galleryUrls: string[];
  tags: string[];
  brand: string | null;
  slug: string;
  categoryUid?: string | null;
}

export interface SupplierSourceProductsResponse {
  sourceStore: {
    shopId: number;
    uid: string;
    name: string;
  };
  products: SupplierSourceProduct[];
}

export interface SupplierProduct extends SupplierSourceProduct {}

export interface SupplierFormPayload {
  uid?: string;
  name: string;
  url: string;
  image?: string;
  apiKey?: string;
  percentage?: number;
  sync?: boolean;
  isInternal?: boolean;
}
