"use client";

import { useAppContext } from "@/context/appContext";
import { Review } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateReviewProps {
  productUid: string;
  rating: number;
  title?: string;
  comment?: string;
}

export const useCreateReview = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createReview"],
    mutationFn: async (data: CreateReviewProps) => {
      const res = await api.post(`/reviews`, data);
      if (!res.data) throw new Error("Failed to create review");
      return res.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Review submitted successfully! Awaiting approval.");
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.productUid, shopId],
      });
      queryClient.invalidateQueries({
        queryKey: ["userReviews", shopId],
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to submit review");
      toast.error(errorMsg);
    },
  });
};

export const useGetProductReviews = (productUid: string) => {
  const { api, shopId } = useAppContext();
  return useQuery({
    queryKey: ["reviews", productUid, shopId],
    queryFn: async () => {
      const res = await api.get<{ data: Review[] }>(
        `/reviews/product/${productUid}?shopId=${shopId}`,
      );
      if (!res.data) throw new Error("Failed to fetch reviews");
      return res.data.data;
    },
    enabled: !!api && !!shopId && !!productUid,
  });
};

export const useGetUserReviews = () => {
  const { api, shopId } = useAppContext();
  return useQuery({
    queryKey: ["userReviews", shopId],
    queryFn: async () => {
      const res = await api.get<{ data: Review[] }>(`/reviews/user`);
      if (!res.data) throw new Error("Failed to fetch reviews");
      return res.data.data;
    },
    enabled: !!api && !!shopId,
  });
};

interface DeleteReviewProps {
  uid: string;
}

export const useDeleteReview = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteReview"],
    mutationFn: async (data: DeleteReviewProps) => {
      const res = await api.delete(`/reviews`, { data });
      if (!res.data) throw new Error("Failed to delete review");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Review deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["userReviews", shopId],
      });
      queryClient.invalidateQueries({
        queryKey: ["reviewsAdmin", shopId],
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to delete review");
      toast.error(errorMsg);
    },
  });
};

// Admin hooks
export const useGetAllReviews = () => {
  const { api, shopId } = useAppContext();
  return useQuery({
    queryKey: ["reviewsAdmin", shopId],
    queryFn: async () => {
      const res = await api.get<{ data: Review[] }>(`/reviews/admin/all`);
      if (!res.data) throw new Error("Failed to fetch reviews");
      return res.data.data;
    },
    enabled: !!api && !!shopId,
  });
};

interface ApproveReviewProps {
  uid: string;
}

export const useApproveReview = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["approveReview"],
    mutationFn: async (data: ApproveReviewProps) => {
      const res = await api.patch(`/reviews/approve`, data);
      if (!res.data) throw new Error("Failed to approve review");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Review approved successfully");
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reviewsAdmin", shopId],
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to approve review");
      toast.error(errorMsg);
    },
  });
};

interface DeleteReviewAdminProps {
  uid: string;
}

export const useDeleteReviewAdmin = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteReviewAdmin"],
    mutationFn: async (data: DeleteReviewAdminProps) => {
      const res = await api.delete(`/reviews/admin`, { data });
      if (!res.data) throw new Error("Failed to delete review");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Review deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reviewsAdmin", shopId],
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to delete review");
      toast.error(errorMsg);
    },
  });
};
