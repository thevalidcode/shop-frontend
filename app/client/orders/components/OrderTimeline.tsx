import { format } from "date-fns";
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/models/order";

interface OrderTimelineProps {
  order: Order;
}

export function OrderTimeline({ order }: OrderTimelineProps) {
  const timelineEvents = [
    { date: order.timestamp, label: "Order Placed", icon: Package },
    order.status !== "PENDING" && {
      date: order.updatedAt,
      label: "Processing Started",
      icon: Clock,
    },
    (order.status === "IN_TRANSIT" || order.status === "SHIPPED") && {
      date: order.updatedAt,
      label: order.status === "IN_TRANSIT" ? "In Transit" : "Shipped",
      icon: Truck,
    },
    order.deliveredAt && {
      date: order.deliveredAt,
      label: "Delivered",
      icon: CheckCircle2,
    },
    order.status === "FAILED_DELIVERY" && {
      date: order.updatedAt,
      label: "Delivery Failed",
      icon: AlertTriangle,
    },
    order.status === "CANCELED" && {
      date: order.updatedAt,
      label: "Canceled",
      icon: XCircle,
    },
    order.status === "REFUNDED" && {
      date: order.updatedAt,
      label: "Refunded",
      icon: DollarSign,
    },
  ].filter(Boolean);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-primary" />
          Order Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timelineEvents.map((event: any, index) => {
            const Icon = event.icon;
            return (
              <div key={index} className="flex items-start gap-4 relative">
                <div className="relative flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border-2 border-primary">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  {index < timelineEvents.length - 1 && (
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-linear-to-b from-primary/40 to-transparent" />
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <p className="font-semibold mb-1">{event.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.date), "PPP 'at' p")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
