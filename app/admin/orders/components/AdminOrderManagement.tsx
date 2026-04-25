import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldX,
  CalendarIcon,
  Loader2,
  PackagePlus,
  AlertTriangle,
} from "lucide-react";
import { Order } from "@/types/models/order";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/appContext";
import { FeatureGate } from "@/components/FeatureGate";

interface AdminOrderManagementProps {
  order: Order;
  onStatusUpdate: (status: string) => void;
  onVerifyPayment: (verified: boolean) => void;
  onTrackingUpdate: () => void;
  trackingNumber: string;
  setTrackingNumber: (value: string) => void;
  estimatedDelivery?: Date;
  setEstimatedDelivery: (date?: Date) => void;
  isUpdating: boolean;
  onCreateShipment?: () => void;
}

export function AdminOrderManagement({
  order,
  onStatusUpdate,
  onVerifyPayment,
  onTrackingUpdate,
  trackingNumber,
  setTrackingNumber,
  estimatedDelivery,
  setEstimatedDelivery,
  isUpdating,
  onCreateShipment,
}: AdminOrderManagementProps) {
  const isVerifyingPayment = order.status === "VERIFYING_PAYMENT";
  const { shopInfo } = useAppContext();
  const isSubscriptionActive = shopInfo?.subscriptionStatus === "ACTIVE";
    const isSupplierSynced = Boolean(
      order.supplierOrderUid && order.syncWithSupplier,
    );

  const statusActions = [
    { status: "PENDING", label: "Pending", icon: Clock, color: "yellow" },
    { status: "PROCESSING", label: "Processing", icon: Package, color: "blue" },
    { status: "IN_TRANSIT", label: "In Transit", icon: Truck, color: "indigo" },
    { status: "SHIPPED", label: "Shipped", icon: Truck, color: "purple" },
    {
      status: "DELIVERED",
      label: "Delivered",
      icon: CheckCircle2,
      color: "green",
    },
    {
      status: "FAILED_DELIVERY",
      label: "Failed Delivery",
      icon: AlertTriangle,
      color: "rose",
    },
    { status: "CANCELED", label: "Canceled", icon: XCircle, color: "gray" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="w-5 h-5 text-primary" />
          Order Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isVerifyingPayment ? (
          <>
            <div>
              <p className="text-sm font-medium mb-3">Payment Verification</p>
              <div className="space-y-2">
                <Button
                  onClick={() => onVerifyPayment(true)}
                  disabled={isUpdating}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Verify Payment
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => onVerifyPayment(false)}
                  disabled={isUpdating}
                  variant="destructive"
                  className="w-full"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <ShieldX className="w-4 h-4 mr-2" />
                      Reject Payment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <FeatureGate
              isAllowed={isSubscriptionActive}
              featureLabel="Order Status Management"
              description="Your subscription must be active to update order status. Please renew your subscription to continue."
              variant="inline"
            >
            <div>
              <p className="text-sm font-medium mb-3">Update Order Status</p>
              <div className="grid grid-cols-2 gap-2">
                {statusActions.map((action) => {
                  const Icon = action.icon;
                  const isActive = order.status === action.status;

                  return (
                    <Button
                      key={action.status}
                      onClick={() => onStatusUpdate(action.status)}
                      disabled={isUpdating || isActive || isSupplierSynced}
                      variant={isActive ? "default" : "outline"}
                      className={cn(
                        "w-full justify-start text-left h-auto py-3 px-3",
                        isActive && "pointer-events-none",
                      )}
                    >
                      <Icon className="w-4 h-4 mr-2 shrink-0" />
                      <span className="text-sm">{action.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
            </FeatureGate>

            <Separator />

            {/* Shipping Integration */}
            {onCreateShipment && (
              <>
                <FeatureGate
                  isAllowed={isSubscriptionActive}
                  featureLabel="Automated Shipping"
                  description="Your subscription must be active to create shipment labels. Please renew your subscription to continue."
                  variant="inline"
                >
                  <div>
                    <p className="text-sm font-medium mb-3">Automated Shipping</p>
                    <Button
                      onClick={onCreateShipment}
                      variant="outline"
                      className="w-full"
                    >
                      <PackagePlus className="w-4 h-4 mr-2" />
                      Create Shipment Label
                    </Button>
                  </div>
                </FeatureGate>
                <Separator />
              </>
            )}

            {/* Tracking Information */}
            <div>
              <p className="text-sm font-medium mb-3">Shipping Tracking</p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="tracking" className="text-xs">
                    Tracking Number
                  </Label>
                  <Input
                    id="tracking"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder={
                      order.trackingNumber || "Enter tracking number"
                    }
                    disabled={isSupplierSynced}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="delivery" className="text-xs">
                    Estimated Delivery
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !estimatedDelivery && "text-muted-foreground",
                        )}
                        disabled={isSupplierSynced}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {estimatedDelivery ? (
                          format(estimatedDelivery, "PPP")
                        ) : order.estimatedDelivery ? (
                          format(new Date(order.estimatedDelivery), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={estimatedDelivery}
                        onSelect={setEstimatedDelivery}
                        disabled={(date) => date < new Date()}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button
                  onClick={onTrackingUpdate}
                  disabled={!trackingNumber || isUpdating || isSupplierSynced}
                  className="w-full"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4 mr-2" />
                      Update Tracking
                    </>
                  )}
                </Button>
                {isSupplierSynced && (
                  <p className="text-sm text-muted-foreground">
                    This order is supplier-linked, so manual edits are disabled while syncing is enabled.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
