"use client";

import { PaymentGateway } from "@/types";
import { Card } from "@/components/ui/card";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  DollarSign,
} from "lucide-react";

interface PaymentMethodStatsProps {
  gateways?: PaymentGateway[];
}

export function PaymentMethodStats({ gateways }: PaymentMethodStatsProps) {
  const stats = {
    total: gateways?.length || 0,
    active: gateways?.filter((g) => g.status === "ACTIVE").length || 0,
    inactive: gateways?.filter((g) => g.status === "INACTIVE").length || 0,
    withFees: gateways?.filter((g) => g.feePercent && g.feePercent > 0).length || 0,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Gateways</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.active}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.inactive}</p>
            <p className="text-xs text-muted-foreground">Inactive</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.withFees}</p>
            <p className="text-xs text-muted-foreground">With Fees</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
