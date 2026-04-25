export type PaymentGatewayStatus = "ACTIVE" | "INACTIVE";
export type PaymentGatewayPlatform =
  | "PAYSTACK"
  | "FLUTTERWAVE"
  | "STRIPE"
  | "MANUAL"
  | "CREDIT";

export interface PaymentGateway {
  id: number;
  shopScopedId: number;
  uid: string;
  platform: PaymentGatewayPlatform;
  name: string;
  description?: string | null;
  content?: string | null;
  secretKey?: string | null;
  webhookUrl?: string | null;
  feePercent?: number;
  status: PaymentGatewayStatus;
  createdAt: string;
  updatedAt: string;
  position?: number;
  min?: string | null;
  max?: string | null;
  currency?: string;
  shopId: number;
}

export interface PaymentGatewayPublic extends Omit<
  PaymentGateway,
  "secretKey"
> {}

// For creating/editing payment gateways (allows undefined for optional fields)
export type NewPaymentGateway = Omit<
  PaymentGateway,
  "id" | "shopScopedId" | "createdAt" | "updatedAt" | "shopId"
> & {
  id?: number;
  shopScopedId?: number;
  uid?: string;
  shopId?: number;
  description?: string;
  content?: string;
  secretKey?: string;
  webhookUrl?: string;
  min?: string;
  max?: string;
};
