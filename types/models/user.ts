import { CurrencyCode } from "@/lib/currencyConverter";

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "BANNED";
export type UserRole = "USER" | "PREMIUM";

export interface User {
  id: number;
  shopScopedId: number;
  uid: string;
  email: string;
  image?: string | null;
  fullName?: string | null;
  username: string;
  apiKey?: string;
  role: UserRole;
  status: UserStatus;
  balance: string;
  spent: string;
  timestamp?: string | null;
  lastSeen?: string | null;
  updatedAt: string;
  phone?: string | null;
  currency: CurrencyCode;
  referralCode?: string | null;
  referredBy?: number | null;
}
