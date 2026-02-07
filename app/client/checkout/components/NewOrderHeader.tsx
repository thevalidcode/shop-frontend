"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ShoppingCart } from "lucide-react";

interface NewOrderHeaderProps {
  onBack: () => void;
  itemCount?: number;
  totalFormatted?: string;
  paymentStep?: boolean;
}

export function NewOrderHeader({
  onBack,
  itemCount,
  totalFormatted,
  paymentStep,
}: NewOrderHeaderProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-border bg-background/95 dark:bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/80 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-10 w-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-0.5">
            {paymentStep ? (
              <>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Payment
                </p>
                <h1 className="text-lg sm:text-xl font-semibold leading-none flex items-center gap-2">
                  <span>Choose payment method</span>
                </h1>
              </>
            ) : (
              <>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Checkout
                </p>
                <h1 className="text-lg sm:text-xl font-semibold leading-none">
                  Review & place order
                </h1>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {typeof itemCount === "number" && (
            <Badge variant="secondary" className="gap-1">
              <ShoppingCart className="h-4 w-4" />
              {itemCount} item{itemCount === 1 ? "" : "s"}
            </Badge>
          )}
          {totalFormatted && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Current total</p>
              <p className="text-base font-semibold leading-tight">
                {totalFormatted}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
