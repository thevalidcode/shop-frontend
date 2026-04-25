"use client";

import Link from "next/link";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { FeatureGate } from "@/components/FeatureGate";
import { useAppContext } from "@/context/appContext";
import ConfirmActionDialog from "../components/ConfirmActionDialog";
import DeleteDialog from "../components/DeleteDialog";
import {
  useCreateSupplier,
  useDeleteSupplier,
  useGetSupplierSourceStores,
  useGetSuppliers,
  useUpdateSupplier,
} from "@/hooks/use-supplier";
import type { SupplierFormPayload } from "@/types";
import {
  AvailableSuppliers,
  SupplierStats,
  SuppliersList,
  SupplierFormDialog,
  type SupplierFormState,
} from "./components";
import { toast } from "sonner";
import { ArrowRight, Plug } from "lucide-react";

const DEFAULT_FORM = {
  uid: "",
  name: "",
  url: "",
  apiKey: "",
  image: "",
  percentage: "0",
  sync: false,
  isInternal: false,
};

export default function SuppliersPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit" | "connect">(
    "connect",
  );
  const [formData, setFormData] = useState<SupplierFormState>(DEFAULT_FORM);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingUpdatePayload, setPendingUpdatePayload] =
    useState<SupplierFormPayload | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<{
    uid: string;
    name: string;
  } | null>(null);

  const { data: suppliers = [], isLoading: isSuppliersLoading } =
    useGetSuppliers();
  const { data: suppliersData, isLoading: isStoresLoading } =
    useGetSupplierSourceStores(page, 12, search || undefined);

  const { mutate: createSupplier, isPending: isCreatingSupplier } =
    useCreateSupplier();
  const { mutate: updateSupplier, isPending: isUpdatingSupplier } =
    useUpdateSupplier();
  const { mutate: deleteSupplier, isPending: isDeletingSupplier } =
    useDeleteSupplier();

  const totalPages = suppliersData?.meta.pages || 1;

  const refreshQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: ["product-suppliers"] });
    await queryClient.invalidateQueries({
      queryKey: ["supplier-source-stores"],
    });
  };

  const openConnectDialog = (supplier: {
    name: string;
    url: string;
    isInternal: boolean;
  }) => {
    setFormMode("connect");
    setFormData({
      ...DEFAULT_FORM,
      name: supplier.name,
      url: supplier.url,
      isInternal: supplier.isInternal,
    });
    setFormDialogOpen(true);
  };

  const openAddSupplierDialog = () => {
    setFormMode("add");
    setFormData({
      ...DEFAULT_FORM,
      isInternal: false,
    });
    setFormDialogOpen(true);
  };

  const closeFormDialog = () => {
    setFormDialogOpen(false);
    setFormData(DEFAULT_FORM);
    setFormMode("connect");
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setPendingUpdatePayload(null);
  };

  const openDeleteDialog = (supplierUid: string) => {
    const supplier = suppliers.find((item) => item.uid === supplierUid);

    if (!supplier) {
      toast.error("Select a supplier first");
      return;
    }

    setSupplierToDelete({ uid: supplier.uid, name: supplier.name });
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSupplierToDelete(null);
  };

  const handleSaveSupplier = () => {
    if (!formData.name || !formData.url) {
      toast.error("Supplier name and URL are required");
      return;
    }

    if (!formData.apiKey.trim()) {
      toast.error("API key is required");
      return;
    }

    const payload: SupplierFormPayload = {
      uid: formData.uid,
      name: formData.name,
      url: formData.url,
      apiKey: formData.apiKey.trim(),
      percentage: Number(formData.percentage || "0"),
      sync: formData.sync,
      isInternal: formData.isInternal,
    };

    if (formMode === "edit" && formData.uid) {
      setPendingUpdatePayload(payload);
      setConfirmDialogOpen(true);
      return;
    }

    createSupplier(payload, {
      onSuccess: async () => {
        toast.success(
          formMode === "connect"
            ? "Supplier connected successfully"
            : "Supplier created successfully",
        );
        closeFormDialog();
        await refreshQueries();
      },
    });
  };

  const confirmUpdateSupplier = () => {
    if (!pendingUpdatePayload) {
      toast.error("No supplier update is pending");
      return;
    }

    updateSupplier(pendingUpdatePayload, {
      onSuccess: async () => {
        toast.success("Supplier updated successfully");
        closeConfirmDialog();
        closeFormDialog();
        await refreshQueries();
      },
      onError: () => {
        closeConfirmDialog();
      },
    });
  };

  const handleDeleteSupplier = () => {
    if (!supplierToDelete) {
      toast.error("Select a supplier first");
      return;
    }

    deleteSupplier(supplierToDelete.uid, {
      onSuccess: async () => {
        toast.success("Supplier removed");
        closeDeleteDialog();
        await refreshQueries();
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border bg-card p-4">
        <div>
          <h1 className="text-2xl font-bold">Suppliers - Connections</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Step 1: connect supplier accounts from the supplier directory.
          </p>
        </div>

        <Button asChild className="gap-2">
          <Link href="/admin/suppliers/import">
            Go To Product Import
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground">
        Select a supplier from the right panel and click Connect. You will enter
        API key, margin percentage, and sync settings. Connected suppliers
        appear on the left and can be updated anytime.
      </div>

      <SupplierStats suppliers={suppliers} />

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <SuppliersList
            suppliers={suppliers}
            isLoading={isSuppliersLoading}
            onAddSupplier={openAddSupplierDialog}
            onEditSupplier={(supplier) => {
              setFormMode("edit");
              setFormData({
                uid: supplier.uid,
                name: supplier.name,
                url: supplier.apiUrl,
                apiKey: "",
                image: supplier.image || "",
                percentage: String(supplier.percentage),
                sync: supplier.sync,
                isInternal: supplier.isInternal,
              });
              setFormDialogOpen(true);
            }}
            onDeleteSupplier={(uid) => {
              openDeleteDialog(uid);
            }}
          />
        </div>

        <AvailableSuppliers
          stores={suppliersData?.suppliers || []}
          page={page}
          totalPages={totalPages}
          isLoading={isStoresLoading}
          onConnectStore={(store) => {
            openConnectDialog(store);
          }}
          onPrevPage={() => setPage((current) => Math.max(current - 1, 1))}
          onNextPage={() =>
            setPage((current) => Math.min(current + 1, totalPages))
          }
        />
      </div>

      <SupplierFormDialog
        open={formDialogOpen}
        mode={formMode}
        form={formData}
        isSaving={isCreatingSupplier || isUpdatingSupplier}
        onOpenChange={setFormDialogOpen}
        onChange={setFormData}
        onCancel={closeFormDialog}
        onSave={handleSaveSupplier}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            closeDeleteDialog();
          }
        }}
        onConfirm={handleDeleteSupplier}
        count={supplierToDelete ? 1 : 0}
        names={supplierToDelete ? [supplierToDelete.name] : []}
        entityName="supplier"
        isDeleting={isDeletingSupplier}
      />

      <ConfirmActionDialog
        open={confirmDialogOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            closeConfirmDialog();
          }
        }}
        onConfirm={confirmUpdateSupplier}
        title="Confirm Supplier Update"
        description={`Update ${pendingUpdatePayload?.name || "this supplier"}? This will change the supplier connection settings.`}
        confirmLabel="Update Supplier"
        isLoading={isUpdatingSupplier}
        icon={Plug}
      />
    </div>
  );
}
