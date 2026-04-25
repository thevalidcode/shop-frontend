"use client";

import { GeneralSettingProps, useAppContext } from "@/context/appContext";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface UpdateShopSettingsProps {
  logoUrl?: string;
  faviconUrl?: string;
  shopName?: string;
  defaultClientCurrency?: string;
  shopDescription?: string;
  showBanner?: boolean;
  instagramUrl?: string;
  xUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  shopStreet?: string;
  shopCity?: string;
  shopState?: string;
  shopPostalCode?: string;
  shopCountry?: string;
  shopPhone?: string;
}

export interface UpdateShopDesignProps {
  name: string;
  hex: string;
  schema: {
    ":root": Record<string, string>;
    ".dark"?: Record<string, string>;
  };
}

// =====================
// Update shop settings
// =====================
export function useUpdateShopSettings() {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateShopSettings", shopId],
    mutationFn: async (data: UpdateShopSettingsProps) => {
      if (!shopId) throw new Error("No shopId available for updating settings");
      const res = await api.patch(`/shops/general-data`, data);
      if (!res.data) throw new Error("Failed to update shop settings");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopSettings", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to update shop settings",
      );
      toast.error(errorMsg);
    },
  });
}

// =====================
// Get shop design
// =====================
export function useGetShopDesign() {
  const { api, shopId } = useAppContext();

  return useQuery({
    queryKey: ["shopDesign", shopId],
    queryFn: async () => {
      if (!shopId) throw new Error("No shopId available for getting styles");
      const res = await api.get(`/shops/${shopId}/styles`);
      if (!res.data) throw new Error("Failed to get shop styles");
      return res.data;
    },
    enabled: !!api && !!shopId,
  });
}

// =====================
// Update shop design
// =====================
export function useUpdateShopDesign() {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateShopDesign", shopId],
    mutationFn: async (data: UpdateShopDesignProps) => {
      if (!shopId) throw new Error("No shopId available for updating styles");
      const res = await api.patch(`/shops/styles`, data);
      if (!res.data) throw new Error("Failed to update shop styles");
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["shopDesign", shopId], data);
      queryClient.invalidateQueries({ queryKey: ["shopDesign", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update shop styles");
      toast.error(errorMsg);
    },
  });
}

// update onboarding completed status
export function useUpdateOnboardingCompleted() {
  const { api, setGeneralSetting, shopId } = useAppContext();
  return useMutation({
    mutationFn: async () => {
      const res = await api.put(`/shops/${shopId}/onboarding-completed`);
      if (!res.data) throw new Error("Failed to update onboarding status");
      return res.data.setting;
    },
    onSuccess: (updatedSetting: GeneralSettingProps) => {
      setGeneralSetting({
        ...updatedSetting,
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to update onboarding status",
      );
      toast.error(errorMsg);
    },
  });
}
