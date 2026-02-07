"use client";

import { Order } from "@/types/models/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Package,
  Calendar,
  User,
  MoreVertical,
  Eye,
  Truck,
  CheckCircle2,
  XCircle,
  DollarSign,
  AlertCircle,
  Edit,
  Trash2,
  ShieldCheck,
  ShieldX,
  Clock,
  Ban,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { useRouter } from "next/navigation";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import PaymentStatusBadge from "@/components/PaymentStatusBadge";

interface AdminOrderCardProps {
  order: Order;
  onDelete: (order: Order) => void;
  onVerifyPayment?: (order: Order, verified: boolean) => void;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
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
  FAILED_DELIVERY: {
    icon: AlertTriangle,
    color: "text-rose-600 dark:text-rose-400",
  },
};

export function AdminOrderCard({
  order,
  onDelete,
  onVerifyPayment,
  selected,
  onSelect,
}: AdminOrderCardProps) {
  const router = useRouter();
  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();
  const StatusIcon = statusConfig[order.status].icon;
  const isVerifyingPayment = order.status === "VERIFYING_PAYMENT";
  const convertedAmount = convert(
    order.currency,
    userCurrency,
    order.totalAmount,
    true,
    true,
  );

  const handleViewDetails = () => {
    router.push(`/admin/orders?uid=${order.uid}`);
  };

  return (
    <Card
      className={cn(
        "group overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4",
        selected
          ? "border-l-primary bg-primary/5"
          : "border-l-primary/20 hover:border-l-primary",
      )}
    >
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {onSelect && (
              <Checkbox
                checked={selected}
                onCheckedChange={onSelect}
                className="mt-1"
                aria-label={`Select order ${order.orderRef}`}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-muted-foreground shrink-0" />
                <h3 className="font-semibold text-lg truncate">
                  #{order.orderRef}
                </h3>
                {isVerifyingPayment && (
                  <Badge variant="destructive" className="shrink-0">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Action Required
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-3 h-3" />
                <span className="truncate">{order.user.username}</span>
                <span>•</span>
                <Calendar className="w-3 h-3" />
                <span>
                  {formatDistanceToNow(new Date(order.timestamp), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleViewDetails}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {isVerifyingPayment && onVerifyPayment && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onVerifyPayment(order, true)}
                    className="text-green-600"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Verify Payment
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onVerifyPayment(order, false)}
                    className="text-red-600"
                  >
                    <ShieldX className="w-4 h-4 mr-2" />
                    Reject Payment
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(order)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.payment.status} />
          {order.payment.method && (
            <Badge variant="outline">{order.payment.method}</Badge>
          )}
        </div>

        {/* Payment Verification Alert */}
        {isVerifyingPayment && onVerifyPayment && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                  Payment Verification Required
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  This order requires manual payment verification before
                  processing.
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant="default"
                onClick={() => onVerifyPayment(order, true)}
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verify
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onVerifyPayment(order, false)}
                className="flex-1"
              >
                <XCircle className="w-3 h-3 mr-1" />
                Reject
              </Button>
            </div>
          </div>
        )}

        {/* Order Items Summary */}
        <div className="mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-sm">
            <span className="text-muted-foreground">Items: </span>
            <span className="font-medium">
              {order.items.length} product{order.items.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {order.items.map((item) => item.product.name).join(", ")}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
            <p className="text-lg font-bold">{convertedAmount.formatted}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleViewDetails}>
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
          </div>
        </div>

        {/* Tracking Number */}
        {order.trackingNumber && (
          <div className="mt-4 p-2 bg-muted/50 rounded flex items-center gap-2">
            <Truck className="w-3 h-3 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Tracking</p>
              <p className="text-xs font-mono truncate">
                {order.trackingNumber}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
