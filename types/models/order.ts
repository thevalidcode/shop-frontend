import { CurrencyCode } from "@/lib/currencyConverter";
import { Product } from "./product";
import { User } from "./user";
import { ShippingInfo } from "./shipping-info";
import { Payment } from "./payment";
import { ShipmentAdmin } from "./shipping";

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED"
  | "REFUNDED"
  | "IN_TRANSIT"
  | "FAILED_DELIVERY"
  | "VERIFYING_PAYMENT";

export interface OrderItem {
  id: number;
  orderUid: string;
  productUid: string;
  quantity: number;
  priceAtTimeOfPurchase: string;
  product: Product;
}

export interface Order {
  id: number;
  shopScopedId: number;
  uid: string;
  orderRef: string;
  shippingInfoUid: string;
  totalAmount: string;
  currency: CurrencyCode;
  status: OrderStatus;
  payment: Payment;
  trackingNumber?: string | null;
  notes?: string | null;
  supplierUid?: string | null;
  supplierOrderUid?: string | null;
  supplierPrice?: string | null;
  supplierCurrency?: CurrencyCode | null;
  syncWithSupplier?: boolean;
  items: OrderItem[];
  user: User;
  shippingInfo: ShippingInfo;
  shopId: number;
  estimatedDelivery?: Date | null;
  deliveredAt?: Date | null;
  shipment?: ShipmentAdmin | null;
  timestamp: string;
  updatedAt: string;
}
