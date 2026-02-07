"use client";

import { Badge } from "@/components/ui/badge";
import { ShipmentStatus } from "@/types";
import { Package, Truck, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShipmentStatusBadgeProps {
  status: ShipmentStatus;
  className?: string;
}

const statusConfig: Record<
  ShipmentStatus,
  { label: string; icon: typeof Package; variant: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    icon: AlertCircle,
    variant: "secondary",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  PROCESSING: {
    label: "Processing",
    icon: Package,
    variant: "secondary",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  },
  IN_TRANSIT: {
    label: "In Transit",
    icon: Truck,
    variant: "secondary",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    icon: Truck,
    variant: "secondary",
    className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
  },
  DELIVERED: {
    label: "Delivered",
    icon: CheckCircle2,
    variant: "secondary",
    className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  },
  FAILED: {
    label: "Failed",
    icon: XCircle,
    variant: "destructive",
    className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  },
  CANCELED: {
    label: "Canceled",
    icon: XCircle,
    variant: "secondary",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  },
};

export default function ShipmentStatusBadge({
  status,
  className,
}: ShipmentStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={cn("gap-1.5", config.className, className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
