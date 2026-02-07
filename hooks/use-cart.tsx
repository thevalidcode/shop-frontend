"use client";

import { useAppContext } from "@/context/appContext";
import { Cart } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetCart = () => {
  const { api, userInfo } = useAppContext();
  return useQuery({
    queryKey: ["cart", userInfo?.uid],
    queryFn: async () => {
      const res = await api.get<Cart>(`/cart`);
      if (!res.data) throw new Error("Failed to fetch cart");
      return res.data;
    },
    enabled: !!api && !!userInfo?.uid,
  });
};

interface AddToCartProps {
  productUid: string;
  quantity: number;
}

export const useAddToCart = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addToCart"],
    mutationFn: async (data: AddToCartProps) => {
      const res = await api.post(`/cart/items`, data);
      if (!res.data) throw new Error("Failed to add item to cart");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Item added to cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to add item to cart");
      toast.error(errorMsg);
    },
  });
};

interface UpdateCartItemProps {
  itemId: string;
  quantity: number;
}

export const useUpdateCartItem = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateCartItem"],
    mutationFn: async ({ itemId, quantity }: UpdateCartItemProps) => {
      const res = await api.patch(`/cart/items/${itemId}`, { quantity });
      if (!res.data) throw new Error("Failed to update cart item");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Cart updated successfully");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update cart item");
      toast.error(errorMsg);
    },
  });
};

interface RemoveFromCartProps {
  itemId: string;
}

export const useRemoveFromCart = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["removeFromCart"],
    mutationFn: async ({ itemId }: RemoveFromCartProps) => {
      const res = await api.delete(`/cart/items/${itemId}`);
      if (!res.data) throw new Error("Failed to remove item from cart");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Item removed from cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to remove item from cart",
      );
      toast.error(errorMsg);
    },
  });
};
