"use client";

import { useAppContext } from "@/context/appContext";
import { Category, CategoryStatus } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateCategoryProps {
  name: string;
  slug: string;
  iconUrl?: string;
  bannerUrl?: string;
  imageUrl?: string;
  description?: string;
  status?: CategoryStatus;
  position?: number;
  parentUid?: string;
}

interface UpdateCategoryProps {
  uid: string;
  name?: string;
  slug?: string;
  iconUrl?: string;
  bannerUrl?: string;
  imageUrl?: string;
  description?: string;
  status?: CategoryStatus;
  position?: number;
  parentUid?: string;
}

export const useGetCategories = () => {
  const { shopId, api } = useAppContext();
  return useQuery({
    queryKey: ["categories", shopId],
    queryFn: async () => {
      const res = await api.get<Category[]>(`/categories?shopId=${shopId}`);
      return res.data;
    },
    enabled: !!api && !!shopId,
  });
};

export const useGetCategoryByUid = (uid: string) => {
  const { shopId, api } = useAppContext();
  return useQuery({
    queryKey: ["category", uid, shopId],
    queryFn: async () => {
      const res = await api.get<{ category: Category }>(
        `/categories/${uid}?shopId=${shopId}`
      );
      if (!res.data?.category) throw new Error("Category not found");
      return res.data.category;
    },
    enabled: !!api && !!uid && !!shopId,
  });
};

export const useCreateCategory = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: CreateCategoryProps) => {
      const res = await api.post(`/categories`, category);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["categories", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to create category");
      toast.error(errorMsg);
    },
  });
};

export const useUpdateCategory = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: UpdateCategoryProps) => {
      const res = await api.patch(`/categories`, category);
      if (!res.data) {
        throw new Error("Failed to update category");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["categories", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update category");
      toast.error(errorMsg);
    },
  });
};

interface CategoryDeleteProps {
  uid: string;
}

export const useDeleteCategory = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteCategory"],
    mutationFn: async (data: CategoryDeleteProps) => {
      const res = await api.delete(`/categories`, { data });
      if (!res.data) {
        throw new Error("Failed to delete category");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to delete category");
      toast.error(errorMsg);
    },
  });
};

interface DeleteMultipleCategoriesProps {
  uids: string[];
}

export const useDeleteMultipleCategories = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteMultipleCategories"],
    mutationFn: async (data: DeleteMultipleCategoriesProps) => {
      const res = await api.delete(`/categories/multiple`, { data });
      if (!res.data) {
        throw new Error("Failed to delete categories");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Categories deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to delete categories");
      toast.error(errorMsg);
    },
  });
};
