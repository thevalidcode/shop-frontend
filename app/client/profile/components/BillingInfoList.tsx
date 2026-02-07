"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/empty-state";
import { Home, Plus, Pencil, Trash, Star } from "lucide-react";
import { BillingInfo } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { BillingInfoForm } from "./BillingInfoForm";
import {
  useDeleteBillingInfo,
  useGetBillingInfo,
  useUpdateBillingInfo,
} from "@/hooks/use-billing-info";

export function BillingInfoList() {
  const { data: billingInfos, isLoading } = useGetBillingInfo();
  const updateBilling = useUpdateBillingInfo();
  const deleteBilling = useDeleteBillingInfo();

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<BillingInfo | null>(null);

  const onCreate = () => {
    setEdit(null);
    setOpen(true);
  };

  const onEdit = (info: BillingInfo) => {
    setEdit(info);
    setOpen(true);
  };

  const onDelete = async (uid: string) => {
    await deleteBilling.mutateAsync({ uid });
  };

  const onMakeDefault = async (uid: string) => {
    await updateBilling.mutateAsync({ uid, isDefault: true });
  };

  if (isLoading) {
    return <Card className="p-6">Loading...</Card>;
  }

  if (!billingInfos || billingInfos.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Billing Information</h3>
          <Button onClick={onCreate}>
            <Plus className="w-4 h-4 mr-2" /> Add Billing Info
          </Button>
        </div>
        <EmptyState
          icon={Home}
          title="No Billing Info"
          description="Create your billing information to enable invoices and payments."
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] p-0 overflow-y-auto">
            <DialogHeader className="px-6 py-4 border-b">
              <DialogTitle className="text-xl font-semibold">
                Create Billing Info
              </DialogTitle>
              <DialogDescription>
                Add billing details used for invoices and payments.
              </DialogDescription>
            </DialogHeader>
            <div className="px-6 py-4">
              <BillingInfoForm onClose={() => setOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Billing Information</h3>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Billing Info
        </Button>
      </div>

      <div className="hidden md:block overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {billingInfos.map((b) => (
              <TableRow key={b.uid} className="hover:bg-muted/30">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span>{b.fullName}</span>
                    {b.isDefault && (
                      <Badge variant="secondary" className="ml-1">
                        Default
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{b.email}</TableCell>
                <TableCell>{b.phone || "-"}</TableCell>
                <TableCell>
                  {b.address}, {b.city}, {b.state || ""} {b.postalCode},{" "}
                  {b.country}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {!b.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMakeDefault(b.uid)}
                    >
                      <Star className="w-4 h-4 mr-1" /> Make Default
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => onEdit(b)}>
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(b.uid)}
                  >
                    <Trash className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden grid gap-3">
        {billingInfos.map((b) => (
          <div key={b.uid} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{b.fullName}</div>
              {b.isDefault && <Badge variant="secondary">Default</Badge>}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{b.email}</div>
            <div className="text-sm text-muted-foreground">
              {b.phone || "-"}
            </div>
            <div className="text-sm mt-2">
              {b.address}, {b.city}, {b.state || ""} {b.postalCode}, {b.country}
            </div>
            <div className="flex gap-2 mt-3">
              {!b.isDefault && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMakeDefault(b.uid)}
                >
                  <Star className="w-4 h-4 mr-1" /> Default
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => onEdit(b)}>
                <Pencil className="w-4 h-4 mr-1" /> Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(b.uid)}
              >
                <Trash className="w-4 h-4 mr-1" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] p-0 overflow-y-auto">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl font-semibold">
              {edit ? "Edit Billing Info" : "Create Billing Info"}
            </DialogTitle>
            <DialogDescription>
              {edit
                ? "Update your billing details."
                : "Add billing details used for invoices and payments."}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4">
            <BillingInfoForm
              initial={
                edit
                  ? {
                      uid: edit.uid,
                      fullName: edit.fullName,
                      email: edit.email,
                      phone: edit.phone ?? "",
                      address: edit.address,
                      city: edit.city,
                      state: edit.state ?? "",
                      country: edit.country,
                      postalCode: edit.postalCode,
                      isDefault: edit.isDefault,
                    }
                  : undefined
              }
              onClose={() => setOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
