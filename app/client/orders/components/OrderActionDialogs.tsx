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
import { BillingInfo } from "@/types";

interface OrderActionDialogsProps {
  order: Order;
  billingInfos?: BillingInfo[];
  cancelDialogOpen: boolean;
  setCancelDialogOpen: (open: boolean) => void;
  refundDialogOpen: boolean;
  setRefundDialogOpen: (open: boolean) => void;
  billingDialogOpen: boolean;
  setBillingDialogOpen: (open: boolean) => void;
  refundReason: string;
  setRefundReason: (reason: string) => void;
  selectedBillingUid: string;
  setSelectedBillingUid: (uid: string) => void;
  handleCancel: () => void;
  handleRefundRequest: () => void;
  handleBillingChange: () => void;
  isCanceling: boolean;
  isRefunding: boolean;
  isUpdatingBilling: boolean;
}

export function OrderActionDialogs({
  order,
  billingInfos,
  cancelDialogOpen,
  setCancelDialogOpen,
  refundDialogOpen,
  setRefundDialogOpen,
  billingDialogOpen,
  setBillingDialogOpen,
  refundReason,
  setRefundReason,
  selectedBillingUid,
  setSelectedBillingUid,
  handleCancel,
  handleRefundRequest,
  handleBillingChange,
  isCanceling,
  isRefunding,
  isUpdatingBilling,
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

      {/* Change Billing Info Dialog */}
      <AlertDialog open={billingDialogOpen} onOpenChange={setBillingDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Billing Information</AlertDialogTitle>
            <AlertDialogDescription>
              Select a different billing address for this order. The order must
              be in pending, processing, or verifying payment status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="billing-select">Select Billing Address</Label>
            <Select
              value={selectedBillingUid}
              onValueChange={setSelectedBillingUid}
            >
              <SelectTrigger id="billing-select" className="mt-2 w-full">
                <SelectValue placeholder="Choose billing address" />
              </SelectTrigger>
              <SelectContent>
                {billingInfos?.map((billing) => (
                  <SelectItem
                    key={billing.uid}
                    value={billing.uid}
                    disabled={billing.uid === order.billingInfoUid}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {billing.fullName}
                        {billing.uid === order.billingInfoUid && " (Current)"}
                        {billing.isDefault && " (Default)"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {billing.city}, {billing.country}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedBillingUid("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBillingChange}
              disabled={!selectedBillingUid || isUpdatingBilling}
            >
              {isUpdatingBilling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Billing Info"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
