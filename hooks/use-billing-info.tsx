"use client";

import { useAppContext } from "@/context/appContext";
import { BillingInfo } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetBillingInfo = () => {
  const { api, userInfo } = useAppContext();
  return useQuery({
    queryKey: ["billingInfo", userInfo?.uid],
    queryFn: async () => {
      const res = await api.get<{ billingInfos: BillingInfo[] }>(
        `/billing-info`,
      );
      if (!res.data) throw new Error("Failed to fetch billing info");
      return res.data.billingInfos;
    },
    enabled: !!api && !!userInfo?.uid,
  });
};

export const useGetDefaultBillingInfo = () => {
  const { api, userInfo } = useAppContext();
  return useQuery({
    queryKey: ["defaultBillingInfo", userInfo?.uid],
    queryFn: async () => {
      const res = await api.get<{ data: BillingInfo }>(`/billing-info/default`);
      if (!res.data) throw new Error("Failed to fetch default billing info");
      return res.data.data;
    },
    enabled: !!api && !!userInfo?.uid,
  });
};

export const useGetBillingInfoByUid = (uid: string) => {
  const { api } = useAppContext();
  return useQuery({
    queryKey: ["billingInfo", uid],
    queryFn: async () => {
      const res = await api.get<{ data: BillingInfo }>(`/billing-info/${uid}`);
      if (!res.data) throw new Error("Failed to fetch billing info");
      return res.data.data;
    },
    enabled: !!api && !!uid,
  });
};

interface CreateBillingInfoProps {
  fullName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
}

export const useCreateBillingInfo = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createBillingInfo"],
    mutationFn: async (data: CreateBillingInfoProps) => {
      const res = await api.post(`/billing-info`, data);
      if (!res.data) throw new Error("Failed to create billing info");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Billing information created successfully");
      queryClient.invalidateQueries({ queryKey: ["billingInfo"] });
      queryClient.invalidateQueries({ queryKey: ["defaultBillingInfo"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to create billing info",
      );
      toast.error(errorMsg);
    },
  });
};

interface UpdateBillingInfoProps {
  uid: string;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  isDefault?: boolean;
}

export const useUpdateBillingInfo = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateBillingInfo"],
    mutationFn: async ({ uid, ...data }: UpdateBillingInfoProps) => {
      const res = await api.put(`/billing-info/${uid}`, data);
      if (!res.data) throw new Error("Failed to update billing info");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Billing information updated successfully");
      queryClient.invalidateQueries({ queryKey: ["billingInfo"] });
      queryClient.invalidateQueries({ queryKey: ["defaultBillingInfo"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to update billing info",
      );
      toast.error(errorMsg);
    },
  });
};

interface DeleteBillingInfoProps {
  uid: string;
}

export const useDeleteBillingInfo = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteBillingInfo"],
    mutationFn: async ({ uid }: DeleteBillingInfoProps) => {
      const res = await api.delete(`/billing-info/${uid}`);
      if (!res.data) throw new Error("Failed to delete billing info");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Billing information deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["billingInfo"] });
      queryClient.invalidateQueries({ queryKey: ["defaultBillingInfo"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to delete billing info",
      );
      toast.error(errorMsg);
    },
  });
};
