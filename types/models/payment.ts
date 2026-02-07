import { CurrencyCode } from "@/lib/currencyConverter";
import { User } from "./user";
import { PaymentGateway } from "./paymentGateway";
import { Order } from "./order";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";
export type PaymentMethod = "PAYSTACK" | "FLUTTERWAVE" | "MANUAL";

export interface Payment {
  id: number;
  uid: string;
  userId: number;
  orderUid?: string | null;
  amount: string;
  chargedAmount?: string | null;
  currency: CurrencyCode;
  order: Order;
  method: PaymentMethod;
  paymentMethod: PaymentGateway;
  status: PaymentStatus;
  shopScopedId: number;
  shopId: number;
  shippingCost?: string | null;
  shippingCurrency?: string | null;
  selectedShippingRate?: any | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface PaymentFilters {
  status?: PaymentStatus;
  method?: PaymentMethod;
  search?: string;
}
