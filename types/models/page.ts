export type PageType =
  | "PRODUCTS"
  | "ORDERS"
  | "ORDER"
  | "TERMS_OF_SERVICE"
  | "PRIVACY_POLICY";

export type PageStatus = "ACTIVE" | "INACTIVE";

export interface Page {
  uid: string;
  id: number;
  shopScopedId: number;
  pageType: PageType;
  title: string;
  content: string;
  description?: string;
  status: PageStatus;
  createdAt: string;
  updatedAt: string;
}
