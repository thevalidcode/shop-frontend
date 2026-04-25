"use client";

import { useAppContext } from "@/context/appContext";
import { Product, ProductStatus } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateProductProps {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: string;
  comparePrice?: string;
  costPerItem?: string;
  images?: string[];
  categoryUid?: string;
  status?: ProductStatus;
  stock?: number;
  sku?: string;
  trackInventory?: boolean;
  allowBackorder?: boolean;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  tags?: string[];
  isFeatured?: boolean;
  position?: number;
}

export const useCreateProduct = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createProduct"],
    mutationFn: async (data: CreateProductProps) => {
      const res = await api.post(`/products`, data);
      if (!res.data) throw new Error("Failed to create product");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["products", shopId] });
      queryClient.invalidateQueries({ queryKey: ["productsPublic", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to create product");
      toast.error(errorMsg);
    },
  });
};

export const useGetProducts = () => {
  const { api, shopId } = useAppContext();
  return useQuery({
    queryKey: ["products", shopId],
    queryFn: async () => {
      const res = await api.get<Product[]>(`/products/admin/all`);
      if (!res.data) throw new Error("Failed to fetch products");
      return res.data;
    },
    enabled: !!api && !!shopId,
  });
};

export const useGetProductsPublic = () => {
  const { api, shopId } = useAppContext();
  return useQuery({
    queryKey: ["productsPublic", shopId],
    queryFn: async () => {
      const res = await api.get<Product[]>(`/products?shopId=${shopId}`);
      if (!res.data) throw new Error("Failed to fetch products");
      return res.data;
    },
    enabled: !!api && !!shopId,
  });
};

export const useGetProductByUid = (uid: string) => {
  const { api, shopId } = useAppContext();
  return useQuery({
    queryKey: ["product", uid, shopId],
    queryFn: async () => {
      const res = await api.get<{ product: Product }>(
        `/products/${uid}?shopId=${shopId}`,
      );
      if (!res.data?.product) throw new Error("Product not found");
      return res.data.product;
    },
    enabled: !!api && !!uid && !!shopId,
  });
};

interface UpdateProductProps {
  uid: string;
  name?: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  price?: string;
  comparePrice?: string;
  supplierPrice?: string;
  supplierCurrency?: string | null;
  supplierProductUid?: string | null;
  supplierUid?: string | null;
  syncWithSupplier?: boolean;
  syncQuantity?: boolean;
  syncCatAndName?: boolean;
  marginType?: "percentage" | "fixed" | null;
  marginValue?: string | null;
  costPerItem?: string;
  images?: string[];
  categoryUid?: string;
  status?: ProductStatus;
  stock?: number;
  sku?: string;
  trackInventory?: boolean;
  allowBackorder?: boolean;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  tags?: string[];
  isFeatured?: boolean;
  position?: number;
}

export const useUpdateProduct = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: async (data: UpdateProductProps) => {
      const res = await api.patch(`/products`, data);
      if (!res.data) throw new Error("Failed to update product");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products", shopId] });
      queryClient.invalidateQueries({ queryKey: ["productsPublic", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update product");
      toast.error(errorMsg);
    },
  });
};

interface DeleteProductProps {
  uid: string;
}

export const useDeleteProduct = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteProduct"],
    mutationFn: async (data: DeleteProductProps) => {
      const res = await api.delete(`/products`, { data });
      if (!res.data) throw new Error("Failed to delete product");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products", shopId] });
      queryClient.invalidateQueries({ queryKey: ["productsPublic", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to delete product");
      toast.error(errorMsg);
    },
  });
};

interface DeleteMultipleProductsProps {
  uids: string[];
}

export const useDeleteMultipleProducts = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteMultipleProducts"],
    mutationFn: async (data: DeleteMultipleProductsProps) => {
      const res = await api.delete(`/products/multiple`, { data });
      if (!res.data) throw new Error("Failed to delete products");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Products deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products", shopId] });
      queryClient.invalidateQueries({ queryKey: ["productsPublic", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to delete products");
      toast.error(errorMsg);
    },
  });
};
