export type BlogStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export interface Blog {
  id: number;
  uid: string;
  slug: string;
  title: string;
  shopScopedId: number;
  coverImage?: string | null;
  excerpt?: string | null;
  content: string;
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
}
