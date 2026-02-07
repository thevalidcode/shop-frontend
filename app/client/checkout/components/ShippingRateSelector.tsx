"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Truck, Clock } from "lucide-react";
import { ShippingRate } from "@/hooks/use-shipping";
import { useCurrencyConverter, CurrencyCode } from "@/lib/currencyConverter";
import { motion } from "framer-motion";
import Loading from "@/app/loading";

interface ShippingRateSelectorProps {
  rates: ShippingRate[];
  selectedRate: ShippingRate | null;
  onSelectRate: (rate: ShippingRate) => void;
  isLoading?: boolean;
  userCurrency: CurrencyCode;
}

export function ShippingRateSelector({
  rates,
  selectedRate,
  onSelectRate,
  isLoading,
  userCurrency,
}: ShippingRateSelectorProps) {
  const convert = useCurrencyConverter();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Shipping Options
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loading />
        </CardContent>
      </Card>
    );
  }

  if (!rates || rates.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          Shipping Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedRate?.rateId || ""}
          onValueChange={(rateId) => {
            const rate = rates.find((r) => r.rateId === rateId);
            if (rate) onSelectRate(rate);
          }}
        >
          <div className="space-y-3">
            {rates.map((rate, index) => {
              const convertedCost = convert(
                rate.currency as CurrencyCode,
                userCurrency,
                rate.cost,
                true,
                false
              );

              return (
                <motion.div
                  key={rate.rateId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Label
                    htmlFor={rate.rateId}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary/50 ${
                      selectedRate?.rateId === rate.rateId
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <RadioGroupItem value={rate.rateId} id={rate.rateId} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {rate.courierName}
                          </span>
                          {index === 0 && (
                            <Badge variant="secondary" className="text-xs">
                              Cheapest
                            </Badge>
                          )}
                        </div>
                        <span className="font-bold text-primary">
                          {convertedCost.formatted}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {rate.serviceName}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {rate.estimatedDays && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {rate.estimatedDays}{" "}
                              {rate.estimatedDays === 1 ? "day" : "days"}
                            </span>
                          </div>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {rate.platform}
                        </Badge>
                      </div>
                    </div>
                  </Label>
                </motion.div>
              );
            })}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
