"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Truck, FileText, Edit, Save, X, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Order } from "@/types/models/order";
import { useUpdateOrder, useUpdateUserOrder } from "@/hooks/use-order";
import { toast } from "sonner";

interface ShippingAndNotesProps {
  order: Order;
  variant?: "user" | "admin";
}

export function ShippingAndNotes({
  order,
  variant = "user",
}: ShippingAndNotesProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(order.notes || "");
  const updateOrder =
    variant === "user" ? useUpdateUserOrder() : useUpdateOrder();

  const handleSaveNotes = async () => {
    if (notes.trim() === (order.notes || "")) {
      setIsEditingNotes(false);
      return;
    }

    await updateOrder.mutateAsync({
      orderUid: order.uid,
      notes: notes.trim() || undefined,
    });
    setIsEditingNotes(false);
  };

  const handleCancelEdit = () => {
    setNotes(order.notes || "");
    setIsEditingNotes(false);
  };

  const handleMarkAsReceived = async () => {
    const canMarkReceived = ["SHIPPED", "DELIVERED"].includes(order.status);

    if (!canMarkReceived) {
      toast.error("Order must be shipped before marking as received");
      return;
    }

    if (order.deliveredAt) {
      toast.info("Order already marked as received");
      return;
    }

    await updateOrder.mutateAsync({
      orderUid: order.uid,
      received: true,
    });
  };

  const showShipping = order.trackingNumber || order.estimatedDelivery;
  const canMarkReceived =
    ["SHIPPED", "DELIVERED"].includes(order.status) && !order.deliveredAt;

  if (!showShipping && !order.notes && !isEditingNotes) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-primary" />
            Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingNotes(true)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Add Notes
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-wrap gap-6">
      {showShipping && (
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Truck className="w-5 h-5 text-primary" />
              Shipping
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.trackingNumber && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Tracking Number
                </p>
                <p className="font-mono font-semibold bg-muted px-3 py-2 rounded">
                  {order.trackingNumber}
                </p>
              </div>
            )}
            {order.estimatedDelivery && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Estimated Delivery
                </p>
                <p className="font-semibold">
                  {format(new Date(order.estimatedDelivery), "PPP")}
                </p>
              </div>
            )}
            {order.deliveredAt && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Delivered On
                </p>
                <p className="font-semibold text-green-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {format(new Date(order.deliveredAt), "PPP")}
                </p>
              </div>
            )}
            {canMarkReceived && (
              <Button
                variant="default"
                size="sm"
                onClick={handleMarkAsReceived}
                disabled={updateOrder.isPending}
                className="w-full mt-2"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Received
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Notes
            </span>
            {!isEditingNotes && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingNotes(true)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditingNotes ? (
            <div className="space-y-3">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about your order..."
                rows={4}
                className="resize-none"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveNotes}
                  disabled={updateOrder.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={updateOrder.isPending}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {order.notes || (
                <span className="text-muted-foreground italic">
                  No notes added yet
                </span>
              )}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
