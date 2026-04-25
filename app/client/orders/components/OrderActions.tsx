import { XCircle, DollarSign, Edit3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/models/order";
import { ShippingInfo } from "@/types";

interface OrderActionsProps {
  order: Order;
  shippingInfos?: ShippingInfo[];
  onCancel: () => void;
  onRefund: () => void;
  onChangeShippingInfo: () => void;
  isCanceling: boolean;
  isRefunding: boolean;
  isUpdatingShippingInfo: boolean;
}

export function OrderActions({
  order,
  shippingInfos,
  onCancel,
  onRefund,
  onChangeShippingInfo,
  isCanceling,
  isRefunding,
  isUpdatingShippingInfo,
}: OrderActionsProps) {
  const canCancel =
    order.status === "PENDING" ||
    order.status === "PROCESSING" ||
    order.status === "VERIFYING_PAYMENT";
  const canRequestRefund =
    order.status === "DELIVERED" || order.status === "SHIPPED";
  const canChangeShippingInfo =
    order.status === "PENDING" ||
    order.status === "PROCESSING" ||
    order.status === "VERIFYING_PAYMENT";

  const hasActions =
    canCancel ||
    canRequestRefund ||
    (canChangeShippingInfo && shippingInfos && shippingInfos.length > 1);

  if (!hasActions) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {canCancel && (
          <Button
            variant="destructive"
            className="w-full"
            onClick={onCancel}
            disabled={isCanceling}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Cancel Order
          </Button>
        )}
        {canRequestRefund && (
          <Button
            variant="outline"
            className="w-full"
            onClick={onRefund}
            disabled={isRefunding}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Request Refund
          </Button>
        )}
        {canChangeShippingInfo && shippingInfos && shippingInfos.length > 1 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={onChangeShippingInfo}
            disabled={isUpdatingShippingInfo}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Change Shipping Information
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
