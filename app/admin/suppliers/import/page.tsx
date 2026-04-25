"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  ImportedProductsPanel,
  SourceProductsPanel,
} from "../components";
import {
  useGetSupplierProducts,
  useGetSupplierSourceProductsBySupplier,
  useGetSuppliers,
  useImportSupplierProducts,
  useSyncSupplierProducts,
} from "@/hooks/use-supplier";
import type { SupplierMarginType } from "@/types";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function SupplierImportPage() {
  const queryClient = useQueryClient();

  const [selectedSupplierUid, setSelectedSupplierUid] = useState("");
  const [selectedSourceProductIds, setSelectedSourceProductIds] = useState<
    string[]
  >([]);
  const [marginType, setMarginType] =
    useState<SupplierMarginType>("percentage");
  const [marginValue, setMarginValue] = useState("0");

  const { data: suppliers = [], isLoading: isSuppliersLoading } =
    useGetSuppliers();
  const { data: supplierProducts = [], isLoading: isSupplierProductsLoading } =
    useGetSupplierProducts(selectedSupplierUid || undefined);
  const { data: sourceProductsData, isLoading: isSourceProductsLoading } =
    useGetSupplierSourceProductsBySupplier(selectedSupplierUid || undefined);

  const {
    mutate: importSupplierProducts,
    isPending: isImportingSupplierProducts,
  } = useImportSupplierProducts();
  const { mutate: syncSupplierProducts, isPending: isSyncingSupplierProducts } =
    useSyncSupplierProducts();

  const selectedSupplier = useMemo(
    () => suppliers.find((supplier) => supplier.uid === selectedSupplierUid),
    [suppliers, selectedSupplierUid],
  );

  const refreshQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: ["product-suppliers"] });
    await queryClient.invalidateQueries({ queryKey: ["supplier-products"] });
    await queryClient.invalidateQueries({
      queryKey: ["supplier-source-products-by-supplier"],
    });
    await queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const handleImportSupplierProducts = () => {
    if (!selectedSupplierUid) {
      toast.error("Select a connected supplier first");
      return;
    }

    if (!selectedSourceProductIds.length) {
      toast.error("Select at least one supplier product");
      return;
    }

    importSupplierProducts(
      {
        supplierUid: selectedSupplierUid,
        productIds: selectedSourceProductIds,
        marginType,
        marginValue: Number(marginValue || "0"),
      },
      {
        onSuccess: async () => {
          toast.success("Products imported from supplier");
          setSelectedSourceProductIds([]);
          await refreshQueries();
        },
      },
    );
  };

  const handleSyncSupplierProducts = () => {
    if (!selectedSupplierUid) {
      toast.error("Select a connected supplier first");
      return;
    }

    syncSupplierProducts(
      {
        supplierUid: selectedSupplierUid,
        marginType,
        marginValue: Number(marginValue || "0"),
      },
      {
        onSuccess: async () => {
          toast.success("Supplier products synced");
          await refreshQueries();
        },
      },
    );
  };

  const toggleSourceProduct = (productId: string, checked: boolean) => {
    setSelectedSourceProductIds((previous) =>
      checked
        ? Array.from(new Set([...previous, productId]))
        : previous.filter((item) => item !== productId),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border bg-card p-4">
        <div>
          <h1 className="text-2xl font-bold">Suppliers - Product Import</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Step 2: import products from your connected suppliers.
          </p>
        </div>

        <Button asChild variant="outline" className="gap-2">
          <Link href="/admin/suppliers">
            <ArrowLeft className="h-4 w-4" />
            Back To Connections
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground">
        Select a connected supplier on the left. Then choose products to import,
        review already imported items, and sync updates when needed.
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h3 className="font-semibold text-sm mb-3">Connected Suppliers</h3>
            {isSuppliersLoading ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                Loading...
              </div>
            ) : suppliers.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {suppliers.map((supplier) => (
                  <button
                    key={supplier.uid}
                    type="button"
                    onClick={() => {
                      setSelectedSupplierUid(supplier.uid);
                      setSelectedSourceProductIds([]);
                    }}
                    className={`w-full text-left rounded-lg px-3 py-2 text-sm transition ${
                      selectedSupplierUid === supplier.uid
                        ? "bg-primary/10 border border-primary text-primary font-medium"
                        : "bg-muted/40 border border-transparent hover:bg-muted/60"
                    }`}
                  >
                    <div className="truncate font-medium">{supplier.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {supplier.apiUrl}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                No suppliers connected
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <SourceProductsPanel
            products={sourceProductsData?.products || []}
            selectedStore={sourceProductsData?.sourceStore}
            selectedSupplier={selectedSupplier}
            selectedSourceProductIds={selectedSourceProductIds}
            marginType={marginType}
            marginValue={marginValue}
            isLoading={isSourceProductsLoading}
            isImporting={isImportingSupplierProducts}
            isSyncing={isSyncingSupplierProducts}
            canImport={Boolean(
              selectedSupplierUid && selectedSourceProductIds.length,
            )}
            canSync={Boolean(selectedSupplierUid)}
            onMarginTypeChange={setMarginType}
            onMarginValueChange={setMarginValue}
            onToggleSourceProduct={toggleSourceProduct}
            onImportSelected={handleImportSupplierProducts}
            onSyncSupplier={handleSyncSupplierProducts}
          />

          <ImportedProductsPanel
            products={supplierProducts}
            isLoading={isSupplierProductsLoading}
          />
        </div>
      </div>
    </div>
  );
}
