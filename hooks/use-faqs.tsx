"use client";

import { useAppContext } from "@/context/appContext";
import { Faq, FaqStatus } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateFaqProps {
  question: string;
  answer: string;
  slug: string;
  status?: FaqStatus;
  position?: number;
}

interface UpdateFaqProps {
  uid: string;
  question?: string;
  answer?: string;
  slug?: string;
  status?: FaqStatus;
  position?: number;
}

export function useGetFaqs() {
  const { api, shopId } = useAppContext();
  return useQuery({
    queryKey: ["faqs", shopId],
    queryFn: async () => {
      const res = await api.get<Faq[]>(`/faqs?shopId=${shopId}`);
      if (res.data && Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    },
    enabled: !!api && !!shopId,
  });
}

export function useGetFaqById(faqId: number) {
  const { api, shopId } = useAppContext();
  return useQuery({
    queryKey: ["faq", faqId, shopId],
    queryFn: async () => {
      const res = await api.get<{ faq: Faq }>(`/faqs/${faqId}?shopId=${shopId}`);
      if (!res.data?.faq) throw new Error("FAQ not found");
      return res.data.faq;
    },
    enabled: !!api && !!faqId && !!shopId,
  });
}

export function useCreateFaq() {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createFaq"],
    mutationFn: async (data: CreateFaqProps) => {
      if (!shopId) throw new Error("Shop ID is required");
      const response = await api.post("/faqs", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("FAQ created successfully");
      queryClient.invalidateQueries({ queryKey: ["faqs", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to create FAQ");
      toast.error(errorMsg);
    },
  });
}

export const useUpdateFaq = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateFaq"],
    mutationFn: async (data: UpdateFaqProps) => {
      const res = await api.patch(`/faqs`, data);
      if (!res.data) {
        throw new Error("Invalid response data");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("FAQ updated successfully");
      queryClient.invalidateQueries({ queryKey: ["faqs", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update FAQ");
      toast.error(errorMsg);
    },
  });
};

interface DeleteFaqProps {
  uid: string;
}

export function useDeleteSingleFaq() {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteSingleFaq"],
    mutationFn: async (data: DeleteFaqProps) => {
      const res = await api.delete(`/faqs`, { data });
      if (!res.data) {
        throw new Error("Invalid response data");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("FAQ deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["faqs", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to delete FAQ");
      toast.error(errorMsg);
    },
  });
}

interface DeleteFaqsProps {
  uids: string[];
}

export function useDeleteMultipleFaqs() {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteMultipleFaqs"],
    mutationFn: async (data: DeleteFaqsProps) => {
      const res = await api.delete(`/faqs/multiple`, { data });
      if (!res.data) {
        throw new Error("Invalid response data");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("FAQs deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["faqs", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to delete FAQs");
      toast.error(errorMsg);
    },
  });
}
