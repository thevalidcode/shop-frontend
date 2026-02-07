"use client";

import { useAppContext } from "@/context/appContext";
import { Order, OrderStatus } from "@/types/models/order";
import { PaymentStatus } from "@/types/models/payment";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetUserOrders = () => {
  const { api, userInfo } = useAppContext();

  return useQuery({
    queryKey: ["userOrders", userInfo?.uid],
    queryFn: async () => {
      const res = await api.get<Order[]>(`/orders`);
      if (!res.data) throw new Error("Failed to fetch orders");
      return res.data;
    },
    enabled: !!api && !!userInfo?.uid,
  });
};

export const useGetUserOrderByStatus = (status: OrderStatus) => {
  const { api, userInfo } = useAppContext();

  return useQuery({
    queryKey: ["userOrders", userInfo?.uid, status],
    queryFn: async () => {
      const res = await api.get<Order[]>(`/orders/status/${status}`);
      if (!res.data) throw new Error("Failed to fetch orders");
      return res.data;
    },
    enabled: !!api && !!userInfo?.uid,
  });
};

export const useGetOrdersByStatus = (status: OrderStatus) => {
  const { api, adminInfo } = useAppContext();

  return useQuery({
    queryKey: ["userOrders", status],
    queryFn: async () => {
      const res = await api.get<Order[]>(`/orders/admin/status/${status}`);
      if (!res.data) throw new Error("Failed to fetch orders");
      return res.data;
    },
    enabled: !!api && !!adminInfo?.uid,
  });
};

export const useGetUserOrderByUid = (orderUid: string) => {
  const { api, userInfo } = useAppContext();

  return useQuery({
    queryKey: ["userOrder", orderUid],
    queryFn: async () => {
      const res = await api.get<Order>(`/orders/${orderUid}`);
      if (!res.data) throw new Error("Failed to fetch order");
      return res.data;
    },
    enabled: !!api && !!userInfo?.uid && !!orderUid,
  });
};

export const useGetAdminOrders = () => {
  const { api, shopId } = useAppContext();

  return useQuery({
    queryKey: ["adminOrders", shopId],
    queryFn: async () => {
      const res = await api.get<Order[]>(`/orders/admin/all`);
      if (!res.data) throw new Error("Failed to fetch orders");
      return res.data;
    },
    enabled: !!api && !!shopId,
  });
};

export const useGetAdminOrderByUid = (orderUid: string) => {
  const { api } = useAppContext();

  return useQuery({
    queryKey: ["adminOrder", orderUid],
    queryFn: async () => {
      const res = await api.get<Order>(`/orders/admin/${orderUid}`);
      if (!res.data) throw new Error("Failed to fetch order");
      return res.data;
    },
    enabled: !!api && !!orderUid,
  });
};

interface UpdateOrderProps {
  status?: OrderStatus;
  trackingNumber?: string | null;
  estimatedDelivery?: Date | null;
  notes?: string | null;
  received?: boolean;
  orderUid: string;
}

export const useUpdateOrder = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateOrder"],
    mutationFn: async (data: UpdateOrderProps) => {
      if (!data.orderUid) throw new Error("Missing order UID");

      const res = await api.patch(`/orders/admin/${data.orderUid}`, data);
      if (!res.data) throw new Error("Failed to update order");

      return res.data;
    },
    onSuccess: () => {
      toast.success("Order updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminOrders", shopId] });
      queryClient.invalidateQueries({ queryKey: ["adminOrder"] });
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update order");
      toast.error(errorMsg);
    },
  });
};

export const useDeleteOrder = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteOrder"],
    mutationFn: async (orderUid: string) => {
      if (!orderUid) throw new Error("Missing order UID");

      const res = await api.delete(`/orders/admin/${orderUid}`);
      if (!res.data) throw new Error("Failed to delete order");

      return res.data;
    },
    onSuccess: () => {
      toast.success("Order deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adminOrders", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to delete order");
      toast.error(errorMsg);
    },
  });
};

interface BulkUpdateOrdersProps {
  orderUids: string[];
  status?: OrderStatus;
}

export const useBulkUpdateOrders = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["bulkUpdateOrders"],
    mutationFn: async (data: BulkUpdateOrdersProps) => {
      const res = await api.post(`/orders/admin/bulk-update`, data);
      if (!res.data) throw new Error("Failed to bulk update orders");

      return res.data;
    },
    onSuccess: () => {
      toast.success("Orders updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminOrders", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to bulk update orders");
      toast.error(errorMsg);
    },
  });
};

// Cancel order (user)
export const useCancelOrder = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["cancelOrder"],
    mutationFn: async (orderUid: string) => {
      const res = await api.patch(`/orders/${orderUid}/cancel-request`);
      if (!res.data) throw new Error("Failed to cancel order");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Order canceled successfully");
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
      queryClient.invalidateQueries({ queryKey: ["userOrder"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to cancel order");
      toast.error(errorMsg);
    },
  });
};

// Request refund (user)
export const useRequestRefund = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["requestRefund"],
    mutationFn: async ({
      orderUid,
      reason,
    }: {
      orderUid: string;
      reason: string;
    }) => {
      const res = await api.post(`/orders/${orderUid}/refund-request`, {
        reason,
      });
      if (!res.data) throw new Error("Failed to request refund");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Refund request submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
      queryClient.invalidateQueries({ queryKey: ["userOrder"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to request refund");
      toast.error(errorMsg);
    },
  });
};

// Update order billing info (user)
export const useUpdateOrderBilling = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateOrderBilling"],
    mutationFn: async ({
      orderUid,
      billingInfoUid,
    }: {
      orderUid: string;
      billingInfoUid: string;
    }) => {
      const res = await api.patch(`/orders/${orderUid}/billing`, {
        billingInfoUid,
      });
      if (!res.data) throw new Error("Failed to update billing info");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Billing information updated successfully");
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
      queryClient.invalidateQueries({ queryKey: ["userOrder"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to update billing info",
      );
      toast.error(errorMsg);
    },
  });
};

// Update order by user (notes, mark as received)
export const useUpdateUserOrder = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateUserOrder"],
    mutationFn: async ({
      orderUid,
      notes,
      received,
    }: {
      orderUid: string;
      notes?: string;
      received?: boolean;
    }) => {
      const res = await api.patch(`/orders/${orderUid}`, {
        notes,
        received,
      });
      if (!res.data) throw new Error("Failed to update order");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Order updated successfully");
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
      queryClient.invalidateQueries({ queryKey: ["userOrder"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update order");
      toast.error(errorMsg);
    },
  });
};

// Verify payment (admin)
export const useVerifyPayment = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["verifyPayment"],
    mutationFn: async ({
      orderUid,
      verified,
    }: {
      orderUid: string;
      verified: boolean;
    }) => {
      const res = await api.post(`/orders/admin/${orderUid}/verify-payment`, {
        verified,
      });
      if (!res.data) throw new Error("Failed to verify payment");
      return res.data;
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.verified
          ? "Payment verified successfully"
          : "Payment verification rejected",
      );
      queryClient.invalidateQueries({ queryKey: ["adminOrders", shopId] });
      queryClient.invalidateQueries({ queryKey: ["adminOrder"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to verify payment");
      toast.error(errorMsg);
    },
  });
};
