import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import PaymentStatusBadge from "@/components/PaymentStatusBadge";
import { Order } from "@/types/models/order";

interface AdminOrderHeaderProps {
  order: Order;
}

export function AdminOrderHeader({ order }: AdminOrderHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/admin/orders")}
        className="mb-4 -ml-3"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Button>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            Order #{order.orderRef}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Placed on {format(new Date(order.timestamp), "PPP 'at' p")}
          </p>
        </div>
        <div className="flex gap-3">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.payment.status} />
        </div>
      </div>
    </div>
  );
}
