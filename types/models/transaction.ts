import { CurrencyCode } from "@/lib/currencyConverter";

export type TransactionType = "ORDER_PAYMENT" | "REFERRAL_CREDIT" | "REFUND";
export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface Transaction {
  id: number;
  uid: string;
  userId: number;
  type: TransactionType;
  amount: string;
  currency: CurrencyCode;
  status: TransactionStatus;
  description?: string | null;
  reference?: string | null;
  shopScopedId: number;
  shopId: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    uid: string;
    email: string;
    username: string;
  };
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
