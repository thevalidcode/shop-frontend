"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CurrencyCode, useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { TooltipComponent } from "@/components/tooltip";
import Decimal from "decimal.js";

export function OrderSummary({
  subtotal,
  tax,
  total,
  currency,
  onPlaceOrder,
  placing,
  disabled,
  createShippingInfo,
  shippingCost,
  shippingCurrency,
}: {
  subtotal: string;
  tax: string;
  total: string;
  currency: CurrencyCode;
  onPlaceOrder: () => void;
  placing: boolean;
  createShippingInfo: () => void;
  disabled?: boolean;
  shippingCost?: number;
  shippingCurrency?: string;
}) {
  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();

  const displaySubtotal = convert(
    currency,
    userCurrency,
    subtotal,
    true,
    false,
  );
  const displayTax = convert(currency, userCurrency, tax, true, false);

  // Convert shipping cost to user currency
  const displayShipping =
    shippingCost && shippingCurrency
      ? convert(
          shippingCurrency as CurrencyCode,
          userCurrency,
          shippingCost,
          true,
          false,
        )
      : null;

  // Calculate final total: subtotal + tax + shipping
  const subtotalDecimal = new Decimal(displaySubtotal.amount);
  const taxDecimal = new Decimal(displayTax.amount);
  const shippingDecimal = displayShipping
    ? new Decimal(displayShipping.amount)
    : new Decimal(0);

  const finalTotal = subtotalDecimal.add(taxDecimal).add(shippingDecimal);
  console.log(subtotal.toString())
  const symbol = displaySubtotal.symbol;

  return (
    <Card className="p-4 sm:p-6 space-y-3">
      <h3 className="font-semibold">Order Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{displaySubtotal.formatted}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span className="font-medium">{displayTax.formatted}</span>
        </div>
        {displayShipping && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">{displayShipping.formatted}</span>
          </div>
        )}
      </div>
      <div className="border-t pt-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total</span>
          <span className="text-xl font-bold">
            {symbol}
            {finalTotal.toNumber().toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
      <TooltipComponent
        showTip={!disabled}
        title="Shipping Info Needed"
        description="Kindly create a shipping information or select an existing one to be able to place an order."
        ctaClick={createShippingInfo}
        ctaLabel="Create Shipping Info"
      >
        <Button
          size="lg"
          className="w-full h-12 text-base font-semibold"
          onClick={onPlaceOrder}
          disabled={placing || disabled}
        >
          {placing ? "Proceeding..." : "Proceed to Payment"}
        </Button>
      </TooltipComponent>
    </Card>
  );
}
