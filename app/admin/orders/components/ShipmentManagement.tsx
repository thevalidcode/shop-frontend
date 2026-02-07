"use client";

import { useState } from "react";
import { Order, ShipmentAdmin, ShipmentStatus, WeightUnit } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateShipment } from "@/hooks/use-shipping";
import {
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  MapPin,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CreateShipmentDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateShipmentDialog({
  order,
  open,
  onOpenChange,
}: CreateShipmentDialogProps) {
  const [weight, setWeight] = useState("1");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("KG");

  const createMutation = useCreateShipment();

  const handleCreate = async () => {
    await createMutation.mutateAsync({
      orderUid: order.uid,
      weight: parseFloat(weight),
      weightUnit,
    });
    onOpenChange(false);
    setWeight("1");
    setWeightUnit("KG");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 max-h-[90vh] p-0 overflow-y-auto">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Create Shipment</DialogTitle>
          <DialogDescription>
            Create a shipment for order {order.orderRef}
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4 space-y-5">
          <div className="space-y-1.5">
            <Label>Shipping Address</Label>
            <div className="rounded-md border p-3 bg-muted/50 space-y-1 text-sm">
              <p className="font-medium">{order.billingInfo.fullName}</p>
              <p>{order.billingInfo.address}</p>
              <p>
                {order.billingInfo.city}, {order.billingInfo.state}{" "}
                {order.billingInfo.postalCode}
              </p>
              <p>{order.billingInfo.country}</p>
              {order.billingInfo.phone && (
                <p>Phone: {order.billingInfo.phone}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="weight">Package Weight</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="1.0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="weightUnit">Unit</Label>
              <Select
                value={weightUnit}
                onValueChange={(value) => setWeightUnit(value as WeightUnit)}
              >
                <SelectTrigger id="weightUnit" className="w-full">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KG">Kilograms (kg)</SelectItem>
                  <SelectItem value="G">Grams (g)</SelectItem>
                  <SelectItem value="LB">Pounds (lb)</SelectItem>
                  <SelectItem value="OZ">Ounces (oz)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!weight || parseFloat(weight) <= 0 || createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Shipment"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const statusConfig: Record<
  ShipmentStatus,
  { icon: typeof Package; color: string; bgColor: string }
> = {
  PENDING: {
    icon: Package,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
  },
  PROCESSING: {
    icon: Package,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  IN_TRANSIT: {
    icon: Truck,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
  },
  OUT_FOR_DELIVERY: {
    icon: Truck,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
  },
  DELIVERED: {
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/20",
  },
  FAILED: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/20",
  },
  CANCELED: {
    icon: XCircle,
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-900/20",
  },
};

interface ShipmentInfoCardProps {
  shipment: ShipmentAdmin;
}

export function ShipmentInfoCard({ shipment }: ShipmentInfoCardProps) {
  const config = statusConfig[shipment.status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Shipment Details</h3>
              <p className="text-sm text-muted-foreground">
                Created {formatDistanceToNow(new Date(shipment.createdAt))} ago
              </p>
            </div>
            <Badge className={cn("gap-1", config.bgColor, config.color)}>
              <Icon className="h-3 w-3" />
              {shipment.status.replace(/_/g, " ")}
            </Badge>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Platform</p>
                <p className="font-medium">{shipment.platform}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm">{shipment.trackingNumber}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => navigator.clipboard.writeText(shipment.trackingNumber)}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Shipping Cost</p>
                <p className="font-medium">
                  {shipment.currency} {parseFloat(shipment.shippingCost).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Package Weight</p>
                <p className="font-medium">
                  {shipment.packageDetails.weight} {shipment.packageDetails.weightUnit}
                </p>
              </div>
            </div>

            {shipment.estimatedDelivery && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Estimated Delivery
                </p>
                <p className="font-medium">
                  {new Date(shipment.estimatedDelivery).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}

            {shipment.deliveredAt && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Delivered At</p>
                <p className="font-medium">
                  {new Date(shipment.deliveredAt).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Shipping Address
              </p>
              <div className="rounded-md border p-3 bg-muted/50 space-y-0.5 text-sm">
                <p className="font-medium">{shipment.recipientAddress.name}</p>
                <p>{shipment.recipientAddress.street}</p>
                <p>
                  {shipment.recipientAddress.city}, {shipment.recipientAddress.state}{" "}
                  {shipment.recipientAddress.postalCode}
                </p>
                <p>{shipment.recipientAddress.country}</p>
                {shipment.recipientAddress.phone && (
                  <p className="text-muted-foreground">
                    Phone: {shipment.recipientAddress.phone}
                  </p>
                )}
              </div>
            </div>

            {shipment.labelUrl && (
              <Button asChild variant="outline" className="w-full">
                <a
                  href={shipment.labelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Shipping Label
                </a>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
