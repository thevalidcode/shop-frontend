"use client";

import { useAppContext } from "@/context/appContext";
import { PaymentFilters, PaymentGatewayPlatform, Payment } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface InitializePaymentProps {
  platform: PaymentGatewayPlatform;
  useBalance?: boolean;
  purpose?: "ORDER" | "WALLET_TOPUP";
  currency: string;
  cartUid: string;
  redirectUrl: string;
  notes?: string;
  shippingInfoUid: string;
  shippingCost?: number;
  shippingCurrency?: string;
  selectedShippingRate?: any;
}

interface CreateWalletPaymentProps {
  platform: PaymentGatewayPlatform;
  amount: string;
  currency: string;
  redirectUrl: string;
}

interface UpdatePaymentStatusByAdminProps {
  paymentUid: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
}

export const useInitializePayment = () => {
  const { api, userInfo } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["initializePayment"],
    mutationFn: async (data: InitializePaymentProps) => {
      const res = await api.post<{
        url?: string;
        message?: string;
        paymentUid?: string;
        paymentSource?: string;
      }>("/payments/initialize", data);
      if (!res.data) throw new Error("Failed to initialize payment");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({
        queryKey: ["wallet-balance", userInfo?.uid],
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to initialize payment");
      toast.error(errorMsg);
    },
  });
};

export const useCreateWalletPayment = () => {
  const { api } = useAppContext();
  return useMutation({
    mutationKey: ["createWalletPayment"],
    mutationFn: async (data: CreateWalletPaymentProps) => {
      const res = await api.post<{ url: string; message?: string }>(
        "/payments/create",
        data,
      );

      if (!res.data) {
        throw new Error("Failed to initialize wallet payment");
      }

      return res.data;
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to initialize wallet payment",
      );
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

      const res = await api.get<Payment[]>(`/payments?${params.toString()}`);
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

      const res = await api.get<{
        payments: Payment[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>(`/payments/admin?${params.toString()}`);
      return res.data;
    },
    enabled: !!api && !!shopId,
  });
};

export const useUpdatePaymentStatusByAdmin = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updatePaymentStatusByAdmin"],
    mutationFn: async ({
      paymentUid,
      status,
    }: UpdatePaymentStatusByAdminProps) => {
      const res = await api.patch(`/payments/admin/${paymentUid}/status`, {
        status,
      });

      if (!res.data) {
        throw new Error("Failed to update payment status");
      }

      return res.data;
    },
    onSuccess: () => {
      toast.success("Payment status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-payments", shopId] });
      queryClient.invalidateQueries({ queryKey: ["adminOrders", shopId] });
      queryClient.invalidateQueries({ queryKey: ["adminOrder"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to update payment status",
      );
      toast.error(errorMsg);
    },
  });
};
