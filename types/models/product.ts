import { CurrencyCode } from "@/lib/currencyConverter";
import { Category } from "./category";

export type ProductStatus = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
export type DiscountType = "PERCENTAGE" | "FIXED";

export interface ProductDiscount {
  type: DiscountType;
  value: number;
  startDate?: string | null;
  endDate?: string | null;
}

export interface ProductVariant {
  id: number;
  uid: string;
  name: string;
  price: string;
  stock?: number | null;
  sku?: string | null;
}

export interface Product {
  id: number;
  min?: number;
  max?: number;
  shopScopedId: number;
  uid: string;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  price: string;
  comparePrice?: string | null;
  costPerItem?: string | null;
  imageUrl: string;
  galleryUrls: string[];
  categoryUid?: string | null;
  currency: CurrencyCode;
  status: ProductStatus;
  stock?: number | null;
  sku?: string | null;
  trackInventory: boolean;
  allowBackorder: boolean;
  weight?: number | null;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  } | null;
  tags?: string[];
  variants?: ProductVariant[];
  discount?: ProductDiscount | null;
  isFeatured: boolean;
  position?: number;
  shopId: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
}
