"use client";

import { useAppContext } from "@/context/appContext";
import { ShippingInfo } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetShippingInfo = () => {
  const { api, userInfo } = useAppContext();
  return useQuery({
    queryKey: ["shippingInfo", userInfo?.uid],
    queryFn: async () => {
      const res = await api.get<{ shippingInfos: ShippingInfo[] }>(
        `/shipping-info`,
      );
      if (!res.data) throw new Error("Failed to fetch shipping info");
      return res.data.shippingInfos;
    },
    enabled: !!api && !!userInfo?.uid,
  });
};

export const useGetDefaultShippingInfo = () => {
  const { api, userInfo } = useAppContext();
  return useQuery({
    queryKey: ["defaultShippingInfo", userInfo?.uid],
    queryFn: async () => {
      const res = await api.get<{ data: ShippingInfo }>(`/shipping-info/default`);
      if (!res.data) throw new Error("Failed to fetch default shipping info");
      return res.data.data;
    },
    enabled: !!api && !!userInfo?.uid,
  });
};

export const useGetShippingInfoByUid = (uid: string) => {
  const { api } = useAppContext();
  return useQuery({
    queryKey: ["shippingInfo", uid],
    queryFn: async () => {
      const res = await api.get<{ data: ShippingInfo }>(`/shipping-info/${uid}`);
      if (!res.data) throw new Error("Failed to fetch shipping info");
      return res.data.data;
    },
    enabled: !!api && !!uid,
  });
};

interface CreateShippingInfoProps {
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

export const useCreateShippingInfo = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createShippingInfo"],
    mutationFn: async (data: CreateShippingInfoProps) => {
      const res = await api.post(`/shipping-info`, data);
      if (!res.data) throw new Error("Failed to create shipping info");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Shipping information created successfully");
      queryClient.invalidateQueries({ queryKey: ["shippingInfo"] });
      queryClient.invalidateQueries({ queryKey: ["defaultShippingInfo"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to create shipping info",
      );
      toast.error(errorMsg);
    },
  });
};

interface UpdateShippingInfoProps {
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

export const useUpdateShippingInfo = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateShippingInfo"],
    mutationFn: async ({ uid, ...data }: UpdateShippingInfoProps) => {
      const res = await api.put(`/shipping-info/${uid}`, data);
      if (!res.data) throw new Error("Failed to update shipping info");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Shipping information updated successfully");
      queryClient.invalidateQueries({ queryKey: ["shippingInfo"] });
      queryClient.invalidateQueries({ queryKey: ["defaultShippingInfo"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to update shipping info",
      );
      toast.error(errorMsg);
    },
  });
};

interface DeleteShippingInfoProps {
  uid: string;
}

export const useDeleteShippingInfo = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteShippingInfo"],
    mutationFn: async ({ uid }: DeleteShippingInfoProps) => {
      const res = await api.delete(`/shipping-info/${uid}`);
      if (!res.data) throw new Error("Failed to delete shipping info");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Shipping information deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["shippingInfo"] });
      queryClient.invalidateQueries({ queryKey: ["defaultShippingInfo"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to delete shipping info",
      );
      toast.error(errorMsg);
    },
  });
};
