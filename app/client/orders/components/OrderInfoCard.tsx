import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/types/models/order";

interface OrderInfoCardProps {
  order: Order;
}

export function OrderInfoCard({ order }: OrderInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="w-5 h-5 text-primary" />
          Order Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">
            Created
          </p>
          <p className="text-sm font-semibold">
            {format(new Date(order.timestamp), "PPp")}
          </p>
        </div>
        <Separator />
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">
            Last Updated
          </p>
          <p className="text-sm font-semibold">
            {format(new Date(order.updatedAt), "PPp")}
          </p>
        </div>
        {order.deliveredAt && (
          <>
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Delivered
              </p>
              <p className="text-sm font-semibold">
                {format(new Date(order.deliveredAt), "PPp")}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
