"use client";

import { Product } from "@/types";
import { Card } from "@/components/ui/card";
import {
  Package,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
} from "lucide-react";

interface ProductStatsProps {
  products?: Product[];
}

export function ProductStats({ products }: ProductStatsProps) {
  const stats = {
    total: products?.length || 0,
    active: products?.filter((p) => p.status === "ACTIVE").length || 0,
    inactive: products?.filter((p) => p.status === "INACTIVE").length || 0,
    outOfStock: products?.filter((p) => p.status === "OUT_OF_STOCK").length || 0,
    featured: products?.filter((p) => p.isFeatured).length || 0,
    withDiscount: products?.filter((p) => p.discount && p.discount.value > 0).length || 0,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Products</p>
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
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.outOfStock}</p>
            <p className="text-xs text-muted-foreground">Out of Stock</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.featured}</p>
            <p className="text-xs text-muted-foreground">Featured</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.withDiscount}</p>
            <p className="text-xs text-muted-foreground">On Sale</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
