"use client";

import { useAppContext } from "@/context/appContext";
import { CollectionName } from "@/types";
import { UploadLog } from "@/types/models/upload-log";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface UploadImageProps {
  file: File; // the image
  collection: CollectionName;
}

export function useUploadImage() {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["uploadImage", shopId],

    mutationFn: async ({ file, collection }: UploadImageProps) => {
      if (!shopId) throw new Error("Shop ID is missing");

      // Build the multipart form
      const formData = new FormData();
      formData.append("image", file);
      formData.append("collection", collection);

      const res = await api.post(`/files/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res.data) {
        throw new Error("Invalid server response");
      }

      return res.data;
    },
    onSuccess: (file) => {
      queryClient.invalidateQueries({
        queryKey: ["previousImages", shopId, file.collection],
      });
    },

    onError: (error) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to upload image"
      );
      toast.error(errorMsg);
    },
  });
}

// Batch upload multiple images
export interface UploadImagesBatchProps {
  files: File[];
  collection: CollectionName;
}

export interface UploadResultItem {
  filename: string;
  url: string;
  collection: CollectionName;
  status: "success" | "already_exists" | "failed";
}

export interface UploadImagesBatchResponse {
  message: string;
  successful: number;
  total: number;
  uploads: UploadResultItem[];
  errors?: Array<{ filename: string; error: string }>;
}

export function useUploadImagesBatch() {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["uploadImagesBatch", shopId],
    mutationFn: async ({ files, collection }: UploadImagesBatchProps) => {
      if (!shopId) throw new Error("Shop ID is missing");

      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      formData.append("collection", collection);

      const res = await api.post<UploadImagesBatchResponse>("/files/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res.data) {
        throw new Error("Invalid server response");
      }

      return res.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate previous images cache for this collection
      queryClient.invalidateQueries({
        queryKey: ["previousImages", shopId, variables.collection],
      });
    },
    onError: (error) => {
      const errorMsg = normalizeApiError(error, "Failed to upload images");
      toast.error(errorMsg);
    },
  });
}

export const usePreviousImages = (collection: CollectionName) => {
  const { api, shopId } = useAppContext();

  return useQuery<UploadLog[]>({
    queryKey: ["previousImages", shopId, collection],
    queryFn: async () => {
      const res = await api.get<{ images: UploadLog[] }>(
        `/files/image/logs?collection=${collection}`
      );
      if (!res.data) throw new Error("Failed to fetch previous images");
      return res.data.images;
    },
    enabled: !!api && !!shopId,
  });
};
