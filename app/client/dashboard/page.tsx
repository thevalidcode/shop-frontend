"use client";

import { ordersConfig, paymentsConfig } from "@/app/_docs/doc";
import { MetricsCards } from "./components/metric-cards";
import RecentActivity from "./components/recent-activity";
import { DynamicStackedChart } from "./components/charts";
import { useGetUserDashboardStatistics } from "@/hooks/use-statistics";
import Loading from "@/app/loading";
import {
  BoxIcon,
  DollarSignIcon,
  Server,
  ShoppingCartIcon,
  Wallet as WalletIcon,
  XIcon,
} from "lucide-react";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { EmptyState } from "@/components/empty-state";
import { useGetCategories } from "@/hooks/use-category";
import { CartDrawer } from "../products/components/CartDrawer";
import { FeatureGate } from "@/components/FeatureGate";
import { useWalletBalance } from "@/hooks/use-wallet";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const { data, isLoading } = useGetUserDashboardStatistics();
  const { data: categories } = useGetCategories();
  const { data: wallet } = useWalletBalance();

  const { userCurrency, shopInfo } = useAppContext();

  const convert = useCurrencyConverter();

  if (isLoading) {
    return <Loading />;
  }

  const analyticsAllowed = shopInfo?.features?.analytics ?? false;

  if (!analyticsAllowed) {
    return (
      <FeatureGate
        isAllowed={false}
        featureLabel="Analytics"
        variant="page"
        description="Analytics features are not available for your shop. Please contact support for more information."
      ></FeatureGate>
    );
  }

  const spentFormatted = data?.yourSpent
    ? convert("USD", userCurrency, data.yourSpent, true, false).formatted
    : "--";
  const walletFormatted = wallet
    ? convert(wallet.currency as any, userCurrency, wallet.balance, true, false)
        .formatted
    : "--";

  const metrics = [
    {
      icon: <ShoppingCartIcon />,
      label: "Your Orders",
      value: data ? data.yourOrders : 0,
    },
    {
      icon: <XIcon />,
      label: "Canceled Orders",
      value: data ? data.canceledOrders : 0,
    },
    {
      icon: <BoxIcon />,
      label: "Shop Orders",
      value: data ? data.shopOrders : 0,
    },
    {
      icon: <DollarSignIcon />,
      label: "You've Spent",
      value: spentFormatted,
    },
  ];
  return (
    <div className="space-y-6 px-3 sm:px-6 pb-8 mt-6">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Overview of orders, payments, and wallet activity for your shop.
          </p>
        </div>
        <Card className="border-border/70 bg-card/80 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Wallet balance
              </div>
              <div className="mt-1 text-2xl font-semibold">
                {walletFormatted}
              </div>
            </div>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <WalletIcon className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <MetricsCards
        metrics={metrics.map((m) => ({
          title: m.label,
          icon: m.icon,
          value: m.value,
        }))}
      />
      {/* charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <DynamicStackedChart
          title="Orders Overview"
          description="Showing total orders for the last 6 months."
          data={data ? data.ordersData : []}
          config={ordersConfig}
          dataKeys={["completed", "orders"]}
          trendPercentage={93}
        />
        <DynamicStackedChart
          title="Payments Overview"
          description="Payment amounts in USD for the last 6 months"
          data={data ? data.paymentsData : []}
          config={paymentsConfig}
          dataKeys={["successful", "failed"]}
          trendPercentage={60}
        />
      </div>
      {data &&
      data.recentlyAddedProducts &&
      data.recentlyAddedProducts.length === 0 ? (
        <EmptyState
          icon={Server}
          title="No Service Found"
          description="No service has been created yet."
        />
      ) : (
        <RecentActivity
          products={data?.recentlyAddedProducts || []}
          categories={categories || []}
        />
      )}

      <CartDrawer />
    </div>
  );
}
