import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PaymentStatusBadge from "@/components/PaymentStatusBadge";
import { Order } from "@/types/models/order";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { PaymentGatewayPlatform } from "@/types";
import Image from "next/image";

const platformLogos: Record<PaymentGatewayPlatform, string> = {
  PAYSTACK: "/images/paystack.png",
  FLUTTERWAVE: "/images/flutterwave.jpeg",
  STRIPE: "/images/paystack.png",
  MANUAL: "/images/manual-payment.webp",
  CREDIT: "/images/manual-payment.webp",
};

interface PaymentInfoCardProps {
  order: Order;
}

export function PaymentInfoCard({ order }: PaymentInfoCardProps) {
  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();

  const convertedAmount = convert(
    order.currency,
    userCurrency,
    order.totalAmount,
    true,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="w-5 h-5 text-primary" />
          Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">
            Method
          </span>
          <span className="font-semibold">{order.payment.method}</span>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">
            Status
          </span>
          <PaymentStatusBadge status={order.payment.status} />
        </div>
        {order.payment.paymentMethod && (
          <>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Gateway
              </span>
              <div className="flex items-center gap-2">
                <Image
                  src={platformLogos[order.payment.paymentMethod.platform]}
                  alt={order.payment.paymentMethod.name}
                  width={24}
                  height={24}
                  className="object-contain rounded"
                />
                <span className="font-semibold text-sm">
                  {order.payment.paymentMethod.name}
                </span>
              </div>
            </div>
          </>
        )}
        {order.payment.uid && (
          <>
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Reference
              </p>
              <p className="font-mono text-xs font-semibold bg-muted px-2 py-1.5 rounded break-all">
                {order.payment.uid}
              </p>
            </div>
          </>
        )}
        <Separator />
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">
            Amount
          </span>
          <span className="font-bold text-lg text-primary">
            {convertedAmount.formatted}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
