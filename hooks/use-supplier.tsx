"use client";

import { useAppContext } from "@/context/appContext";
import type {
  Supplier,
  SupplierFormPayload,
  SupplierMarginType,
  SupplierProduct,
  SupplierSourceProductsResponse,
  SupplierSourceStoresResponse,
} from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGetSupplierSourceStores(
  page: number,
  limit: number,
  search?: string,
) {
  const { api, shopId } = useAppContext();

  return useQuery({
    queryKey: ["all-product-suppliers", shopId, page, limit, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(shopId ? { shopId: String(shopId) } : {}),
        ...(search?.trim() ? { search: search.trim() } : {}),
      });

      const res = await api.get<SupplierSourceStoresResponse>(
        `/product-suppliers/stores?${params.toString()}`,
      );

      if (!res.data) {
        throw new Error("Failed to fetch all supplier source stores");
      }

      return res.data;
    },
    enabled: !!api && !!shopId,
  });
}

export function useGetSupplierSourceProducts(sourceStoreUid?: string) {
  const { api, shopId } = useAppContext();

  return useQuery({
    queryKey: ["supplier-source-products", shopId, sourceStoreUid],
    queryFn: async () => {
      const res = await api.get<SupplierSourceProductsResponse>(
        `/product-suppliers/stores/${sourceStoreUid}/products`,
      );

      if (!res.data) {
        throw new Error("Failed to fetch supplier source products");
      }

      return res.data;
    },
    enabled: !!api && !!shopId && !!sourceStoreUid,
  });
}

export function useGetSuppliers() {
  const { api, shopId } = useAppContext();

  return useQuery({
    queryKey: ["product-suppliers", shopId],
    queryFn: async () => {
      const res = await api.get<{ suppliers: Supplier[] }>(
        "/product-suppliers/suppliers",
      );
      if (!res.data) {
        throw new Error("Failed to fetch suppliers");
      }
      return res.data.suppliers;
    },
    enabled: !!api && !!shopId,
  });
}

export function useCreateSupplier() {
  const { api, shopId } = useAppContext();

  return useMutation({
    mutationKey: ["create-product-supplier"],
    mutationFn: async (payload: SupplierFormPayload) => {
      const res = await api.post("/product-suppliers/suppliers", payload);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to create supplier");
      }
      return res.data;
    },
    onError: (error) => {
      toast.error(normalizeApiError(error, "Failed to create supplier"));
    },
  });
}

export function useUpdateSupplier() {
  const { api, shopId } = useAppContext();

  return useMutation({
    mutationKey: ["update-product-supplier"],
    mutationFn: async (payload: SupplierFormPayload) => {
      const res = await api.patch("/product-suppliers/suppliers", payload);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to update supplier");
      }
      return res.data;
    },
    onError: (error) => {
      toast.error(normalizeApiError(error, "Failed to update supplier"));
    },
  });
}

export function useDeleteSupplier() {
  const { api, shopId } = useAppContext();

  return useMutation({
    mutationKey: ["delete-product-supplier"],
    mutationFn: async (uid: string) => {
      const res = await api.delete("/product-suppliers/suppliers", {
        data: { uid },
      });
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to delete supplier");
      }
      return res.data;
    },
    onError: (error) => {
      toast.error(normalizeApiError(error, "Failed to delete supplier"));
    },
  });
}

export function useDeleteMultipleSuppliers() {
  const { api, shopId } = useAppContext();

  return useMutation({
    mutationKey: ["delete-multiple-product-suppliers"],
    mutationFn: async (uids: string[]) => {
      const res = await api.delete("/product-suppliers/suppliers/multiple", {
        data: { uids },
      });
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to delete suppliers");
      }
      return res.data;
    },
    onError: (error) => {
      toast.error(normalizeApiError(error, "Failed to delete suppliers"));
    },
  });
}

export function useGetSupplierProducts(supplierUid?: string) {
  const { api, shopId } = useAppContext();

  return useQuery({
    queryKey: ["supplier-products", shopId, supplierUid],
    queryFn: async () => {
      const res = await api.get<{ products: SupplierProduct[] }>(
        `/product-suppliers/suppliers/products?supplierUid=${supplierUid}`,
      );
      if (!res.data) {
        throw new Error("Failed to fetch supplier products");
      }
      return res.data.products;
    },
    enabled: !!api && !!shopId && !!supplierUid,
  });
}

export function useGetSupplierSourceProductsBySupplier(supplierUid?: string) {
  const { api, shopId } = useAppContext();

  return useQuery({
    queryKey: ["supplier-source-products-by-supplier", shopId, supplierUid],
    queryFn: async () => {
      const res = await api.get<SupplierSourceProductsResponse>(
        `/product-suppliers/suppliers/source-products?supplierUid=${supplierUid}`,
      );
      if (!res.data) {
        throw new Error("Failed to fetch supplier source products");
      }
      return res.data;
    },
    enabled: !!api && !!shopId && !!supplierUid,
  });
}

export function useImportSupplierProducts() {
  const { api, shopId } = useAppContext();

  return useMutation({
    mutationKey: ["import-supplier-products"],
    mutationFn: async (payload: {
      supplierUid: string;
      productIds: string[];
      marginType: SupplierMarginType;
      marginValue: number;
      categoryUid?: string | null;
    }) => {
      const res = await api.post(
        "/product-suppliers/suppliers/products/import",
        payload,
      );
      if (!res.data?.success) {
        throw new Error(
          res.data?.message || "Failed to import supplier products",
        );
      }
      return res.data;
    },
    onError: (error) => {
      toast.error(
        normalizeApiError(error, "Failed to import supplier products"),
      );
    },
  });
}

export function useSyncSupplierProducts() {
  const { api, shopId } = useAppContext();

  return useMutation({
    mutationKey: ["sync-supplier-products"],
    mutationFn: async (payload: {
      supplierUid: string;
      marginType: SupplierMarginType;
      marginValue: number;
    }) => {
      const res = await api.post(
        "/product-suppliers/suppliers/products/sync",
        payload,
      );
      if (!res.data?.success) {
        throw new Error(
          res.data?.message || "Failed to sync supplier products",
        );
      }
      return res.data;
    },
    onError: (error) => {
      toast.error(normalizeApiError(error, "Failed to sync supplier products"));
    },
  });
}
