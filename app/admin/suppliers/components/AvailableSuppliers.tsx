"use client";

import type { SupplierSourceStore } from "@/types";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, ChevronLeft, ChevronRight, Plug } from "lucide-react";
import Image from "next/image";

interface AvailableSuppliersProps {
  stores: SupplierSourceStore[];
  page: number;
  totalPages: number;
  isLoading: boolean;
  onConnectStore: (store: SupplierSourceStore) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function AvailableSuppliers({
  stores,
  page,
  totalPages,
  isLoading,
  onConnectStore,
  onPrevPage,
  onNextPage,
}: AvailableSuppliersProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Store className="h-4 w-4" />
          Available Suppliers
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
            Loading suppliers...
          </div>
        ) : stores.length ? (
          <>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {stores.map((store) => (
                <div
                  key={store.url}
                  className="flex items-center justify-between gap-3 rounded-lg border px-3 py-3 bg-card hover:bg-muted/40 transition"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Logo/Icon */}
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                      <Image
                        src={
                          store.image ||
                          "https://cdn-icons-png.flaticon.com/512/8007/8007891.png"
                        }
                        alt={store.name}
                        width={32}
                        height={32}
                        className="h-6 w-6 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://cdn-icons-png.flaticon.com/512/8007/8007891.png";
                        }}
                      />
                    </div>

                    {/* Store Info */}
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate">
                        {store.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {store.url}
                      </div>
                    </div>
                  </div>

                  {/* Connect Button */}
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => onConnectStore(store)}
                    className="shrink-0 gap-1.5"
                  >
                    <Plug className="h-4 w-4" />
                    Connect
                  </Button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-2 border-t pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onPrevPage}
                disabled={page <= 1}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Page {page} of {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onNextPage}
                disabled={page >= totalPages}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <EmptyState
            featureLabel="Supplier Management"
            description="No suppliers available. Check back later."
          />
        )}
      </CardContent>
    </Card>
  );
}
