"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/wrapper";
import { PageContent } from "@/app/(root)/components/page-content";
import Loading from "@/app/loading";
import {
  useGetUserOrderByUid,
  useCancelOrder,
  useRequestRefund,
  useUpdateOrderBilling,
} from "@/hooks/use-order";
import { useGetBillingInfo } from "@/hooks/use-billing-info";
import { useGetTrackingEvents } from "@/hooks/use-shipping";
import { OrderHeader } from "./OrderHeader";
import { OrderTimeline } from "./OrderTimeline";
import { OrderItemsList } from "./OrderItemsList";
import { ShippingAndNotes } from "./ShippingAndNotes";
import { OrderActions } from "./OrderActions";
import { BillingInfoCard } from "./BillingInfoCard";
import { PaymentInfoCard } from "./PaymentInfoCard";
import { OrderInfoCard } from "./OrderInfoCard";
import { OrderActionDialogs } from "./OrderActionDialogs";
import { ClientShipmentCard } from "./ClientShipmentCard";
import { TrackingTimeline } from "@/components/TrackingTimeline";

interface OrderDetailClientProps {
  orderUid: string;
}

export function OrderDetailClient({ orderUid }: OrderDetailClientProps) {
  const router = useRouter();
  const { data: order, isLoading } = useGetUserOrderByUid(orderUid);
  const { data: billingInfos } = useGetBillingInfo();

  const cancelOrder = useCancelOrder();
  const requestRefund = useRequestRefund();
  const updateBilling = useUpdateOrderBilling();

  const { data: trackingEvents } = useGetTrackingEvents(
    order?.shipment?.uid || ""
  );

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [billingDialogOpen, setBillingDialogOpen] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [selectedBillingUid, setSelectedBillingUid] = useState("");

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
            The order you're looking for doesn't exist or you don't have access
            to it.
          </p>
          <Button onClick={() => router.push("/client/orders")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </Wrapper>
    );
  }

  const handleCancel = async () => {
    await cancelOrder.mutateAsync(order.uid);
    setCancelDialogOpen(false);
  };

  const handleRefundRequest = async () => {
    if (!refundReason.trim()) return;
    await requestRefund.mutateAsync({
      orderUid: order.uid,
      reason: refundReason,
    });
    setRefundDialogOpen(false);
    setRefundReason("");
  };

  const handleBillingChange = async () => {
    if (!selectedBillingUid) return;
    await updateBilling.mutateAsync({
      orderUid: order.uid,
      billingInfoUid: selectedBillingUid,
    });
    setBillingDialogOpen(false);
    setSelectedBillingUid("");
  };

  return (
    <>
      <Wrapper className="py-6">
        <PageContent pageType="ORDERS" />

        <OrderHeader order={order} />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <OrderTimeline order={order} />
            <OrderItemsList order={order} />
            
            {/* Shipment Tracking Section */}
            {order.shipment && (
              <>
                <ClientShipmentCard shipment={order.shipment} />
                {trackingEvents && trackingEvents.length > 0 && (
                  <TrackingTimeline events={trackingEvents} />
                )}
              </>
            )}
            
            <ShippingAndNotes order={order} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <OrderActions
              order={order}
              billingInfos={billingInfos}
              onCancel={() => setCancelDialogOpen(true)}
              onRefund={() => setRefundDialogOpen(true)}
              onChangeBilling={() => setBillingDialogOpen(true)}
              isCanceling={cancelOrder.isPending}
              isRefunding={requestRefund.isPending}
              isUpdatingBilling={updateBilling.isPending}
            />
            <BillingInfoCard order={order} />
            <PaymentInfoCard order={order} />
            <OrderInfoCard order={order} />
          </div>
        </div>
      </Wrapper>

      <OrderActionDialogs
        order={order}
        billingInfos={billingInfos}
        cancelDialogOpen={cancelDialogOpen}
        setCancelDialogOpen={setCancelDialogOpen}
        refundDialogOpen={refundDialogOpen}
        setRefundDialogOpen={setRefundDialogOpen}
        billingDialogOpen={billingDialogOpen}
        setBillingDialogOpen={setBillingDialogOpen}
        refundReason={refundReason}
        setRefundReason={setRefundReason}
        selectedBillingUid={selectedBillingUid}
        setSelectedBillingUid={setSelectedBillingUid}
        handleCancel={handleCancel}
        handleRefundRequest={handleRefundRequest}
        handleBillingChange={handleBillingChange}
        isCanceling={cancelOrder.isPending}
        isRefunding={requestRefund.isPending}
        isUpdatingBilling={updateBilling.isPending}
      />
    </>
  );
}
