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
import { ShippingInfo } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ShippingInfoForm } from "./ShippingInfoForm";
import {
  useDeleteShippingInfo,
  useGetShippingInfo,
  useUpdateShippingInfo,
} from "@/hooks/use-shipping-info";

export function ShippingInfoList() {
  const { data: shippingInfos, isLoading } = useGetShippingInfo();
  const updateShippingInfo = useUpdateShippingInfo();
  const deleteShippingInfo = useDeleteShippingInfo();

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<ShippingInfo | null>(null);

  const onCreate = () => {
    setEdit(null);
    setOpen(true);
  };

  const onEdit = (info: ShippingInfo) => {
    setEdit(info);
    setOpen(true);
  };

  const onDelete = async (uid: string) => {
    await deleteShippingInfo.mutateAsync({ uid });
  };

  const onMakeDefault = async (uid: string) => {
    await updateShippingInfo.mutateAsync({ uid, isDefault: true });
  };

  if (isLoading) {
    return <Card className="p-6">Loading...</Card>;
  }

  if (!shippingInfos || shippingInfos.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Shipping Information</h3>
          <Button onClick={onCreate}>
            <Plus className="w-4 h-4 mr-2" /> Add Shipping Info
          </Button>
        </div>
        <EmptyState
          icon={Home}
          title="No Shipping Info"
          description="Create your shipping information to enable delivery, invoices, and payments."
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] p-0 overflow-y-auto">
            <DialogHeader className="px-6 py-4 border-b">
              <DialogTitle className="text-xl font-semibold">
                Create Shipping Info
              </DialogTitle>
              <DialogDescription>
                Add shipping details used for delivery, invoices, and payments.
              </DialogDescription>
            </DialogHeader>
            <div className="px-6 py-4">
              <ShippingInfoForm onClose={() => setOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Shipping Information</h3>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Shipping Info
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
            {shippingInfos.map((b) => (
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
        {shippingInfos.map((b) => (
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
              {edit ? "Edit Shipping Info" : "Create Shipping Info"}
            </DialogTitle>
            <DialogDescription>
              {edit
                ? "Update your shipping details."
                : "Add shipping details used for invoices and payments."}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4">
            <ShippingInfoForm
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
