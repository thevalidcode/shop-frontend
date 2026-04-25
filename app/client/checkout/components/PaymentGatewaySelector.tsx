"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CreditCard } from "lucide-react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useGetAllPaymentGateways } from "@/hooks/use-paymentGateway";
import { useInitializePayment } from "@/hooks/use-payment";
import { useWalletBalance } from "@/hooks/use-wallet";
import { PaymentGatewayPlatform } from "@/types";
import { toast } from "sonner";
import parse from "html-react-parser";
import { useAppContext } from "@/context/appContext";
import { FeatureGate } from "@/components/FeatureGate";
import { Switch } from "@/components/ui/switch";

const platformLogos: Record<PaymentGatewayPlatform, string> = {
  PAYSTACK: "/images/paystack.png",
  FLUTTERWAVE: "/images/flutterwave.jpeg",
  STRIPE: "/images/paystack.png", // Using paystack as fallback
  MANUAL: "/images/manual-payment.webp",
  CREDIT: "/images/manual-payment.webp",
};

interface PaymentGatewaySelectorProps {
  cartUid: string;
  shippingInfoUid: string;
  notes?: string;
  amount: string;
  currency: string;
  shippingCost?: number;
  shippingCurrency?: string;
  selectedShippingRate?: any;
}

const BALANCE_OPTION_UID = "__wallet_balance__";

export function PaymentGatewaySelector({
  cartUid,
  shippingInfoUid,
  notes,
  amount,
  currency,
  shippingCost,
  shippingCurrency,
  selectedShippingRate,
}: PaymentGatewaySelectorProps) {
  const router = useRouter();
  const { data: gateways, isLoading } = useGetAllPaymentGateways();
  const { data: wallet } = useWalletBalance();
  const initializePayment = useInitializePayment();
  const [selected, setSelected] = useState<string | null>(null);
  const [topupAmount, setTopupAmount] = useState<string>("");
  const [useHybrid, setUseHybrid] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { shopInfo } = useAppContext();

  const isSubscriptionActive = shopInfo?.subscriptionStatus === "ACTIVE";
  const walletBalance = Number(wallet?.balance || 0);
  const orderAmount = Number(amount || 0);
  const canUseBalance = walletBalance > 0;
  const hasSufficientBalance = walletBalance >= orderAmount;
  const selectedGateway = gateways?.find((gateway) => gateway.uid === selected);
  const canHybridApply =
    Boolean(selectedGateway) &&
    selected !== BALANCE_OPTION_UID &&
    selectedGateway?.platform !== "MANUAL" &&
    canUseBalance &&
    !hasSufficientBalance;

  useEffect(() => {
    if (!canHybridApply && useHybrid) {
      setUseHybrid(false);
    }
  }, [canHybridApply, useHybrid]);

  const handleSelect = (uid: string) => setSelected(uid);

  const handleTopup = async () => {
    const amountNum = Number(topupAmount || 0);
    if (!amountNum || amountNum <= 0) {
      toast.error("Enter a valid top-up amount");
      return;
    }

    const addFundsUrl = `/client/add-funds?amount=${amountNum.toFixed(2)}&currency=${wallet?.currency || currency}&returnTo=${encodeURIComponent("/client/checkout?step=payment")}`;
    router.push(addFundsUrl);
  };

  const handlePay = async () => {
    if (!selected) return toast.error("Select a payment method");

    if (selected === BALANCE_OPTION_UID) {
      if (!canUseBalance) {
        toast.error("Wallet balance is not available");
        return;
      }

      if (!hasSufficientBalance) {
        toast.error(
          "Insufficient wallet balance. Choose direct payment or top up.",
        );
        return;
      }

      setSubmitting(true);
      try {
        const redirectUrl = `${window.location.origin}/client/payment-callback`;
        const res = await initializePayment.mutateAsync({
          platform: "CREDIT",
          useBalance: true,
          currency,
          cartUid,
          shippingCost,
          shippingCurrency,
          selectedShippingRate,
          redirectUrl,
          notes,
          shippingInfoUid,
        });

        toast.success("Order paid successfully using wallet balance.");
        const paymentUid = res?.paymentUid;
        if (paymentUid) {
          router.replace(`/client/payment-success?uid=${paymentUid}`);
        } else {
          router.replace("/client/payment-success");
        }
      } catch (_e) {
        // handled in hook
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const gateway = selectedGateway;
    if (!gateway) return toast.error("Invalid gateway");
    const hybridEnabledForGateway = canHybridApply && useHybrid;
    setSubmitting(true);
    try {
      const redirectUrl = `${window.location.origin}/client/payment-callback`;
      const res = await initializePayment.mutateAsync({
        platform: gateway.platform,
        useBalance: hybridEnabledForGateway,
        currency,
        cartUid,
        shippingCost,
        shippingCurrency,
        selectedShippingRate,
        redirectUrl,
        notes,
        shippingInfoUid,
      });
      if (gateway.platform === "MANUAL") {
        toast.success("Payment request sent. Awaiting verification.");
        router.replace(`/client/payment-success?manual=1&amount=${amount}`);
      } else if (res?.url) {
        window.location.href = res.url;
      } else {
        toast.success("Payment initialized. Check your payment provider.");
        router.replace("/client/orders");
      }
    } catch (e) {
      // error handled by hook
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-xl">
        <Card className="shadow-lg border border-border bg-background animate-in fade-in slide-in-from-bottom duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <CreditCard className="h-6 w-6 text-primary" />
              Select Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-0">
            <div className="grid gap-4">
              {canUseBalance && !hasSufficientBalance && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                  <div className="text-sm font-semibold text-primary">
                    Wallet top-up
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You need {(orderAmount - walletBalance).toFixed(2)}{" "}
                    {wallet?.currency || currency} more to pay with balance.
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      value={topupAmount}
                      onChange={(e) => setTopupAmount(e.target.value)}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Enter top-up amount"
                      disabled={submitting}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleTopup}
                      disabled={submitting}
                    >
                      Add Funds
                    </Button>
                  </div>
                </div>
              )}

              {canHybridApply && (
                <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">
                        Hybrid Payment
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Use wallet balance first, then pay the remaining amount
                        with selected gateway.
                      </div>
                    </div>
                    <Switch
                      checked={useHybrid}
                      onCheckedChange={(checked) => setUseHybrid(checked)}
                    />
                  </div>
                </div>
              )}

              {canUseBalance && (
                <button
                  type="button"
                  onClick={() => handleSelect(BALANCE_OPTION_UID)}
                  className={`group flex items-center gap-4 p-4 rounded-xl border transition-all w-full text-left focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    selected === BALANCE_OPTION_UID
                      ? "border-primary bg-primary/10 shadow-lg scale-[1.01]"
                      : "border-border bg-background hover:bg-muted/40"
                  }`}
                  disabled={submitting}
                >
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-lg border bg-white dark:bg-gray-900 flex items-center justify-center p-1.5">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base flex items-center gap-2">
                      Use Wallet Balance
                      <Badge variant="secondary" className="text-xs">
                        Fastest
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Available:{" "}
                      {Number(walletBalance.toFixed(2)).toLocaleString()}{" "}
                      {wallet?.currency || currency}
                    </div>
                    {!hasSufficientBalance && (
                      <div className="text-xs text-destructive mt-1">
                        Insufficient for this order total. Choose another
                        method.
                      </div>
                    )}
                  </div>
                  {selected === BALANCE_OPTION_UID && (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  )}
                </button>
              )}

              {gateways?.length === 0 && !isLoading && (
                <div className="bg-destructive/10 border border-destructive text-destructive rounded p-4 text-center">
                  <div className="font-semibold mb-1">
                    No payment methods available
                  </div>
                  <div className="text-sm">
                    Please contact support or try again later.
                  </div>
                </div>
              )}
              {gateways
                ?.filter((gateway) => gateway.platform !== "CREDIT")
                .map((gateway) => (
                  <button
                    key={gateway.uid}
                    type="button"
                    onClick={() => handleSelect(gateway.uid)}
                    className={`group flex items-center gap-4 p-4 rounded-xl border transition-all w-full text-left focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      selected === gateway.uid
                        ? "border-primary bg-primary/10 shadow-lg scale-[1.01]"
                        : "border-border bg-background hover:bg-muted/40"
                    }`}
                    disabled={submitting}
                  >
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-lg border bg-white dark:bg-gray-900 flex items-center justify-center p-1.5">
                        <Image
                          src={platformLogos[gateway.platform]}
                          alt={gateway.name}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base flex items-center gap-2">
                        {gateway.name}
                        {gateway.platform === "MANUAL" && (
                          <Badge variant="destructive" className="text-xs">
                            Manual
                          </Badge>
                        )}
                        {gateway.platform !== "MANUAL" && (
                          <Badge variant="outline" className="text-xs">
                            Direct
                          </Badge>
                        )}
                      </div>
                      {gateway.description && (
                        <div className="richtext-content richtext-render text-sm bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 rounded flex items-center gap-2 mt-2 px-3 py-2 border border-yellow-300 dark:border-yellow-700">
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                          <div>{parse(gateway.description)}</div>
                        </div>
                      )}
                    </div>
                    {selected === gateway.uid && (
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    )}
                  </button>
                ))}
            </div>
            <FeatureGate
              isAllowed={isSubscriptionActive}
              featureLabel="Payment Processing"
              description="Your subscription must be active to process payments. Please contact the shop owner to renew the subscription to continue accepting payments."
              variant="inline"
            >
              <Button
                size="lg"
                className="w-full h-12 text-base font-semibold mt-2"
                onClick={handlePay}
                disabled={submitting || !selected}
              >
                {submitting ? "Processing..." : "Proceed to Payment"}
              </Button>
            </FeatureGate>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
