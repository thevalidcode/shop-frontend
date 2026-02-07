"use client";

import { OrderStatus } from "@/types";

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config: Record<
    OrderStatus,
    { label: string; classes: string; dot: string }
  > = {
    PENDING: {
      label: "Pending",
      classes:
        "text-amber-700 bg-amber-100 border-amber-200 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-800",
      dot: "#f59e0b",
    },
    PROCESSING: {
      label: "Processing",
      classes:
        "text-cyan-700 bg-cyan-100 border-cyan-200 dark:text-cyan-400 dark:bg-cyan-950 dark:border-cyan-800",
      dot: "#06b6d4",
    },
    IN_TRANSIT: {
      label: "In Transit",
      classes:
        "text-indigo-700 bg-indigo-100 border-indigo-200 dark:text-indigo-400 dark:bg-indigo-950 dark:border-indigo-800",
      dot: "#6366f1",
    },
    SHIPPED: {
      label: "Shipped",
      classes:
        "text-blue-700 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800",
      dot: "#2563eb",
    },
    DELIVERED: {
      label: "Delivered",
      classes:
        "text-emerald-700 bg-emerald-100 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950 dark:border-emerald-800",
      dot: "#059669",
    },
    FAILED_DELIVERY: {
      label: "Failed Delivery",
      classes:
        "text-rose-700 bg-rose-100 border-rose-200 dark:text-rose-400 dark:bg-rose-950 dark:border-rose-800",
      dot: "#e11d48",
    },
    CANCELED: {
      label: "Canceled",
      classes:
        "text-red-700 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800",
      dot: "#dc2626",
    },
    VERIFYING_PAYMENT: {
      label: "Verifying Payment",
      classes:
        "text-amber-700 bg-amber-100 border-amber-200 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-800",
      dot: "#f59e0b",
    },
    REFUNDED: {
      label: "Refunded",
      classes:
        "text-blue-700 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800",
      dot: "#2563eb",
    },
  };

  const { label, classes, dot } = config[status] ?? {
    label: status,
    classes: "text-muted-foreground bg-muted border-border",
    dot: "#6b7280",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${classes}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: dot }}
      />
      {label}
    </span>
  );
}
