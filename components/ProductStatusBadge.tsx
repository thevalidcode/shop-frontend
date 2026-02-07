"use client";

import { ProductStatus } from "@/types";

export default function ProductStatusBadge({
  status,
}: {
  status: ProductStatus;
}) {
  const config: Record<
    ProductStatus,
    { label: string; classes: string; dot: string }
  > = {
    INACTIVE: {
      label: "Inactive",
      classes:
        "text-cyan-700 bg-cyan-100 border-cyan-200 dark:text-cyan-400 dark:bg-cyan-950 dark:border-cyan-800",
      dot: "#06b6d4",
    },
    ACTIVE: {
      label: "Active",
      classes:
        "text-emerald-700 bg-emerald-100 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950 dark:border-emerald-800",
      dot: "#059669",
    },
    OUT_OF_STOCK: {
      label: "Out of Stock",
      classes:
        "text-rose-700 bg-rose-100 border-rose-200 dark:text-rose-400 dark:bg-rose-950 dark:border-rose-800",
      dot: "#e11d48",
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
