// Enums
export type ShippingPlatform = "SENDBOX" | "SHIPPO";

export type ShipmentStatus =
  | "PENDING"
  | "PROCESSING"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED"
  | "CANCELED";

export type WeightUnit = "KG" | "G" | "LB" | "OZ";

// Models
export interface ShippingAccount {
  uid: string;
  shopId: number;
  platform: ShippingPlatform;
  isActive: boolean;
  isPreferred: boolean;
  connectionTestPassed: boolean;
  testConnectionDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentAdmin {
  uid: string;
  orderUid: string;
  platform: ShippingPlatform;
  status: ShipmentStatus;
  trackingNumber: string;
  labelUrl: string;
  shippingCost: string;
  currency: string;
  estimatedDelivery: string | null;
  deliveredAt: string | null;
  recipientAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  packageDetails: {
    weight: number;
    weightUnit: WeightUnit;
    length?: number;
    width?: number;
    height?: number;
    dimensionUnit?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentPublic {
  uid: string;
  orderUid: string;
  platform: ShippingPlatform;
  status: ShipmentStatus;
  trackingNumber: string;
  estimatedDelivery: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingEvent {
  uid: string;
  shipmentUid: string;
  status: string;
  location: string;
  description: string;
  createdAt: string;
}
