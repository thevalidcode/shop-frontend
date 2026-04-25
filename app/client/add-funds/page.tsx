"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CircleDollarSign,
  CreditCard,
  History,
  ImageIcon,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { useAppContext } from "@/context/appContext";
import { useGetAllPaymentGateways } from "@/hooks/use-paymentGateway";
import { useCreateWalletPayment } from "@/hooks/use-payment";
import Pagination from "@/components/pagination";
import {
  WalletTransaction,
  useWalletBalance,
  useWalletTransactions,
} from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from "@/app/loading";
import { toast } from "sonner";
import parse from "html-react-parser";
import { currency as currencyMap } from "@/app/_docs/doc";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { CartDrawer } from "../products/components/CartDrawer";

const formatEnumLabel = (value: string) =>
  value
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function AddFundsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnTo = searchParams.get("returnTo");
  const { userCurrency } = useAppContext();
  const { data: wallet, isLoading: walletLoading } = useWalletBalance();
  const { data: transactions, isLoading: transactionsLoading } =
    useWalletTransactions();
  const { data: gateways = [], isLoading: gatewaysLoading } =
    useGetAllPaymentGateways();
  const createWalletPayment = useCreateWalletPayment();
  const convert = useCurrencyConverter();

  const [amount, setAmount] = useState("");
  const [selectedGatewayUid, setSelectedGatewayUid] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(userCurrency);
  const [activityPage, setActivityPage] = useState(1);
  const [activityPageSize, setActivityPageSize] = useState(6);

  useEffect(() => {
    const presetAmount = searchParams.get("amount");
    const presetCurrency = searchParams.get("currency");

    if (presetAmount && Number(presetAmount) > 0) {
      setAmount(Number(presetAmount).toFixed(2));
    }

    if (
      presetCurrency &&
      currencyMap[presetCurrency as keyof typeof currencyMap]
    ) {
      setSelectedCurrency(presetCurrency as keyof typeof currencyMap);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!selectedGatewayUid && gateways.length > 0) {
      setSelectedGatewayUid(
        gateways.filter((gateway) => gateway.platform !== "CREDIT")[0].uid,
      );
    }
  }, [gateways, selectedGatewayUid]);

  const selectedGateway = useMemo(
    () => gateways.find((gateway) => gateway.uid === selectedGatewayUid),
    [gateways, selectedGatewayUid],
  );

  const currentBalance = Number(wallet?.balance || 0);
  const walletCurrency = wallet?.currency || userCurrency;
  const amountValue = Number(amount || 0);
  const gatewayCurrency = (selectedGateway?.currency ||
    selectedCurrency) as keyof typeof currencyMap;

  const minTopup = useMemo(() => {
    const value = Number(selectedGateway?.min || 0);
    if (!selectedGateway || !value) return value;
    if (gatewayCurrency === selectedCurrency) return value;
    return Number(
      convert(
        gatewayCurrency as any,
        selectedCurrency as any,
        value,
        false,
        false,
      ).amount,
    );
  }, [selectedGateway, gatewayCurrency, selectedCurrency, convert]);

  const maxTopup = useMemo(() => {
    const value = Number(selectedGateway?.max || 0);
    if (!selectedGateway || !value) return value;
    if (gatewayCurrency === selectedCurrency) return value;
    return Number(
      convert(
        gatewayCurrency as any,
        selectedCurrency as any,
        value,
        false,
        false,
      ).amount,
    );
  }, [selectedGateway, gatewayCurrency, selectedCurrency, convert]);

  const allowedRangeText = `${minTopup > 0 ? minTopup.toFixed(2) : "0.00"} - ${maxTopup > 0 ? maxTopup.toFixed(2) : "No max"} ${selectedCurrency}`;

  const quickAmounts = useMemo(() => {
    const presets = [10, 25, 50, 100, 250, 500];
    return presets.filter((value) => {
      if (minTopup > 0 && value < minTopup) return false;
      if (maxTopup > 0 && value > maxTopup) return false;
      return true;
    });
  }, [minTopup, maxTopup]);

  const activityTotal = transactions?.length || 0;
  const paginatedTransactions = useMemo(() => {
    if (!transactions) return [];
    const start = (activityPage - 1) * activityPageSize;
    const end = start + activityPageSize;
    return transactions.slice(start, end);
  }, [transactions, activityPage, activityPageSize]);

  if (walletLoading || gatewaysLoading || transactionsLoading) {
    return <Loading />;
  }

  if (!gateways.length) {
    return (
      <EmptyState
        icon={Wallet}
        title="No payment gateway available"
        description="Add-funds is available once the shop has an active payment gateway configured."
      />
    );
  }

  const canSubmit =
    Boolean(selectedGateway) &&
    amountValue > 0 &&
    (minTopup <= 0 || amountValue >= minTopup) &&
    (maxTopup <= 0 || amountValue <= maxTopup);

  const handleTopup = async () => {
    if (!selectedGateway) {
      toast.error("Select a payment method");
      return;
    }

    if (!amountValue || amountValue <= 0) {
      toast.error("Enter a valid top-up amount");
      return;
    }

    if (minTopup > 0 && amountValue < minTopup) {
      toast.error(
        `Minimum top-up for this gateway is ${minTopup.toFixed(2)} ${selectedCurrency}`,
      );
      return;
    }

    if (maxTopup > 0 && amountValue > maxTopup) {
      toast.error(
        `Maximum top-up for this gateway is ${maxTopup.toFixed(2)} ${selectedCurrency}`,
      );
      return;
    }

    try {
      const result = await createWalletPayment.mutateAsync({
        platform: selectedGateway.platform,
        amount: amountValue.toFixed(2),
        currency: selectedCurrency,
        redirectUrl: `${window.location.origin}/client/payment-callback`,
      });

      if (result?.url) {
        window.location.href = result.url;
        return;
      }

      toast.success(result?.message || "Top-up request created successfully");
      if (returnTo) {
        router.push(returnTo);
      }
    } catch {
      // Error handled by hook
    }
  };

  const isManualGateway = selectedGateway?.platform === "MANUAL";

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-card via-card to-muted/30 p-6 shadow-sm sm:p-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(var(--primary-rgb),0.08),transparent_30%)] pointer-events-none" />
          <div className="relative grid gap-6 lg:grid-cols-[1.4fr_0.9fr] lg:items-end">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit gap-1.5 px-3 py-1">
                <Sparkles className="h-3.5 w-3.5" />
                Wallet Top-up
              </Badge>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Add funds to your shop wallet
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                  Top up your balance using one of the configured gateways and
                  keep checkout fast for your customers.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-2xl border border-border bg-background/80 px-4 py-3 backdrop-blur">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    Current balance
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {Number(currentBalance.toFixed(2)).toLocaleString()}{" "}
                    {walletCurrency}
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-background/80 px-4 py-3 backdrop-blur">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    Available gateways
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {
                      gateways.filter(
                        (gateway) => gateway.platform !== "CREDIT",
                      ).length
                    }
                  </div>
                </div>
              </div>
            </div>

            <Card className="relative border-border/70 bg-background/90 shadow-lg backdrop-blur">
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CircleDollarSign className="h-5 w-5 text-primary" />
                  Wallet snapshot
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Your wallet balance is always settled in {walletCurrency}.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-muted/30 p-4">
                    <div className="text-xs text-muted-foreground">Amount</div>
                    <div className="mt-1 text-xl font-semibold">
                      {amountValue > 0 ? amountValue.toFixed(2) : "0.00"}{" "}
                      {selectedCurrency}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted/30 p-4">
                    <div className="text-xs text-muted-foreground">
                      Wallet receives
                    </div>
                    <div className="mt-1 text-xl font-semibold">
                      {walletCurrency}
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
                  If you pay in a different currency than your wallet currency,
                  the final credited amount is converted at settlement time.
                </div>

                {gatewayCurrency !== selectedCurrency && (
                  <div className="rounded-2xl border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
                    Gateway limits are configured in {gatewayCurrency}; they are
                    shown here in {selectedCurrency} using current conversion
                    rates.
                  </div>
                )}

                {isManualGateway && (
                  <div className="rounded-2xl border border-amber-300/50 dark:bg-amber-50/10 bg-amber-50/40 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
                    Manual mode selected. Your request will be created without
                    redirecting to an external checkout.
                  </div>
                )}

                <div className="rounded-2xl border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
                  Allowed range for this gateway: {allowedRangeText}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wallet className="h-5 w-5 text-primary" />
                Top-up details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Gateway
                  </div>
                  <Select
                    value={selectedGatewayUid}
                    onValueChange={setSelectedGatewayUid}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a gateway" />
                    </SelectTrigger>
                    <SelectContent>
                      {gateways
                        .filter((gateway) => gateway.platform !== "CREDIT")
                        .map((gateway) => (
                          <SelectItem key={gateway.uid} value={gateway.uid}>
                            {gateway.name} ({formatEnumLabel(gateway.platform)})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Payment currency
                  </div>
                  <Select
                    value={selectedCurrency}
                    onValueChange={(value) =>
                      setSelectedCurrency(value as typeof userCurrency)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {Object.entries(currencyMap).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {code} - {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Amount
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    min={minTopup > 0 ? String(minTopup) : "0"}
                    max={maxTopup > 0 ? String(maxTopup) : undefined}
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Enter amount in ${selectedCurrency}`}
                    className="h-12 pr-20 text-base"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                    {selectedCurrency}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Allowed range: {allowedRangeText}
                </p>
              </div>

              {quickAmounts.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Quick amounts
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickAmounts.map((quick) => (
                      <Button
                        key={quick}
                        type="button"
                        variant={amountValue === quick ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAmount(String(quick))}
                      >
                        {quick.toFixed(2)} {selectedCurrency}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-border bg-muted/20 px-4 py-3 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Settlement preview
                </div>
                <p className="mt-1 text-muted-foreground">
                  You pay {amountValue > 0 ? amountValue.toFixed(2) : "0.00"}{" "}
                  {selectedCurrency}. Wallet credits settle in {walletCurrency}{" "}
                  based on live conversion at payment confirmation.
                </p>
              </div>

              <Button
                className="h-12 w-full text-base font-semibold"
                onClick={handleTopup}
                disabled={createWalletPayment.isPending || !canSubmit}
              >
                {createWalletPayment.isPending
                  ? "Preparing payment..."
                  : "Proceed to top-up"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5 text-primary" />
                Selected gateway
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedGateway ? (
                <div className="rounded-2xl border border-border bg-muted/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-background/80 text-muted-foreground">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold">
                          {selectedGateway.name}
                        </div>
                        {selectedGateway.description ? (
                          <div className="mt-1 text-xs text-muted-foreground whitespace-pre-wrap wrap-break-word">
                            {selectedGateway.description}
                          </div>
                        ) : (
                          <div className="mt-1 text-xs text-muted-foreground">
                            {selectedGateway.platform}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline">
                      {formatEnumLabel(selectedGateway.platform)}
                    </Badge>
                  </div>

                  {selectedGateway.content ? (
                    <div className="prose prose-sm mt-3 max-w-none text-sm text-muted-foreground">
                      {parse(selectedGateway.content)}
                    </div>
                  ) : null}

                  <div className="mt-4 rounded-xl border border-border bg-background/80 px-3 py-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-emerald-500" />
                      This gateway is active and available for wallet funding.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Select a gateway to see its details.
                </div>
              )}

              <Separator />

              <div>
                <div className="mb-3 flex items-center gap-2 text-lg font-semibold">
                  <History className="h-5 w-5 text-primary" />
                  Recent wallet activity
                </div>
                <div className="space-y-2">
                  {paginatedTransactions.map(
                    (transaction: WalletTransaction) => (
                      <div
                        key={transaction.uid}
                        className="flex items-center justify-between rounded-2xl border border-border bg-muted/20 px-4 py-3"
                      >
                        <div>
                          <div className="font-medium">
                            {transaction.description}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(
                              transaction.timestamp,
                            ).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {Number(transaction.amount).toFixed(2)}{" "}
                            {transaction.currency}
                          </div>
                          <Badge variant="outline" className="mt-1 text-[10px]">
                            {formatEnumLabel(transaction.type)}
                          </Badge>
                        </div>
                      </div>
                    ),
                  )}

                  {(!transactions || transactions.length === 0) && (
                    <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                      No wallet activity yet.
                    </div>
                  )}
                </div>
                {activityTotal > 0 && (
                  <Pagination
                    page={activityPage}
                    pageSize={activityPageSize}
                    totalItems={activityTotal}
                    onPageChange={setActivityPage}
                    onPageSizeChange={(size) => {
                      setActivityPageSize(size);
                      setActivityPage(1);
                    }}
                    pageSizeOptions={[6, 10, 20]}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <CartDrawer />
    </main>
  );
}
