export type ShopStatus = "ACTIVE" | "CANCELED" | "DISABLED" | "EXPIRED";

export type ShopFeatures = {
  stores: number;
  products: number | null;
  analytics: boolean;
  custom_branding: boolean;
  priority_support: boolean;
  store_analytics: boolean;
  unlimited_products: boolean;
  hide_platform_banner: boolean;
  api_access: boolean;
  custom_domain: boolean;
  ai_features: boolean;
  customer_emails: boolean;
  free_ssl: boolean;
  available_templates: number;
  custom_templates: boolean;
  payment_gateways: number;
  default_template: boolean;
  staff_accounts: number;
  social_store_order_sync: boolean;
  social_store_service_sync: boolean;
  automated_shipping_allowed: boolean;
  max_shipping_accounts: number;
  [k: string]: any;
};

export interface Shop {
  shopId: number;
  uid: string;
  name: string;
  description?: string | null;
  status: ShopStatus;
  features: ShopFeatures;
  planId?: number | null;
  createdAt: string;
  updatedAt: string;
  settings?: {
    currency?: string;
    language?: string;
    timezone?: string;
    [k: string]: any;
  };
}
