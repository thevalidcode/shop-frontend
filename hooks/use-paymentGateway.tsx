"use client";

import { useAppContext } from "@/context/appContext";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  PaymentGateway,
  PaymentGatewayStatus,
  PaymentGatewayPlatform,
  PaymentGatewayPublic,
} from "@/types";

export interface CreatePaymentGatewayProps {
  platform: PaymentGatewayPlatform;
  name: string;
  description?: string | null;
  content?: string | null;
  publicKey?: string | null;
  secretKey?: string | null;
  feePercent?: number;
  status?: PaymentGatewayStatus;
  position?: number;
  min?: string | null;
  max?: string | null;
  currency?: string;
}

export interface UpdatePaymentGatewayProps {
  uid: string;
  platform?: PaymentGatewayPlatform;
  name?: string;
  description?: string | null;
  content?: string | null;
  publicKey?: string | null;
  secretKey?: string | null;
  feePercent?: number;
  status?: PaymentGatewayStatus;
  position?: number;
  min?: string | null;
  max?: string | null;
  currency?: string;
}

// Form response type
export interface PaymentGatewayFormResponse {
  success: boolean;
  message: string;
  data?: PaymentGateway;
  signature?: string;
}

export const useGetAllPaymentGateways = () => {
  const { api, shopId } = useAppContext();

  return useQuery({
    queryKey: ["paymentGatewaysPublic", shopId],
    queryFn: async () => {
      const res = await api.get<PaymentGatewayPublic[]>(
        `/payment-gateways?shopId=${shopId}`
      );
      if (!res.data) throw new Error("Failed to fetch gateways");
      return res.data;
    },
    enabled: !!api && !!shopId,
  });
};

export const useGetAllPaymentGatewaysForAdmins = () => {
  const { api, shopId } = useAppContext();

  return useQuery({
    queryKey: ["paymentGatewaysAdmin", shopId],
    queryFn: async () => {
      const res = await api.get<PaymentGateway[]>(`/payment-gateways/admin`);
      if (!res.data) throw new Error("Failed to fetch gateways");
      return res.data;
    },
    enabled: !!api && !!shopId,
  });
};

export const useGetSinglePaymentGateway = (uid: string) => {
  const { api, shopId } = useAppContext();

  return useQuery({
    queryKey: ["paymentGatewayPublic", shopId, uid],
    queryFn: async () => {
      const res = await api.get<PaymentGatewayPublic>(
        `/payment-gateways/${uid}?shopId=${shopId}`
      );
      if (!res.data) throw new Error("Failed to fetch gateway details");
      return res.data;
    },
    enabled: !!api && !!uid && !!shopId,
  });
};

export const useGetSinglePaymentGatewayForAdmins = (uid: string) => {
  const { api } = useAppContext();

  return useQuery({
    queryKey: ["paymentGatewayAdmin", uid],
    queryFn: async () => {
      const res = await api.get<PaymentGateway>(
        `/payment-gateways/admin/${uid}`
      );
      if (!res.data) throw new Error("Failed to fetch gateway details");
      return res.data;
    },
    enabled: !!api && !!uid,
  });
};

export const useCreatePaymentGateway = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createPaymentGateway"],
    mutationFn: async (data: CreatePaymentGatewayProps) => {
      const res = await api.post("/payment-gateways", data);
      if (!res.data) throw new Error("Failed to create payment gateway");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Payment gateway created successfully");
      queryClient.invalidateQueries({
        queryKey: ["paymentGatewaysAdmin", shopId],
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to create payment gateway");
      toast.error(errorMsg);
    },
  });
};

export const useUpdatePaymentGateway = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updatePaymentGateway"],
    mutationFn: async (data: UpdatePaymentGatewayProps) => {
      const res = await api.patch(`/payment-gateways`, data);
      if (!res.data) throw new Error("Failed to update payment gateway");
      return res.data;
    },
    onSuccess: (_data, variables) => {
      toast.success("Payment gateway updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["paymentGatewaysAdmin", shopId],
      });
      queryClient.invalidateQueries({
        queryKey: ["paymentGatewayAdmin", variables.uid],
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update payment gateway");
      toast.error(errorMsg);
    },
  });
};

interface DeletePaymentGatewayProps {
  uid: string;
}

export const useDeletePaymentGateway = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deletePaymentGateway"],
    mutationFn: async (data: DeletePaymentGatewayProps) => {
      const res = await api.delete(`/payment-gateways`, { data });
      if (!res.data) throw new Error("Failed to delete payment gateway");
      return res.data;
    },
    onSuccess: (_res, variables) => {
      toast.success("Payment gateway deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["paymentGatewaysAdmin", shopId],
      });
      queryClient.invalidateQueries({
        queryKey: ["paymentGatewayAdmin", variables.uid],
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to delete payment gateway");
      toast.error(errorMsg);
    },
  });
};

interface DeleteMultiplePaymentGatewaysProps {
  uids: string[];
}

export const useDeleteMultiplePaymentGateways = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteMultiplePaymentGateways"],
    mutationFn: async (data: DeleteMultiplePaymentGatewaysProps) => {
      const res = await api.delete(`/payment-gateways/multiple`, { data });
      if (!res.data) throw new Error("Failed to delete payment gateways");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Payment gateways deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["paymentGatewaysAdmin", shopId],
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to delete payment gateways");
      toast.error(errorMsg);
    },
  });
};
