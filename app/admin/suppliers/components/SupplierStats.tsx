"use client";

import type { Supplier } from "@/types";
import { Card } from "@/components/ui/card";
import { ArrowLeftRight, CheckCircle2, RefreshCw, Store } from "lucide-react";

interface SupplierStatsProps {
  suppliers: Supplier[];
}

export function SupplierStats({ suppliers }: SupplierStatsProps) {
  const total = suppliers.length;
  const synced = suppliers.filter((item) => item.sync).length;
  const internal = suppliers.filter((item) => item.isInternal).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <ArrowLeftRight className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground">Total Suppliers</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>π
            <p className="text-2xl font-bold">{synced}</p>
            <p className="text-xs text-muted-foreground">Sync Enabled</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Store className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{internal}</p>
            <p className="text-xs text-muted-foreground">Internal Sources</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
