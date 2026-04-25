"use client";

import type {
  Supplier,
  SupplierMarginType,
  SupplierSourceProduct,
  SupplierSourceStore,
} from "@/types";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Package, RefreshCw, Download } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

interface SourceProductsPanelProps {
  products: SupplierSourceProduct[];
  selectedStore?:
    | SupplierSourceStore
    | { shopId: number; uid: string; name: string };
  selectedSupplier?: Supplier;
  selectedSourceProductIds: string[];
  marginType: SupplierMarginType;
  marginValue: string;
  isLoading: boolean;
  isImporting: boolean;
  isSyncing: boolean;
  canImport: boolean;
  canSync: boolean;
  onMarginTypeChange: (value: SupplierMarginType) => void;
  onMarginValueChange: (value: string) => void;
  onToggleSourceProduct: (productId: string, checked: boolean) => void;
  onImportSelected: () => void;
  onSyncSupplier: () => void;
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

export function SourceProductsPanel({
  products,
  selectedStore,
  selectedSupplier,
  selectedSourceProductIds,
  marginType,
  marginValue,
  isLoading,
  isImporting,
  isSyncing,
  canImport,
  canSync,
  onMarginTypeChange,
  onMarginValueChange,
  onToggleSourceProduct,
  onImportSelected,
  onSyncSupplier,
}: SourceProductsPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(term) ||
        product.productId.toLowerCase().includes(term) ||
        (product.description || "").toLowerCase().includes(term)
      );
    });
  }, [products, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const visibleProductIds = paginatedProducts.map((product) => product.productId);

  const allVisibleSelected =
    visibleProductIds.length > 0 &&
    visibleProductIds.every((id) => selectedSourceProductIds.includes(id));

  const toggleSelectVisible = (checked: boolean) => {
    for (const productId of visibleProductIds) {
      onToggleSourceProduct(productId, checked);
    }
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const selectedCount = selectedSourceProductIds.length;

  return (
    <div className="space-y-4">
      {/* Margin Settings Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-4 w-4" />
            Import Settings
          </CardTitle>
          <CardDescription>
            Set your profit margin on imported products
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="margin-type">Margin Type</Label>
              <Select
                value={marginType}
                onValueChange={(value) =>
                  onMarginTypeChange(value as SupplierMarginType)
                }
              >
                <SelectTrigger id="margin-type" className="w-full">
                  <SelectValue placeholder="Select margin type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="margin-value">Margin Value</Label>
              <Input
                id="margin-value"
                value={marginValue}
                onChange={(event) => onMarginValueChange(event.target.value)}
                type="number"
                min="0"
                placeholder="0"
                className="w-full"
              />
            </div>

            <div className="space-y-2 min-w-0">
              <Label>Actions</Label>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onImportSelected}
                  disabled={!canImport || isImporting || selectedCount === 0}
                  className="w-full sm:flex-1"
                  size="sm"
                >
                  <Download className="mr-1.5 h-4 w-4" />
                  Import ({selectedCount})
                </Button>
                <Button
                  type="button"
                  onClick={onSyncSupplier}
                  disabled={!canSync || isSyncing}
                  className="w-full sm:flex-1"
                  size="sm"
                >
                  <RefreshCw className="mr-1.5 h-4 w-4" />
                  Sync All
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base">Available Products</CardTitle>
              <CardDescription>
                {selectedStore?.name
                  ? `From ${selectedStore.name}`
                  : "Select a supplier to view products"}
              </CardDescription>
            </div>
            {products.length > 0 && (
              <Badge variant="secondary">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {products.length > 0 && (
            <div className="mb-4 space-y-3">
              <Input
                placeholder="Search by name, description, or product ID"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
              />
              {paginatedProducts.length > 0 && (
                <div className="flex items-center justify-between rounded-md border p-2">
                  <p className="text-xs text-muted-foreground">
                    Page selection tools for faster bulk import.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => toggleSelectVisible(!allVisibleSelected)}
                  >
                    {allVisibleSelected ? "Unselect Visible" : "Select Visible"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              <Package className="mx-auto mb-2 h-8 w-8 opacity-50" />
              Loading products...
            </div>
          ) : filteredProducts.length ? (
            <>
              {/* Products Grid */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedProducts.map((product) => {
                  const isSelected = selectedSourceProductIds.includes(
                    product.productId,
                  );

                  return (
                    <label
                      key={product.productId}
                      className={`relative flex cursor-pointer flex-col gap-2 rounded-lg border p-3 transition ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border bg-card hover:border-primary/30 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(value) =>
                            onToggleSourceProduct(
                              product.productId,
                              Boolean(value),
                            )
                          }
                          className="mt-0.5 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm line-clamp-2">
                            {product.name}
                          </div>
                          {product.description && (
                            <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator className="my-1" />

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
                    </label>
                  );
                })}
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
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              featureLabel="Products"
              description={
                searchTerm.trim()
                  ? "No products match your search terms."
                  : "Select a supplier to view and import their products."
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
