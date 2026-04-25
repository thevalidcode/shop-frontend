"use client";

import type { Supplier } from "@/types";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftRight, CirclePlus, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";

interface SuppliersListProps {
  suppliers: Supplier[];
  isLoading: boolean;
  onAddSupplier: () => void;
  onEditSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (uid: string) => void;
}

const DEFAULT_SUPPLIER_ICON =
  "https://cdn-icons-png.flaticon.com/512/2097/2097106.png";

export function SuppliersList({
  suppliers,
  isLoading,
  onAddSupplier,
  onEditSupplier,
  onDeleteSupplier,
}: SuppliersListProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ArrowLeftRight className="h-4 w-4" />
          Connected Suppliers
        </CardTitle>
        <Button
          type="button"
          onClick={onAddSupplier}
          className="w-full"
          size="sm"
        >
          <CirclePlus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </CardHeader>

      <CardContent className="space-y-2">
        {isLoading ? (
          <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
            <ArrowLeftRight className="mx-auto mb-2 h-5 w-5 opacity-50" />
            Loading suppliers...
          </div>
        ) : suppliers.length ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {suppliers.map((supplier) => (
              <div
                key={supplier.uid}
                className="flex items-center justify-between gap-3 rounded-lg border px-3 py-3 bg-card hover:bg-muted/40 transition"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Supplier Logo */}
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Image
                      src={supplier.image || DEFAULT_SUPPLIER_ICON}
                      alt={supplier.name}
                      width={32}
                      height={32}
                      className="h-5 w-5 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          DEFAULT_SUPPLIER_ICON;
                      }}
                    />
                  </div>

                  {/* Supplier Info */}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate">
                      {supplier.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {supplier.apiUrl}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                      {supplier.sync && (
                        <Badge variant="secondary" className="text-xs">
                          Sync
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Margin: {supplier.percentage}%
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => onEditSupplier(supplier)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteSupplier(supplier.uid)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            featureLabel="Supplier Management"
            description="No suppliers added yet. Connect one to get started."
          />
        )}
      </CardContent>
    </Card>
  );
}
