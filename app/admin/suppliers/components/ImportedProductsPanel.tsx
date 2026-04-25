"use client";

import type { SupplierProduct } from "@/types";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ImportedProductsPanelProps {
  products: SupplierProduct[];
  isLoading: boolean;
}

function formatCurrency(value: number | string) {
  const numericValue = typeof value === "string" ? Number(value) : value;

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
}

const PRODUCTS_PER_PAGE = 12;

export function ImportedProductsPanel({
  products,
  isLoading,
}: ImportedProductsPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return products.slice(start, start + PRODUCTS_PER_PAGE);
  }, [products, currentPage]);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-4 w-4" />
              Imported Products
            </CardTitle>
            <CardDescription className="mt-1">
              Products from this supplier currently in your store
            </CardDescription>
          </div>
          {products.length > 0 && (
            <Badge variant="secondary">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            <Package className="mx-auto mb-2 h-8 w-8 opacity-50" />
            Loading products...
          </div>
        ) : products.length ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedProducts.map((product) => (
                <div
                  key={product.productId}
                  className="rounded-lg border bg-card p-3 hover:border-primary/30 transition"
                >
                  <div className="space-y-2">
                    <div className="font-medium text-sm line-clamp-2">
                      {product.name}
                    </div>

                    <Separator />

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-medium">
                          {formatCurrency(product.price)} {product.currency}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stock:</span>
                        <span className="font-medium">{product.stock}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            featureLabel="Imported Products"
            description="Import products from a supplier to see them listed here."
          />
        )}
      </CardContent>
    </Card>
  );
}
