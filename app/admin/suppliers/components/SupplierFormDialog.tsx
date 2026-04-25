"use client";

import type { SupplierSourceType } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type SupplierFormState = {
  uid: string;
  name: string;
  url: string;
  apiKey: string;
  image: string;
  percentage: string;
  sync: boolean;
  isInternal: boolean;
};

interface SupplierFormDialogProps {
  open: boolean;
  mode: "add" | "edit" | "connect"; // "add" = external, "edit" = update existing, "connect" = internal
  form: SupplierFormState;
  isSaving: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (
    updater: (previous: SupplierFormState) => SupplierFormState,
  ) => void;
  onCancel: () => void;
  onSave: () => void;
}

export function SupplierFormDialog({
  open,
  mode,
  form,
  isSaving,
  onOpenChange,
  onChange,
  onCancel,
  onSave,
}: SupplierFormDialogProps) {
  const isConnecting = mode === "connect";
  const isEditing = mode === "edit";
  const isAdding = mode === "add";
  const isExternal = !form.isInternal;
  const isInternal = form.isInternal;

  const dialogTitle = isConnecting
    ? "Connect Supplier"
    : isEditing
      ? "Edit Supplier"
      : "Add New Supplier";

  const dialogDescription = isConnecting
    ? "Add your supplier API key and import settings."
    : isEditing
      ? "Update supplier connection and settings."
      : "Connect a supplier to import and sync their products.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Show context for internal (connect) mode */}
          {isConnecting && (
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-sm font-medium">{form.name || "Supplier"}</p>
              <p className="text-xs text-muted-foreground break-all">
                {form.url}
              </p>
            </div>
          )}

          {/* Step 1: Supplier Details */}
          {!isConnecting && (
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Badge
                      variant="secondary"
                      className="rounded-full text-xs font-bold"
                    >
                      01
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      Supplier Details
                    </CardTitle>
                    <CardDescription>
                      Name, URL, and connection type.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={form.name}
                    onChange={(event) =>
                      onChange((previous) => ({
                        ...previous,
                        name: event.target.value,
                      }))
                    }
                    placeholder="e.g., Premium Wholesale"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>URL *</Label>
                  <Input
                    value={form.url}
                    onChange={(event) =>
                      onChange((previous) => ({
                        ...previous,
                        url: event.target.value,
                      }))
                    }
                    placeholder="api.supplier.com/v2"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Connection Type</Label>
                  <div className="mt-1 flex h-10 items-center rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground">
                    {isAdding
                      ? "External Supplier"
                      : isExternal
                        ? "External Supplier"
                        : "Internal Supplier"}{" "}
                    (fixed)
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {isEditing
                      ? "Connection type cannot be changed."
                      : "Choose a supplier type."}
                  </p>
                </div>

                <div>
                  <Label>API Key *</Label>
                  <Input
                    value={form.apiKey}
                    onChange={(event) =>
                      onChange((previous) => ({
                        ...previous,
                        apiKey: event.target.value,
                      }))
                    }
                    placeholder="Enter supplier account API key"
                    type="password"
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Required to identify your account in the supplier platform.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 1 (or only step) for connect mode: API Key */}
          {isConnecting && (
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Badge
                      variant="secondary"
                      className="rounded-full text-xs font-bold"
                    >
                      01
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      Connection Details
                    </CardTitle>
                    <CardDescription>
                      API key and import settings.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="supplier-api-key">API Key *</Label>
                  <Input
                    id="supplier-api-key"
                    type="password"
                    value={form.apiKey}
                    onChange={(event) =>
                      onChange((previous) => ({
                        ...previous,
                        apiKey: event.target.value,
                      }))
                    }
                    placeholder="Enter supplier API key"
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Required so your store account is recognized in the supplier
                    platform.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Pricing Margin */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Badge
                    variant="secondary"
                    className="rounded-full text-xs font-bold"
                  >
                    {isConnecting ? "02" : "02"}
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-base">Pricing Margin</CardTitle>
                  <CardDescription>
                    Your markup on imported products.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Margin Type</Label>
                  <div className="mt-1 flex h-10 items-center rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground">
                    Percentage (%)
                  </div>
                </div>

                <div>
                  <Label>Margin Value</Label>
                  <Input
                    value={form.percentage}
                    onChange={(event) =>
                      onChange((previous) => ({
                        ...previous,
                        percentage: event.target.value,
                      }))
                    }
                    type="number"
                    placeholder="0"
                    min="0"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Automation (only for non-connect mode) */}
          {!isConnecting && (
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Badge
                      variant="secondary"
                      className="rounded-full text-xs font-bold"
                    >
                      03
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-base">Automation</CardTitle>
                    <CardDescription>
                      Enable auto-sync and features.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 p-3">
                  <div>
                    <p className="text-sm font-medium">Enable Auto-Sync</p>
                    <p className="text-xs text-muted-foreground">
                      Automatically sync products from this supplier
                    </p>
                  </div>
                  <Checkbox
                    checked={form.sync}
                    onCheckedChange={(checked) =>
                      onChange((previous) => ({
                        ...previous,
                        sync: Boolean(checked),
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3 (Automation) for connect mode */}
          {isConnecting && (
            <>
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Badge
                        variant="secondary"
                        className="rounded-full text-xs font-bold"
                      >
                        03
                      </Badge>
                    </div>
                    <div>
                      <CardTitle className="text-base">Automation</CardTitle>
                      <CardDescription>
                        Enable auto-sync and features.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 p-3">
                    <div>
                      <p className="text-sm font-medium">Enable Auto-Sync</p>
                      <p className="text-xs text-muted-foreground">
                        Automatically sync products from this supplier
                      </p>
                    </div>
                    <Checkbox
                      checked={form.sync}
                      onCheckedChange={(checked) =>
                        onChange((previous) => ({
                          ...previous,
                          sync: Boolean(checked),
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={onSave} disabled={isSaving}>
            {isSaving
              ? "Saving..."
              : isConnecting
                ? "Connect Supplier"
                : isEditing
                  ? "Update Supplier"
                  : "Add Supplier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
