"use client";

import { Order } from "@/types/models/order";
import { Card } from "@/components/ui/card";
import {
  Package,
  Calendar,
  MapPin,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  Ban,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import PaymentStatusBadge from "@/components/PaymentStatusBadge";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { useRouter } from "next/navigation";

interface OrderCardProps {
  order: Order;
}

const statusConfig = {
  PENDING: { icon: Clock, color: "text-yellow-600 dark:text-yellow-400" },
  PROCESSING: { icon: AlertCircle, color: "text-blue-600 dark:text-blue-400" },
  SHIPPED: { icon: Truck, color: "text-purple-600 dark:text-purple-400" },
  DELIVERED: {
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
  },
  CANCELED: { icon: XCircle, color: "text-gray-600 dark:text-gray-400" },
  REFUNDED: { icon: DollarSign, color: "text-orange-600 dark:text-orange-400" },
  VERIFYING_PAYMENT: { icon: Ban, color: "text-red-600 dark:text-red-400" },
  IN_TRANSIT: { icon: Truck, color: "text-indigo-600 dark:text-indigo-400" },
  FAILED_DELIVERY: { icon: AlertTriangle, color: "text-rose-600 dark:text-rose-400" },
};

export function OrderCard({ order }: OrderCardProps) {
  const router = useRouter();
  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();
  const StatusIcon = statusConfig[order.status].icon;

  const handleViewDetails = () => {
    router.push(`/client/orders?uid=${order.uid}`);
  };

  const convertedAmount = convert(
    order.currency,
    userCurrency,
    order.totalAmount,
    true,
  );

  return (
    <Card 
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-muted-foreground shrink-0" />
              <h3 className="font-semibold text-lg truncate">
                Order #{order.orderRef}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDistanceToNow(new Date(order.timestamp), {
                addSuffix: true,
              })}
            </p>
          </div>

          <StatusIcon
            className={cn("w-6 h-6 shrink-0", statusConfig[order.status].color)}
          />
        </div>

        {/* Status & Payment */}
        <div className="flex flex-wrap gap-2 mb-4">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.payment.status} />
        </div>

        {/* Items Preview */}
        <div className="space-y-2 mb-4">
          {order.items.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              {item.product.imageUrl && (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {item.product.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Qty: {item.quantity}
                </p>
              </div>
            </div>
          ))}

          {order.items.length > 2 && (
            <p className="text-xs text-muted-foreground pl-15">
              +{order.items.length - 2} more item
              {order.items.length - 2 > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
            <p className="text-lg font-bold">{convertedAmount.formatted}</p>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            View Details
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Tracking Number (if available) */}
        {order.trackingNumber && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Tracking Number</p>
              <p className="text-sm font-mono truncate">
                {order.trackingNumber}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
