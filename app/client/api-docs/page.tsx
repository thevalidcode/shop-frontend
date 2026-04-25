"use client";

import { motion } from "framer-motion";
import {
  Code2,
  KeyRound,
  ShieldCheck,
  TerminalSquare,
  Workflow,
} from "lucide-react";

import Loading from "@/app/loading";
import { FeatureGate } from "@/components/FeatureGate";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppContext } from "@/context/appContext";
import { CartDrawer } from "../products/components/CartDrawer";

type FieldType = "string" | "number" | "boolean" | "uuid" | "object";

type ApiField = {
  name: string;
  type: FieldType;
  required: boolean;
  description: string;
};

type ApiEndpointDoc = {
  title: string;
  action: string;
  description: string;
  fields: ApiField[];
  requestExample: Record<string, unknown>;
  responseExample: unknown;
};

const endpoints: ApiEndpointDoc[] = [
  {
    title: "Products",
    action: "products",
    description: "Returns active catalog items sorted by position.",
    fields: [
      {
        name: "key",
        type: "uuid",
        required: true,
        description: "Your API key from profile settings.",
      },
      {
        name: "action",
        type: "string",
        required: true,
        description: "Must be 'products'.",
      },
    ],
    requestExample: {
      key: "8ac6b4ec-f5cb-4f08-b8db-3f8f88565cb9",
      action: "products",
    },
    responseExample: {
      data: [
        {
          uid: "841f8ca6-324f-4f31-b82d-94c6dd15f4f8",
          shopScopedId: 12,
          name: "Wireless Bluetooth Speaker",
          slug: "wireless-bluetooth-speaker",
          description: "Portable speaker with rich sound and long battery life.",
          shortDescription: "Compact speaker for everyday listening.",
          min: 50,
          max: 500,
          price: "49.99",
          comparePrice: "59.99",
          currency: "USD",
          stock: 128,
          imageUrl: "https://cdn.example.com/products/speaker-main.jpg",
          galleryUrls: [
            "https://cdn.example.com/products/speaker-main.jpg",
            "https://cdn.example.com/products/speaker-side.jpg",
          ],
          status: "ACTIVE",
          variants: [
            {
              uid: "1f6b4d0e-4f9a-4e1f-b58c-2e6e3f7f2c11",
              name: "Black / Standard",
              price: "49.99",
              comparePrice: "59.99",
              stock: 64,
              sku: "SPK-BLK-STD",
              imageUrl: "https://cdn.example.com/products/speaker-main.jpg",
              isDefault: true,
            },
          ],
          images: [
            {
              uid: "2a1f4d82-2f77-4f77-9f1e-2df4d1f9b301",
              imageUrl: "https://cdn.example.com/products/speaker-main.jpg",
              altText: "Wireless Bluetooth Speaker",
              position: 1,
              isPrimary: true,
            },
          ],
          reviews: [
            {
              uid: "9e4b1d3a-4fd8-4f6c-8b5d-1b6f0f8a5c91",
              rating: 5,
              title: "Clear sound and solid battery",
              comment: "Works well for my desk setup and charges quickly.",
              isVerified: true,
              timestamp: "2026-04-12T09:18:11.220Z",
              user: {
                uid: "f0a3d21a-9cdd-43f6-9db3-6ef7bf2b81ab",
                username: "chrisj",
                fullName: "Chris Johnson",
              },
            },
          ],
        },
      ],
    },
  },
  {
    title: "Create",
    action: "create",
    description:
      "Initializes checkout for the current cart. redirectUrl is generated on the server automatically.",
    fields: [
      {
        name: "key",
        type: "uuid",
        required: true,
        description: "Your API key.",
      },
      {
        name: "action",
        type: "string",
        required: true,
        description: "Must be 'create'.",
      },
      {
        name: "platform",
        type: "string",
        required: false,
        description:
          "Payment platform enum, e.g. PAYSTACK/FLUTTERWAVE/MANUAL. Optional when useBalance=true or when default gateway is configured.",
      },
      {
        name: "currency",
        type: "string",
        required: false,
        description:
          "3-letter ISO code (USD, NGN, EUR). Optional and falls back to your account currency.",
      },
      {
        name: "cartUid",
        type: "uuid",
        required: true,
        description: "Cart identifier to convert into an order.",
      },
      {
        name: "shippingInfoUid",
        type: "uuid",
        required: true,
        description: "Saved shipping information reference.",
      },
      {
        name: "useBalance",
        type: "boolean",
        required: false,
        description: "Set true to pay directly from wallet balance.",
      },
      {
        name: "selectedShippingRate",
        type: "object",
        required: false,
        description:
          "Provider quote payload from shipping_quote. The backend revalidates and computes shipping internally.",
      },
      {
        name: "notes",
        type: "string",
        required: false,
        description: "Additional delivery or fulfillment note.",
      },
    ],
    requestExample: {
      key: "8ac6b4ec-f5cb-4f08-b8db-3f8f88565cb9",
      action: "create",
      platform: "PAYSTACK",
      currency: "USD",
      cartUid: "dcd7dc8a-1e9a-4f8e-9f5d-c56f21d5e5a7",
      shippingInfoUid: "a6ef0b18-9d09-4672-a339-2cd6a3d1f9a0",
      useBalance: false,
      selectedShippingRate: {
        serviceCode: "express",
        provider: "SHIPPO",
      },
      notes: "Leave at front desk",
    },
    responseExample: {
        data: {
          url: "https://checkout.paystack.com/9v8n8z8w",
          message: "Checkout link generated",
        },
    },
  },
  {
    title: "Cart",
    action: "cart",
    description:
      "Creates (or reuses) the authenticated cart and optionally adds products with quantities.",
    fields: [
      {
        name: "key",
        type: "uuid",
        required: true,
        description: "Your API key.",
      },
      {
        name: "action",
        type: "string",
        required: true,
        description: "Must be 'cart'.",
      },
      {
        name: "items",
        type: "object",
        required: false,
        description:
          "Optional array: [{ productUid: uuid, quantity: number }]. Existing quantities are incremented.",
      },
    ],
    requestExample: {
      key: "8ac6b4ec-f5cb-4f08-b8db-3f8f88565cb9",
      action: "cart",
      items: [
        {
          productUid: "841f8ca6-324f-4f31-b82d-94c6dd15f4f8",
          quantity: 2,
        },
      ],
    },
    responseExample: {
      data: {
        uid: "dcd7dc8a-1e9a-4f8e-9f5d-c56f21d5e5a7",
        itemCount: 1,
        items: [
          {
            productUid: "841f8ca6-324f-4f31-b82d-94c6dd15f4f8",
            quantity: 2,
          },
        ],
      },
    },
  },
  {
    title: "Shipping Quote",
    action: "shipping_quote",
    description:
      "Returns delivery rate quotes for a cart + shipping info and includes selectedShippingRate payload you can reuse in create.",
    fields: [
      {
        name: "key",
        type: "uuid",
        required: true,
        description: "Your API key.",
      },
      {
        name: "action",
        type: "string",
        required: true,
        description: "Must be 'shipping_quote'.",
      },
      {
        name: "cartUid",
        type: "uuid",
        required: true,
        description: "Cart UID returned by cart action or cart endpoint.",
      },
      {
        name: "shippingInfoUid",
        type: "uuid",
        required: true,
        description: "Shipping info UID for destination address.",
      },
      {
        name: "platform",
        type: "string",
        required: false,
        description: "Optional provider filter (SENDBOX or SHIPPO).",
      },
    ],
    requestExample: {
      key: "8ac6b4ec-f5cb-4f08-b8db-3f8f88565cb9",
      action: "shipping_quote",
      cartUid: "dcd7dc8a-1e9a-4f8e-9f5d-c56f21d5e5a7",
      shippingInfoUid: "a6ef0b18-9d09-4672-a339-2cd6a3d1f9a0",
      platform: "SHIPPO",
    },
    responseExample: {
      data: [
        {
          provider: "SHIPPO",
          serviceName: "Express Delivery",
          serviceCode: "express",
          cost: 3.5,
          currency: "USD",
          estimatedDays: 2,
          selectedShippingRate: {
            provider: "SHIPPO",
            accountUid: "19ce7a0f-64fc-4f1d-b2bd-7b8e18af4e79",
            courierName: "DHL",
            serviceName: "Express Delivery",
            serviceCode: "express",
            rateId: "rate_123",
            cost: 3.5,
            currency: "USD",
            estimatedDays: 2,
          },
        },
      ],
    },
  },
  {
    title: "Shipping Methods",
    action: "shipping_methods",
    description:
      "Lists available shipping providers for the shop with only public, non-sensitive fields.",
    fields: [
      {
        name: "key",
        type: "uuid",
        required: true,
        description: "Your API key.",
      },
      {
        name: "action",
        type: "string",
        required: true,
        description: "Must be 'shipping_methods'.",
      },
    ],
    requestExample: {
      key: "8ac6b4ec-f5cb-4f08-b8db-3f8f88565cb9",
      action: "shipping_methods",
    },
    responseExample: {
      data: [
        {
          uid: "19ce7a0f-64fc-4f1d-b2bd-7b8e18af4e79",
          platform: "SHIPPO",
          name: "Shippo Standard Shipping",
          isPreferred: true,
          testMode: false,
        },
      ],
    },
  },
  {
    title: "Shipping Info",
    action: "shipping_info",
    description:
      "Manages saved shipping information. Use operation=list to fetch, operation=delete to remove one, and operation=set_default to mark one as default.",
    fields: [
      {
        name: "key",
        type: "uuid",
        required: true,
        description: "Your API key.",
      },
      {
        name: "action",
        type: "string",
        required: true,
        description: "Must be 'shipping_info'.",
      },
      {
        name: "operation",
        type: "string",
        required: false,
        description: "Optional operation: list (default), delete, set_default.",
      },
      {
        name: "shippingInfoUid",
        type: "uuid",
        required: false,
        description: "Required when operation is delete or set_default.",
      },
    ],
    requestExample: {
      key: "8ac6b4ec-f5cb-4f08-b8db-3f8f88565cb9",
      action: "shipping_info",
      operation: "set_default",
      shippingInfoUid: "a6ef0b18-9d09-4672-a339-2cd6a3d1f9a0",
    },
    responseExample: {
      data: {
        success: "Default shipping information updated successfully",
        shippingInfo: {
          uid: "a6ef0b18-9d09-4672-a339-2cd6a3d1f9a0",
          fullName: "Amina Yusuf",
          email: "amina@example.com",
          phone: "+1 555-0100",
          address: "45 Market Street",
          city: "Lagos",
          state: "LA",
          postalCode: "100001",
          country: "US",
          isDefault: true,
        },
      },
    },
  },
  {
    title: "Create Shipping Info",
    action: "create_shipping_info",
    description:
      "Creates a new saved shipping information record for the authenticated API user.",
    fields: [
      {
        name: "key",
        type: "uuid",
        required: true,
        description: "Your API key.",
      },
      {
        name: "action",
        type: "string",
        required: true,
        description: "Must be 'create_shipping_info'.",
      },
      {
        name: "fullName",
        type: "string",
        required: true,
        description: "Recipient full name.",
      },
      {
        name: "email",
        type: "string",
        required: true,
        description: "Recipient email address.",
      },
      {
        name: "phone",
        type: "string",
        required: true,
        description: "Recipient phone number.",
      },
      {
        name: "address",
        type: "string",
        required: true,
        description: "Street address.",
      },
      {
        name: "city",
        type: "string",
        required: true,
        description: "City or locality.",
      },
      {
        name: "state",
        type: "string",
        required: true,
        description: "State or region.",
      },
      {
        name: "postalCode",
        type: "string",
        required: true,
        description: "Postal/ZIP code.",
      },
      {
        name: "country",
        type: "string",
        required: true,
        description: "Country code or country name.",
      },
      {
        name: "isDefault",
        type: "boolean",
        required: false,
        description: "Set true to make the new record default.",
      },
    ],
    requestExample: {
      key: "8ac6b4ec-f5cb-4f08-b8db-3f8f88565cb9",
      action: "create_shipping_info",
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+1 555-0100",
      address: "123 Main St",
      city: "Austin",
      state: "TX",
      postalCode: "78701",
      country: "US",
      isDefault: true,
    },
    responseExample: {
      data: {
        success: "Shipping address saved successfully",
        shippingInfo: {
          uid: "a6ef0b18-9d09-4672-a339-2cd6a3d1f9a0",
          fullName: "Amina Yusuf",
          email: "amina@example.com",
          phone: "+1 555-0100",
          address: "45 Market Street",
          city: "Lagos",
          state: "LA",
          postalCode: "100001",
          country: "US",
          isDefault: true,
        },
      },
    },
  },
  {
    title: "Orders",
    action: "orders",
    description:
      "Returns the authenticated user orders with shipment details and tracking events. Include orderUid for one specific order.",
    fields: [
      {
        name: "key",
        type: "uuid",
        required: true,
        description: "Your API key.",
      },
      {
        name: "action",
        type: "string",
        required: true,
        description: "Must be 'orders'.",
      },
      {
        name: "orderUid",
        type: "uuid",
        required: false,
        description: "Optional order reference for single-item lookup.",
      },
    ],
    requestExample: {
      key: "8ac6b4ec-f5cb-4f08-b8db-3f8f88565cb9",
      action: "orders",
    },
    responseExample: {
      data: [
        {
          uid: "2fb40490-b57b-4965-84bd-a0f07fbb4c8e",
          order: 103,
          orderRef: "ORD-10-103",
          charge: 12.99,
          currency: "USD",
          status: "PENDING",
          trackingNumber: "1Z999AA10123456784",
          estimatedDelivery: "2026-04-14T00:00:00.000Z",
          deliveredAt: null,
          supplierOrderUid: "a1b2c3d4-order-id",
          syncWithSupplier: true,
          shippingCost: 3.5,
          shippingCurrency: "USD",
          selectedShippingRate: {
            provider: "SHIPPO",
            serviceCode: "express",
            cost: 3.5,
            currency: "USD",
          },
          shippingInfoUid: "a6ef0b18-9d09-4672-a339-2cd6a3d1f9a0",
          paymentUid: "ac13843a-9c6f-49bf-aaf7-a40ec9ea6f66",
          notes: "Deliver between 9am and 5pm.",
          shipment: {
            uid: "205c4c96-d0e8-4be5-bd8a-d2c2b903a262",
            platform: "SHIPPO",
            status: "IN_TRANSIT",
            trackingNumber: "1Z999AA10123456784",
            trackingUrl: "https://tracking.example.com/1Z999AA10123456784",
            courierName: "UPS",
            courierCode: "ups",
            estimatedDeliveryDate: "2026-04-14T00:00:00.000Z",
            actualDeliveryDate: null,
            lastSyncedAt: "2026-04-13T11:05:00.000Z",
            externalShipmentId: "shp_ext_98231",
            labelUrl: "https://labels.example.com/shp_ext_98231.pdf",
            metadata: {
              source: "supplier",
            },
            trackingEvents: [
              {
                uid: "5ff42dcc-c605-4f61-a367-cf6161b4132d",
                status: "IN_TRANSIT",
                statusCode: "IT",
                location: "Memphis, TN",
                description: "Package departed facility",
                courierStatus: "In Transit",
                timestamp: "2026-04-13T10:58:00.000Z",
                rawPayload: {
                  scanType: "departure",
                },
              },
            ],
          },
          createdAt: "2026-04-12T09:18:11.220Z",
          updatedAt: "2026-04-12T09:18:11.220Z",
        },
      ],
    },
  },
  {
    title: "Balance",
    action: "balance",
    description:
      "Returns wallet balance and currency for the authenticated user.",
    fields: [
      {
        name: "key",
        type: "uuid",
        required: true,
        description: "Your API key.",
      },
      {
        name: "action",
        type: "string",
        required: true,
        description: "Must be 'balance'.",
      },
    ],
    requestExample: {
      key: "8ac6b4ec-f5cb-4f08-b8db-3f8f88565cb9",
      action: "balance",
    },
    responseExample: {
      data: {
          balance: 145.35,
        currency: "USD",
      },
    },
  },
  {
    title: "Refund",
    action: "refund",
    description:
      "Submits a refund request for admin review. It does not immediately mark the order as refunded.",
    fields: [
      {
        name: "key",
        type: "uuid",
        required: true,
        description: "Your API key.",
      },
      {
        name: "action",
        type: "string",
        required: true,
        description: "Must be 'refund'.",
      },
      {
        name: "orderUid",
        type: "uuid",
        required: true,
        description: "Order unique identifier.",
      },
      {
        name: "reason",
        type: "string",
        required: true,
        description: "Refund explanation (10-1000 chars).",
      },
    ],
    requestExample: {
      key: "8ac6b4ec-f5cb-4f08-b8db-3f8f88565cb9",
      action: "refund",
      orderUid: "2fb40490-b57b-4965-84bd-a0f07fbb4c8e",
      reason: "Duplicate order created by checkout retry.",
    },
    responseExample: {
      data: {
        uid: "2fb40490-b57b-4965-84bd-a0f07fbb4c8e",
        orderRef: "ORD-10-103",
        success:
          "Refund request submitted successfully. Our team will review it shortly.",
      },
    },
  },
  {
    title: "Cancel",
    action: "cancel",
    description:
      "Cancels an order for the authenticated user when it is still pending or verifying payment and notifies admins.",
    fields: [
      {
        name: "key",
        type: "uuid",
        required: true,
        description: "Your API key.",
      },
      {
        name: "action",
        type: "string",
        required: true,
        description: "Must be 'cancel'.",
      },
      {
        name: "orderUid",
        type: "uuid",
        required: true,
        description: "Order unique identifier.",
      },
    ],
    requestExample: {
      key: "8ac6b4ec-f5cb-4f08-b8db-3f8f88565cb9",
      action: "cancel",
      orderUid: "2fb40490-b57b-4965-84bd-a0f07fbb4c8e",
    },
    responseExample: {
      data: {
        uid: "2fb40490-b57b-4965-84bd-a0f07fbb4c8e",
          status: "CANCELED",
      },
    },
  },
];

function TypeBadge({ type }: { type: FieldType }) {
  return (
    <Badge
      variant="outline"
      className="font-mono text-[10px] uppercase tracking-wide"
    >
      {type}
    </Badge>
  );
}

function formatHumanLabel(value: string) {
  return value
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function ApiDocsContent() {
  const { domain } = useAppContext();

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-card via-card to-muted/25 p-6 shadow-sm sm:p-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(var(--primary-rgb),0.08),transparent_30%)] pointer-events-none" />
          <div className="relative space-y-5">
            <Badge variant="secondary" className="w-fit gap-1.5 px-3 py-1">
              <Workflow className="h-3.5 w-3.5" />
              Public API
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                API Reference
              </h1>
              <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
                Integrate with the public endpoint at{" "}
                <span className="font-medium text-foreground">/v2</span>. Every
                request on this page includes the field type, whether it is
                required, and example payloads with expected responses.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="border-border/70 bg-background/80 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <KeyRound className="h-4 w-4 text-primary" />
                    API key
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-3 font-mono text-sm">
                    *************************
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    The key is masked here. Manage regeneration from your
                    profile settings.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-background/80 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Code2 className="h-4 w-4 text-primary" />
                    Base URL
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-3 font-mono text-sm">
                    https://api.{domain}/v2
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Use POST with JSON body for all actions.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-background/80 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>1. Keep the API key private.</p>
                    <p>2. Enable API access on your current plan.</p>
                    <p>3. Include both key and action in every request.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {endpoints.map((endpoint) => (
            <Card key={endpoint.action} className="border-border/70 shadow-sm">
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle className="text-xl">{endpoint.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="uppercase">
                      POST
                    </Badge>
                    <Badge variant="outline">
                      {formatHumanLabel(endpoint.action)}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {endpoint.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="rounded-2xl border border-border bg-muted/20 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <TerminalSquare className="h-4 w-4 text-primary" />
                    Request Fields
                  </div>
                  <div className="space-y-3">
                    {endpoint.fields.map((field) => (
                      <div
                        key={`${endpoint.action}-${field.name}`}
                        className="grid gap-2 rounded-xl border border-border/60 bg-background/70 p-3 md:grid-cols-[1.2fr_120px_110px_2.3fr] md:items-center"
                      >
                        <div className="font-mono text-sm">{field.name}</div>
                        <TypeBadge type={field.type} />
                        <Badge
                          variant={field.required ? "default" : "outline"}
                          className="w-fit"
                        >
                          {field.required ? "required" : "optional"}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {field.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-4 overflow-hidden">
                    <div className="mb-2 text-sm font-medium">
                      Example Request
                    </div>
                    <Separator className="mb-3" />
                    <pre className="max-h-72 overflow-auto rounded-xl bg-muted/30 p-3 text-xs leading-5 whitespace-pre">
                      {JSON.stringify(endpoint.requestExample, null, 2)}
                    </pre>
                  </div>

                  <div className="rounded-2xl border border-border bg-background p-4 overflow-hidden">
                    <div className="mb-2 text-sm font-medium">
                      Example Response
                    </div>
                    <Separator className="mb-3" />
                    <pre className="max-h-72 overflow-auto rounded-xl bg-muted/30 p-3 text-xs leading-5 whitespace-pre">
                      {JSON.stringify(endpoint.responseExample, null, 2)}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <CartDrawer />
    </main>
  );
}

export default function ApiDocsPage() {
  const { shopInfo, isLoading, isShopGeneralSettingsLoading } = useAppContext();
  if (isLoading || isShopGeneralSettingsLoading) return <Loading />;

  const apiAccessAllowed = shopInfo?.features?.api_access ?? false;

  return (
    <FeatureGate
      isAllowed={apiAccessAllowed}
      featureLabel="API access is unavailable"
      description="Enable API access to expose the public API and full documentation."
      variant="page"
    >
      <ApiDocsContent />
    </FeatureGate>
  );
}
