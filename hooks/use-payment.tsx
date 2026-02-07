"use client";

import { useAppContext } from "@/context/appContext";
import {
  PaymentFilters,
  PaymentGatewayPlatform,
  Payment,
} from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface InitializePaymentProps {
  platform: PaymentGatewayPlatform;
  currency: string;
  cartUid: string;
  redirectUrl: string;
  notes?: string;
  billingInfoUid: string;
  shippingCost?: number;
  shippingCurrency?: string;
  selectedShippingRate?: any;
}

export const useInitializePayment = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["initializePayment"],
    mutationFn: async (data: InitializePaymentProps) => {
      const res = await api.post<{ url: string; message?: string }>(
        "/payments/initialize",
        data,
      );
      if (!res.data) throw new Error("Failed to initialize payment");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to initialize payment");
      toast.error(errorMsg);
    },
  });
};

export const useGetPayments = (
  page: number = 1,
  limit: number = 10,
  filters?: PaymentFilters,
) => {
  const { api, userInfo } = useAppContext();

  return useQuery({
    queryKey: ["payments", userInfo?.uid, page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.method && { method: filters.method }),
      });

      const res = await api.get<Payment[]>(
        `/payments?${params.toString()}`,
      );
      return res.data;
    },
    enabled: !!api && !!userInfo?.uid,
  });
};

export const useGetAllPaymentsForAdmin = (
  page: number = 1,
  limit: number = 10,
  filters?: PaymentFilters,
) => {
  const { api, shopId } = useAppContext();

  return useQuery({
    queryKey: ["admin-payments", shopId, page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.method && { method: filters.method }),
        ...(filters?.search && { search: filters.search }),
      });

      const res = await api.get<Payment[]>(
        `/payments/admin?${params.toString()}`,
      );
      return res.data;
    },
    enabled: !!api && !!shopId,
  });
};
