export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Review {
  id: number;
  uid: string;
  productUid: string;
  userUid: string;
  rating: number; // 1-5
  title?: string | null;
  comment?: string | null;
  isVerified: boolean;
  status: ReviewStatus;
  timestamp: string;
  updatedAt: string;
  // User info for display
  user?: {
    uid: string;
    username: string;
    fullName?: string | null;
    image?: string | null;
  };
}
