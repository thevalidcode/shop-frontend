"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppContext } from "@/context/appContext";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import {
  ShippingAccount,
  ShipmentAdmin,
  ShipmentPublic,
  TrackingEvent,
  ShippingPlatform,
  ShipmentStatus,
} from "@/types";

// ============================================
// ADMIN HOOKS - Shipping Accounts
// ============================================

interface ConnectAccountResponse {
  message: string;
  account: ShippingAccount;
}

interface ConnectShippingAccountRequest {
  platform: ShippingPlatform;
  apiKey: string;
  testMode?: boolean;
  webhookSecret?: string;
}

export const useConnectShippingAccount = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["connectShippingAccount"],
    mutationFn: async (data: ConnectShippingAccountRequest) => {
      const res = await api.post<ConnectAccountResponse>(
        `/shipping/admin/accounts`,
        data
      );
      if (!res.data) throw new Error("No response data");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Shipping account connected successfully");
      queryClient.invalidateQueries({ queryKey: ["shippingAccounts", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to connect shipping account"
      );
      toast.error(errorMsg);
    },
  });
};

interface GetAccountsResponse {
  accounts: ShippingAccount[];
}

export const useGetShippingAccounts = () => {
  const { api, shopId } = useAppContext();

  return useQuery({
    queryKey: ["shippingAccounts", shopId],
    queryFn: async () => {
      const res = await api.get<GetAccountsResponse>(
        `/shipping/admin/accounts`
      );
      if (!res.data) throw new Error("No response data");
      return res.data.accounts;
    },
    enabled: !!api && !!shopId,
  });
};

interface UpdateShippingAccountRequest {
  isActive?: boolean;
  isPreferred?: boolean;
  testMode?: boolean;
  webhookSecret?: string;
}

interface UpdateAccountResponse {
  message: string;
  account: ShippingAccount;
}

export const useUpdateShippingAccount = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateShippingAccount"],
    mutationFn: async ({
      accountUid,
      data,
    }: {
      accountUid: string;
      data: UpdateShippingAccountRequest;
    }) => {
      const res = await api.patch<UpdateAccountResponse>(
        `/shipping/admin/accounts/${accountUid}`,
        data
      );
      if (!res.data) throw new Error("No response data");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Shipping account updated successfully");
      queryClient.invalidateQueries({ queryKey: ["shippingAccounts", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to update shipping account"
      );
      toast.error(errorMsg);
    },
  });
};

interface DisconnectAccountResponse {
  message: string;
}

export const useDisconnectShippingAccount = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["disconnectShippingAccount"],
    mutationFn: async (accountUid: string) => {
      const res = await api.delete<DisconnectAccountResponse>(
        `/shipping/admin/accounts/${accountUid}`
      );
      if (!res.data) throw new Error("No response data");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Shipping account disconnected successfully");
      queryClient.invalidateQueries({ queryKey: ["shippingAccounts", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to disconnect shipping account"
      );
      toast.error(errorMsg);
    },
  });
};

// ============================================
// ADMIN HOOKS - Shipments
// ============================================

interface CreateShipmentRequest {
  orderUid: string;
  weight: number;
  weightUnit: string;
  platformOverride?: ShippingPlatform;
}

interface CreateShipmentResponse {
  message: string;
  shipment: ShipmentAdmin;
}

export const useCreateShipment = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createShipment"],
    mutationFn: async (data: CreateShipmentRequest) => {
      const res = await api.post<CreateShipmentResponse>(
        `/shipping/admin/shipments`,
        data
      );
      if (!res.data) throw new Error("No response data");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Shipment created successfully");
      queryClient.invalidateQueries({ queryKey: ["adminShipments", shopId] });
      queryClient.invalidateQueries({ queryKey: ["adminOrders", shopId] });
      queryClient.invalidateQueries({ queryKey: ["adminOrder"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to create shipment");
      toast.error(errorMsg);
    },
  });
};

interface BulkCreateShipmentsRequest {
  orderUids: string[];
  weight: number;
  weightUnit: string;
  platformOverride?: ShippingPlatform;
}

interface BulkCreateShipmentsResponse {
  message: string;
  results: {
    success: Array<{
      orderUid: string;
      shipment: ShipmentAdmin;
    }>;
    failed: Array<{
      orderUid: string;
      error: string;
    }>;
  };
}

export const useBulkCreateShipments = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["bulkCreateShipments"],
    mutationFn: async (data: BulkCreateShipmentsRequest) => {
      const res = await api.post<BulkCreateShipmentsResponse>(
        `/shipping/admin/shipments/bulk`,
        data
      );
      if (!res.data) throw new Error("No response data");
      return res.data;
    },
    onSuccess: (data) => {
      const successCount = data.results.success.length;
      const failedCount = data.results.failed.length;
      toast.success(`Created ${successCount} shipments, ${failedCount} failed`);
      queryClient.invalidateQueries({ queryKey: ["adminShipments", shopId] });
      queryClient.invalidateQueries({ queryKey: ["adminOrders", shopId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to bulk create shipments"
      );
      toast.error(errorMsg);
    },
  });
};

interface GetShipmentsParams {
  page?: number;
  limit?: number;
  status?: ShipmentStatus;
  platform?: ShippingPlatform;
  startDate?: string;
  endDate?: string;
}

interface GetShipmentsResponse {
  shipments: ShipmentAdmin[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

export const useGetAdminShipments = (params?: GetShipmentsParams) => {
  const { api, shopId } = useAppContext();

  return useQuery({
    queryKey: ["adminShipments", shopId, params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.status) queryParams.append("status", params.status);
      if (params?.platform) queryParams.append("platform", params.platform);
      if (params?.startDate) queryParams.append("startDate", params.startDate);
      if (params?.endDate) queryParams.append("endDate", params.endDate);

      const res = await api.get<GetShipmentsResponse>(
        `/shipping/admin/shipments?${queryParams.toString()}`
      );
      if (!res.data) throw new Error("No response data");
      return res.data;
    },
    enabled: !!api && !!shopId,
  });
};

// ============================================
// USER HOOKS - Shipment Tracking
// ============================================

interface GetShipmentResponse {
  shipment: ShipmentPublic;
}

export const useGetShipmentByOrder = (orderUid: string) => {
  const { api, userInfo } = useAppContext();

  return useQuery({
    queryKey: ["shipment", orderUid],
    queryFn: async () => {
      const res = await api.get<GetShipmentResponse>(
        `/shipping/orders/${orderUid}/shipment`
      );
      if (!res.data) throw new Error("No response data");
      return res.data.shipment;
    },
    enabled: !!api && !!userInfo?.uid && !!orderUid,
  });
};

interface GetTrackingEventsResponse {
  events: TrackingEvent[];
}

export const useGetTrackingEvents = (shipmentUid: string) => {
  const { api, userInfo } = useAppContext();

  return useQuery({
    queryKey: ["trackingEvents", shipmentUid],
    queryFn: async () => {
      const res = await api.get<GetTrackingEventsResponse>(
        `/shipping/shipments/${shipmentUid}/tracking`
      );
      if (!res.data) throw new Error("No response data");
      return res.data.events;
    },
    enabled: !!api && !!userInfo?.uid && !!shipmentUid,
  });
};

// ============================================
// USER HOOKS - Shipping Rates
// ============================================

export interface ShippingRate {
  courierName: string;
  courierCode: string;
  serviceName: string;
  serviceCode: string;
  cost: number;
  currency: string;
  estimatedDays?: number;
  estimatedDelivery?: string;
  baseFee: number;
  taxAmount?: number;
  insuranceFee?: number;
  accountUid: string;
  platform: ShippingPlatform;
  rateId: string;
  metadata?: any;
}

interface GetShippingRatesResponse {
  success: boolean;
  rates: ShippingRate[];
  count: number;
}

export const useGetShippingRates = (
  cartUid: string,
  billingInfoUid: string,
  platform?: ShippingPlatform
) => {
  const { api, userInfo } = useAppContext();

  return useQuery({
    queryKey: ["shippingRates", cartUid, billingInfoUid, platform],
    queryFn: async () => {
      const params = new URLSearchParams({
        cartUid,
        billingInfoUid,
        ...(platform && { platform }),
      });

      const res = await api.get<GetShippingRatesResponse>(
        `/shipping/rates?${params.toString()}`
      );
      if (!res.data) throw new Error("Failed to fetch shipping rates");
      return res.data;
    },
    enabled: !!api && !!userInfo?.uid && !!cartUid && !!billingInfoUid,
  });
};

interface ShippingMethod {
  uid: string;
  platform: ShippingPlatform;
  name: string;
  isPreferred: boolean;
  testMode: boolean;
}

interface GetShippingMethodsResponse {
  success: boolean;
  methods: ShippingMethod[];
  hasShipping: boolean;
}

export const useGetShippingMethods = () => {
  const { api, shopId } = useAppContext();

  return useQuery({
    queryKey: ["shippingMethods", shopId],
    queryFn: async () => {
      const res = await api.get<GetShippingMethodsResponse>(
        `/shipping/methods`
      );
      if (!res.data) throw new Error("Failed to fetch shipping methods");
      return res.data;
    },
    enabled: !!api && !!shopId,
  });
};
