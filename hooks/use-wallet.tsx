"use client";

import { useAppContext } from "@/context/appContext";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface WalletBalanceResponse {
  data: {
    balance: number;
    currency: string;
  };
}

export interface WalletTransaction {
  id: number;
  uid: string;
  amount: string;
  currency: string;
  description: string;
  type: "WALLET_CREDIT" | "WALLET_DEBIT" | "WALLET_REFUND";
  status: "PENDING" | "SUCCESS" | "FAILED";
  timestamp: string;
}

export interface WalletTransactionsResponse {
  data: WalletTransaction[];
}

interface WalletTopupInput {
  amount: number;
  note?: string;
}

export function useWalletBalance() {
  const { api, userInfo } = useAppContext();

  return useQuery({
    queryKey: ["wallet-balance", userInfo?.uid],
    queryFn: async () => {
      const res = await api.get<WalletBalanceResponse>("/wallet/balance");
      if (!res.data) {
        throw new Error("Failed to fetch wallet balance");
      }
      return res.data.data;
    },
    enabled: !!api && !!userInfo?.uid,
  });
}

export function useWalletTransactions() {
  const { api, userInfo } = useAppContext();

  return useQuery({
    queryKey: ["wallet-transactions", userInfo?.uid],
    queryFn: async () => {
      const res = await api.get<WalletTransactionsResponse>("/wallet/transactions");
      if (!res.data) {
        throw new Error("Failed to fetch wallet transactions");
      }
      return res.data.data;
    },
    enabled: !!api && !!userInfo?.uid,
  });
}

export function useWalletTopup() {
  const { userInfo } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["wallet-topup"],
    mutationFn: async (input: WalletTopupInput) => {
      if (!input.amount || input.amount <= 0) {
        throw new Error("Enter a valid top-up amount");
      }

      const redirectUrl = `/client/add-funds?amount=${Number(input.amount).toFixed(2)}&returnTo=${encodeURIComponent("/client/checkout?step=payment")}`;
      return { redirectUrl };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet-balance", userInfo?.uid] });
      queryClient.invalidateQueries({ queryKey: ["wallet-transactions", userInfo?.uid] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to start top up flow");
      toast.error(errorMsg);
    },
  });
}
