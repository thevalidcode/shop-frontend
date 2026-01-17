export const Plans = {
  FREE: "Free",
  ESSENTIALS: "Essentials",
  PRO: "Pro",
  BUSINESS: "Business",
  EMPIRE: "Empire",
} as const;

export type Plan = (typeof Plans)[keyof typeof Plans];

export const PlanConfig: Record<Plan, Record<string, unknown>> = {
  Free: {
    max_stores: 1,
    max_products: 200,
    custom_domain: false,
    gateways: 2,
    ai_suite: false,
    analytics: "none",
    staff_accounts: 0,
  },
  Essentials: {
    max_stores: 2,
    max_products: 1000,
    custom_domain: true,
    gateways: 10,
    ai_suite: false,
    analytics: "basic",
    staff_accounts: 0,
  },
  Pro: {
    max_stores: 5,
    max_products: 5000,
    custom_domain: true,
    gateways: 25,
    ai_suite: "basic",
    analytics: "advanced",
    staff_accounts: 0,
  },
  Business: {
    max_stores: 10,
    max_products: Infinity,
    custom_domain: true,
    gateways: 50,
    ai_suite: "advanced",
    analytics: "advanced",
    staff_accounts: 0,
  },
  Empire: {
    max_stores: Infinity,
    max_products: Infinity,
    custom_domain: true,
    gateways: 100,
    ai_suite: "full",
    analytics: "business",
    staff_accounts: 10,
  },
};
