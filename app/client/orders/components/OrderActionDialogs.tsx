import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order } from "@/types/models/order";
import { ShippingInfo } from "@/types";

interface OrderActionDialogsProps {
  order: Order;
  shippingInfos?: ShippingInfo[];
  cancelDialogOpen: boolean;
  setCancelDialogOpen: (open: boolean) => void;
  refundDialogOpen: boolean;
  setRefundDialogOpen: (open: boolean) => void;
  shippingInfoDialogOpen: boolean;
  setShippingInfoDialogOpen: (open: boolean) => void;
  refundReason: string;
  setRefundReason: (reason: string) => void;
  selectedShippingInfoUid: string;
  setSelectedShippingInfoUid: (uid: string) => void;
  handleCancel: () => void;
  handleRefundRequest: () => void;
  handleShippingInfoChange: () => void;
  isCanceling: boolean;
  isRefunding: boolean;
  isUpdatingShippingInfo: boolean;
}

export function OrderActionDialogs({
  order,
  shippingInfos,
  cancelDialogOpen,
  setCancelDialogOpen,
  refundDialogOpen,
  setRefundDialogOpen,
  shippingInfoDialogOpen,
  setShippingInfoDialogOpen,
  refundReason,
  setRefundReason,
  selectedShippingInfoUid,
  setSelectedShippingInfoUid,
  handleCancel,
  handleRefundRequest,
  handleShippingInfoChange,
  isCanceling,
  isRefunding,
  isUpdatingShippingInfo,
}: OrderActionDialogsProps) {
  return (
    <>
      {/* Cancel Confirmation */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel order #{order.orderRef}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Order</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCanceling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Canceling...
                </>
              ) : (
                "Cancel Order"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Refund Request Dialog */}
      <AlertDialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Request Refund</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for your refund request. Our team will
              review it and get back to you.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="refund-reason">Reason for Refund</Label>
            <Textarea
              id="refund-reason"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Please explain why you're requesting a refund..."
              rows={4}
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRefundReason("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRefundRequest}
              disabled={!refundReason.trim() || isRefunding}
            >
              {isRefunding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Shipping Information Dialog */}
      <AlertDialog
        open={shippingInfoDialogOpen}
        onOpenChange={setShippingInfoDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Shipping Information</AlertDialogTitle>
            <AlertDialogDescription>
              Select a different shipping address for this order. The order must
              be in pending, processing, or verifying payment status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="shipping-select">Select Shipping Information</Label>
            <Select
              value={selectedShippingInfoUid}
              onValueChange={setSelectedShippingInfoUid}
            >
              <SelectTrigger id="shipping-select" className="mt-2 w-full">
                <SelectValue placeholder="Choose shipping information" />
              </SelectTrigger>
              <SelectContent>
                {shippingInfos?.map((shipping) => (
                  <SelectItem
                    key={shipping.uid}
                    value={shipping.uid}
                    disabled={shipping.uid === order.shippingInfoUid}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {shipping.fullName}
                        {shipping.uid === order.shippingInfoUid && " (Current)"}
                        {shipping.isDefault && " (Default)"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {shipping.city}, {shipping.country}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedShippingInfoUid("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleShippingInfoChange}
              disabled={!selectedShippingInfoUid || isUpdatingShippingInfo}
            >
              {isUpdatingShippingInfo ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Shipping Information"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
