export type AdminStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "MODERATOR";

export interface Admin {
  id: number;
  uid: string;
  email: string;
  image?: string | null;
  username: string;
  fullName?: string | null;
  apiKey: string;
  role: AdminRole;
  status: AdminStatus;
  shopId: number;
  createdAt: string;
  updatedAt: string;
  lastSeen: string;
  onboardingCompleted?: boolean;
}
