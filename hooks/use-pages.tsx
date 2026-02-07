"use client";

import { useAppContext } from "@/context/appContext";
import { Page, PageStatus, PageType } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreatePageProps {
  pageType: PageType;
  title: string;
  description?: string;
  content: string;
}

interface UpdatePageProps {
  uid: string;
  title?: string;
  content?: string;
  status?: PageStatus;
  description?: string;
  
}

// Get all pages by admin
export const useGetPagesByAdmin = () => {
  const { api, shopId } = useAppContext();
  return useQuery({
    queryKey: ["pagesByAdmin", shopId],
    queryFn: async () => {
      const res = await api.get<Page[]>(`/pages/admin`);
      return res.data;
    },
    enabled: !!api && !!shopId,
  });
};

// Get page by type (public)
export const useGetPageByType = (pageType: PageType) => {
  const { api, shopId } = useAppContext();
  return useQuery({
    queryKey: ["page", shopId, pageType],
    queryFn: async () => {
      const res = await api.get<Page>(
        `/pages?shopId=${shopId}&pageType=${pageType}`
      );
      return res.data;
    },
    enabled: !!api && !!shopId && !!pageType,
  });
};

// Create a new page
export const useCreatePage = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (page: CreatePageProps) => {
      const res = await api.post(`/pages`, page);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Page created successfully");
      queryClient.invalidateQueries({ queryKey: ["pagesByAdmin", shopId] });
    },
    onError: (error: any) => {
      const errorMsg = normalizeApiError(error, "Failed to create page");
      toast.error(errorMsg);
    },
  });
};

// Update a page
export const useUpdatePage = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (page: UpdatePageProps) => {
      const res = await api.patch(`/pages`, page);
      if (!res.data) {
        throw new Error("Failed to update page");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Page updated successfully");
      queryClient.invalidateQueries({ queryKey: ["pagesByAdmin", shopId] });
    },
    onError: (error: any) => {
      const errorMsg = normalizeApiError(error, "Failed to update page");
      toast.error(errorMsg);
    },
  });
};

// Delete a page
export const useDeletePage = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deletePage"],
    mutationFn: async (uid: string) => {
      const res = await api.delete(`/pages`, { data: { uid } });
      if (!res.data || res.status !== 200) {
        throw new Error("Failed to delete page");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Page deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["pagesByAdmin", shopId] });
    },
    onError: (error: any) => {
      const errorMsg = normalizeApiError(error, "Failed to delete page");
      toast.error(errorMsg);
    },
  });
};
