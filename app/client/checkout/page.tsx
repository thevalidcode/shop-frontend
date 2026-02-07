"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/empty-state";
import { Package, CreditCard } from "lucide-react";
import { useGetCart } from "@/hooks/use-cart";
import {
  useGetBillingInfo,
  useGetDefaultBillingInfo,
} from "@/hooks/use-billing-info";
import {
  useGetShippingMethods,
  useGetShippingRates,
  ShippingRate,
} from "@/hooks/use-shipping";
import { BillingInfoForm } from "@/app/client/profile/components/BillingInfoForm";
import { toast } from "sonner";
import { NewOrderHeader } from "./components/NewOrderHeader";
import { BillingSelector } from "./components/BillingSelector";
import { CartItems } from "./components/CartItems";
import { OrderSummary } from "./components/OrderSummary";
import { PaymentGatewaySelector } from "./components/PaymentGatewaySelector";
import { ShippingRateSelector } from "./components/ShippingRateSelector";
import Loading from "@/app/loading";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";

export default function NewOrderPage() {
  const router = useRouter();
  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : undefined;

  const { data: cart } = useGetCart();

  const { data: billingInfos } = useGetBillingInfo();
  const { data: defaultBilling } = useGetDefaultBillingInfo();
  const { data: shippingMethods } = useGetShippingMethods();

  const [notes, setNotes] = useState<string>("");
  const [billingUid, setBillingUid] = useState<string>("");
  const [createBillingOpen, setCreateBillingOpen] = useState<boolean>(false);
  const [showPayment, setShowPayment] = useState(
    params?.get("step") === "payment",
  );
  const [selectedShippingRate, setSelectedShippingRate] =
    useState<ShippingRate | null>(null);

  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();

  // Check if shipping is available and has preferred account
  const hasPreferredShipping =
    shippingMethods?.hasShipping &&
    shippingMethods.methods.some((m) => m.isPreferred);

  // Fetch shipping rates only when billing info is selected and shipping is available
  const { data: shippingRatesData, isLoading: loadingRates } =
    useGetShippingRates(
      cart?.uid || "",
      billingUid,
      undefined, // fetch from all platforms
    );

  useEffect(() => {
    if (defaultBilling?.uid) {
      setBillingUid((prev) => prev || defaultBilling.uid);
    }
  }, [defaultBilling]);

  // Auto-select cheapest shipping rate when rates are loaded
  useEffect(() => {
    if (
      shippingRatesData?.rates &&
      shippingRatesData.rates.length > 0 &&
      !selectedShippingRate
    ) {
      setSelectedShippingRate(shippingRatesData.rates[0]);
    }
  }, [shippingRatesData, selectedShippingRate]);

  const cartEmpty = !cart || cart.items.length === 0;
  const headerTotal = cart
    ? convert(cart.currency, userCurrency, cart.total, true, false).formatted
    : undefined;

  const proceedToPayment = () => {
    if (!billingUid) {
      toast.error("Please select billing information.");
      return;
    }
    if (cartEmpty) {
      toast.error("Your cart is empty.");
      return;
    }
    // Check if shipping is required but not selected
    if (
      hasPreferredShipping &&
      shippingRatesData?.rates &&
      shippingRatesData.rates.length > 0 &&
      !selectedShippingRate
    ) {
      toast.error("Please select a shipping method.");
      return;
    }
    // Add step=payment to query param for navigation
    setShowPayment(true);
    router.replace(`/client/checkout?step=payment`);
  };

  if (!cart) {
    return <Loading />;
  }

  const handleOnBack = () => {
    if (showPayment) {
      router.replace(`/client/checkout`);
      setShowPayment(false);
    } else {
      router.push("/client/products");
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {showPayment ? (
        <NewOrderHeader
          onBack={handleOnBack}
          itemCount={cart?.itemCount}
          totalFormatted={headerTotal}
          paymentStep
        />
      ) : (
        <NewOrderHeader
          onBack={handleOnBack}
          itemCount={cart?.itemCount}
          totalFormatted={headerTotal}
        />
      )}

      {showPayment ? (
        <PaymentGatewaySelector
          cartUid={cart.uid}
          billingInfoUid={billingUid}
          notes={notes}
          amount={cart.total}
          currency={userCurrency}
          shippingCost={selectedShippingRate?.cost}
          shippingCurrency={selectedShippingRate?.currency}
          selectedShippingRate={
            selectedShippingRate
              ? {
                  courierName: selectedShippingRate.courierName,
                  courierCode: selectedShippingRate.courierCode,
                  serviceName: selectedShippingRate.serviceName,
                  serviceCode: selectedShippingRate.serviceCode,
                  rateId: selectedShippingRate.rateId,
                  accountUid: selectedShippingRate.accountUid,
                  platform: selectedShippingRate.platform,
                  estimatedDays: selectedShippingRate.estimatedDays,
                  cost: selectedShippingRate.cost,
                  currency: selectedShippingRate.currency,
                }
              : undefined
          }
        />
      ) : cartEmpty ? (
        <EmptyState
          icon={Package}
          title="Your cart is empty"
          description="Add items from the products page to place an order."
          actionLabel="Go back to products"
          onAction={() => router.push("/client/products")}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <CartItems items={cart.items} />
            <div className="mt-4">
              <Card className="p-4 sm:p-6 space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Order Notes (optional)
                </label>
                <Textarea
                  placeholder="Add any special instructions for this order"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Card>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
          >
            <div className="space-y-4">
              <BillingSelector
                billingInfos={billingInfos}
                value={billingUid}
                onChange={setBillingUid}
                onAddNew={() => setCreateBillingOpen(true)}
              />
              {hasPreferredShipping && billingUid && (
                <ShippingRateSelector
                  rates={shippingRatesData?.rates || []}
                  selectedRate={selectedShippingRate}
                  onSelectRate={setSelectedShippingRate}
                  isLoading={loadingRates}
                  userCurrency={userCurrency}
                />
              )}
              <OrderSummary
                subtotal={cart.subtotal}
                tax={cart.tax}
                currency={cart.currency}
                total={cart.total}
                onPlaceOrder={proceedToPayment}
                createBillingInfo={() => setCreateBillingOpen(true)}
                placing={false}
                disabled={!billingUid}
                shippingCost={selectedShippingRate?.cost}
                shippingCurrency={selectedShippingRate?.currency}
              />
            </div>
          </motion.div>
        </div>
      )}

      <Dialog open={createBillingOpen} onOpenChange={setCreateBillingOpen}>
        <DialogContent className="sm:max-w-130">
          <DialogHeader>
            <DialogTitle>Add Billing Information</DialogTitle>
          </DialogHeader>
          <div className="px-2 py-2">
            <BillingInfoForm onClose={() => setCreateBillingOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
