"use client";

import { useGetShippingAccounts } from "@/hooks/use-shipping";
import {
  ConnectAccountDialog,
  ShippingAccountCard,
} from "./components/ShippingAccountManagement";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Package, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { FeatureGate } from "@/components/FeatureGate";
import { useAppContext } from "@/context/appContext";

export default function ShippingSettingsPage() {
  const { data: accounts, isLoading } = useGetShippingAccounts();
  const { shopInfo } = useAppContext();

  const maxShippingAccounts = shopInfo?.features?.max_shipping_accounts ?? 0;
  const canAddMoreAccounts = (accounts?.length ?? 0) < maxShippingAccounts;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Shipping Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your shipping provider accounts and configurations. You can
            have up to {maxShippingAccounts} shipping accounts.
          </p>
        </div>
        <FeatureGate
          isAllowed={canAddMoreAccounts}
          featureLabel="Automated shipping"
          variant="tooltip"
          description={
            !canAddMoreAccounts
              ? "You've reached the maximum of shipping accounts allowed for your plan."
              : `You can add up to ${maxShippingAccounts} shipping accounts.`
          }
        >
          <ConnectAccountDialog />
        </FeatureGate>
      </div>

      {accounts && accounts.length > 0 ? (
        <div className="grid gap-4">
          {accounts.map((account) => (
            <ShippingAccountCard key={account.uid} account={account} />
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">
              No Shipping Accounts Connected
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Connect a shipping provider like Sendbox or Shippo to
              automatically create and manage shipments for your orders.
            </p>
            <FeatureGate
              isAllowed={canAddMoreAccounts}
              featureLabel="Automated shipping"
              variant="inline"
              description="Upgrade your plan to enable automated shipping features and connect shipping providers."
            >
              <ConnectAccountDialog />
            </FeatureGate>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              Getting Started with Shipping Integration
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              To get started, create an account with Sendbox or Shippo, obtain
              your API key, and connect it here. Once connected, you'll be able
              to automatically create shipping labels and track packages from
              your orders page.
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
              After connecting, set a shipping account as{" "}
              <span className="font-semibold">preferred</span>. The preferred
              account will be used by default for creating shipments,
              calculating shipping fees, and adding shipping prices when
              creating orders.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
