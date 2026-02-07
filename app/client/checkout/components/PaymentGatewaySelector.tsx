"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useGetAllPaymentGateways } from "@/hooks/use-paymentGateway";
import { useInitializePayment } from "@/hooks/use-payment";
import { PaymentGatewayPlatform } from "@/types";
import { toast } from "sonner";
import parse from "html-react-parser";

const platformLogos: Record<PaymentGatewayPlatform, string> = {
  PAYSTACK: "/images/paystack.png",
  FLUTTERWAVE: "/images/flutterwave.jpeg",
  STRIPE: "/images/paystack.png", // Using paystack as fallback
  MANUAL: "/images/manual-payment.webp",
};

interface PaymentGatewaySelectorProps {
  cartUid: string;
  billingInfoUid: string;
  notes?: string;
  amount: string;
  currency: string;
  shippingCost?: number;
  shippingCurrency?: string;
  selectedShippingRate?: any;
}

export function PaymentGatewaySelector({
  cartUid,
  billingInfoUid,
  notes,
  amount,
  currency,
  shippingCost,
  shippingCurrency,
  selectedShippingRate,
}: PaymentGatewaySelectorProps) {
  const router = useRouter();
  const { data: gateways, isLoading } = useGetAllPaymentGateways();
  const initializePayment = useInitializePayment();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSelect = (uid: string) => setSelected(uid);

  const handlePay = async () => {
    if (!selected) return toast.error("Select a payment method");
    const gateway = gateways?.find((g) => g.uid === selected);
    if (!gateway) return toast.error("Invalid gateway");
    setSubmitting(true);
    try {
      const redirectUrl = `${window.location.origin}/client/payment-callback`;
      const res = await initializePayment.mutateAsync({
        platform: gateway.platform,
        currency,
        cartUid,
        shippingCost,
        shippingCurrency,
        selectedShippingRate,
        redirectUrl,
        notes,
        billingInfoUid,
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
              {gateways?.map((gateway) => (
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
                    </div>
                    {gateway.description && (
                      <div className="text-sm bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 rounded flex items-center gap-2 mt-2 px-3 py-2 border border-yellow-300 dark:border-yellow-700">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>{parse(gateway.description)}</span>
                      </div>
                    )}
                  </div>
                  {selected === gateway.uid && (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  )}
                </button>
              ))}
            </div>
            <Button
              size="lg"
              className="w-full h-12 text-base font-semibold mt-2"
              onClick={handlePay}
              disabled={submitting || !selected}
            >
              {submitting ? "Processing..." : "Proceed to Payment"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
