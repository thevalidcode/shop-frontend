"use client";

import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, Clock, Wallet } from "lucide-react";
import { Payment } from "@/types";
import { useMemo } from "react";
import { useAppContext } from "@/context/appContext";
import { useCurrencyConverter } from "@/lib/currencyConverter";

interface PaymentStatsProps {
  payments: Payment[];
}

type AmountCurrency = { amount: number; currency: string };

interface Stats {
  totalAmount: AmountCurrency;
  totalPayments: number;
  pendingCount: number;
  successRate: number;
}

export function PaymentStats({ payments }: PaymentStatsProps) {
  const { userCurrency } = useAppContext();
  const convert = useCurrencyConverter();

  const stats = useMemo<Stats>(() => {
    if (!payments || payments.length === 0) {
      return {
        totalAmount: { amount: 0, currency: "USD" },
        totalPayments: 0,
        pendingCount: 0,
        successRate: 0,
      };
    }

    const totalAmount = payments
      .filter((p) => p.status === "SUCCESS")
      .reduce((sum, p) => {
        const converted = convert(p.currency, "USD", p.chargedAmount ?? "0");
        const amt =
          typeof converted.amount === "string"
            ? parseFloat(converted.amount)
            : Number(converted.amount);
        return sum + (isNaN(amt) ? 0 : amt);
      }, 0);

    const totalPayments = payments.length;
    const pendingCount = payments.filter((p) => p.status === "PENDING").length;
    const successCount = payments.filter((p) => p.status === "SUCCESS").length;
    const successRate =
      totalPayments > 0 ? (successCount / totalPayments) * 100 : 0;

    return {
      totalAmount: { amount: totalAmount, currency: "USD" },
      totalPayments,
      pendingCount,
      successRate,
    };
  }, [payments, convert]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.totalPayments.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Payments</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {convert(
                stats.totalAmount.currency as any,
                userCurrency,
                stats.totalAmount.amount,
                true,
                false
              ).formatted}
            </p>
            <p className="text-xs text-muted-foreground">Total Amount</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Success Rate</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
