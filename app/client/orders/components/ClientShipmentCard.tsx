"use client";

import { ShipmentPublic } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Truck, CheckCircle2, XCircle, Copy, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusConfig = {
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

interface ClientShipmentCardProps {
  shipment: ShipmentPublic;
}

export function ClientShipmentCard({ shipment }: ClientShipmentCardProps) {
  const config = statusConfig[shipment.status as keyof typeof statusConfig];
  const Icon = config.icon;

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(shipment.trackingNumber);
    toast.success("Tracking number copied to clipboard");
  };

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
              <h3 className="text-lg font-semibold mb-1">Shipment Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Shipped via {shipment.platform}
              </p>
            </div>
            <Badge className={cn("gap-1", config.bgColor, config.color)}>
              <Icon className="h-3 w-3" />
              {shipment.status.replace(/_/g, " ")}
            </Badge>
          </div>

          <div className="grid gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Tracking Number</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-md bg-muted px-3 py-2 font-mono text-sm">
                  {shipment.trackingNumber}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyTrackingNumber}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {shipment.estimatedDelivery && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Shipped</p>
                  <p className="font-medium">
                    {formatDistanceToNow(new Date(shipment.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            )}

            {shipment.deliveredAt && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Delivered</p>
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
          </div>

          {shipment.status === "DELIVERED" && (
            <div className="rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-100">
                    Package Delivered
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-0.5">
                    Your package has been successfully delivered. Enjoy your order!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
