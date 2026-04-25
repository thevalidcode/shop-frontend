"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/wrapper";
import Loading from "@/app/loading";
import {
  useGetAdminOrderByUid,
  useUpdateOrder,
  useVerifyPayment,
} from "@/hooks/use-order";
import { AdminOrderHeader } from "./AdminOrderHeader";
import { OrderTimeline } from "@/app/client/orders/components/OrderTimeline";
import { OrderItemsList } from "@/app/client/orders/components/OrderItemsList";
import { ShippingAndNotes } from "@/app/client/orders/components/ShippingAndNotes";
import { ShippingInfoCard } from "@/app/client/orders/components/ShippingInfoCard";
import { PaymentInfoCard } from "@/app/client/orders/components/PaymentInfoCard";
import { OrderInfoCard } from "@/app/client/orders/components/OrderInfoCard";
import { AdminOrderManagement } from "./AdminOrderManagement";
import { CustomerInfoCard } from "./CustomerInfoCard";
import { ShipmentInfoCard, CreateShipmentDialog } from "./ShipmentManagement";
import { TrackingTimeline } from "@/components/TrackingTimeline";
import { useGetTrackingEvents } from "@/hooks/use-shipping";

interface AdminOrderDetailClientProps {
  orderUid: string;
}

export function AdminOrderDetailClient({
  orderUid,
}: AdminOrderDetailClientProps) {
  const router = useRouter();
  const { data: order, isLoading } = useGetAdminOrderByUid(orderUid);

  const updateOrder = useUpdateOrder();
  const verifyPayment = useVerifyPayment();

  const [trackingNumber, setTrackingNumber] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState<Date>();
  const [showCreateShipment, setShowCreateShipment] = useState(false);

  const { data: trackingEvents } = useGetTrackingEvents(
    order?.shipment?.uid || "",
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!order) {
    return (
      <Wrapper className="py-12">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The order you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/admin/orders")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </Wrapper>
    );
  }

  const handleStatusUpdate = async (status: string) => {
    await updateOrder.mutateAsync({
      orderUid: order.uid,
      status: status as any,
    });
  };

  const handleVerifyPayment = async (verified: boolean) => {
    await verifyPayment.mutateAsync({
      orderUid: order.uid,
      verified,
    });
  };

  const handleTrackingUpdate = async () => {
    if (!trackingNumber) return;
    await updateOrder.mutateAsync({
      orderUid: order.uid,
      trackingNumber,
      estimatedDelivery,
    });
    setTrackingNumber("");
    setEstimatedDelivery(undefined);
  };

  return (
    <Wrapper className="py-6">
      <AdminOrderHeader order={order} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <OrderTimeline order={order} />
          <OrderItemsList order={order} />

          {/* Shipment Section */}
          {order.shipment ? (
            <>
              <ShipmentInfoCard shipment={order.shipment} />
              {trackingEvents && trackingEvents.length > 0 && (
                <TrackingTimeline events={trackingEvents} />
              )}
            </>
          ) : (
            <CreateShipmentDialog
              order={order}
              open={showCreateShipment}
              onOpenChange={setShowCreateShipment}
            />
          )}

          <ShippingAndNotes order={order} variant="admin" />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AdminOrderManagement
            order={order}
            onStatusUpdate={handleStatusUpdate}
            onVerifyPayment={handleVerifyPayment}
            onTrackingUpdate={handleTrackingUpdate}
            trackingNumber={trackingNumber}
            setTrackingNumber={setTrackingNumber}
            estimatedDelivery={estimatedDelivery}
            setEstimatedDelivery={setEstimatedDelivery}
            isUpdating={updateOrder.isPending || verifyPayment.isPending}
            onCreateShipment={
              !order.shipment &&
              !order.deliveredAt &&
              order.status !== "DELIVERED"
                ? () => setShowCreateShipment(true)
                : undefined
            }
          />
          <CustomerInfoCard order={order} />
          <ShippingInfoCard order={order} />
          <PaymentInfoCard order={order} />
          <OrderInfoCard order={order} role="admin" />
        </div>
      </div>
    </Wrapper>
  );
}
