export type FaqStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export interface Faq {
  id: number;
  shopScopedId: number;
  uid: string;
  question: string;
  answer: string;
  slug: string;
  status: FaqStatus;
  createdAt: string;
  updatedAt: string;
  position?: number;
}
