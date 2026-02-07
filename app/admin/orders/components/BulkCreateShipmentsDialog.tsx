"use client";

import { useState } from "react";
import { Order, WeightUnit } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBulkCreateShipments } from "@/hooks/use-shipping";
import { PackagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface BulkCreateShipmentsDialogProps {
  selectedOrders: Order[];
  onSuccess?: () => void;
}

export function BulkCreateShipmentsDialog({
  selectedOrders,
  onSuccess,
}: BulkCreateShipmentsDialogProps) {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState("1");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("KG");

  const bulkCreateMutation = useBulkCreateShipments();

  const handleCreate = async () => {
    if (selectedOrders.length === 0) {
      toast.error("No orders selected");
      return;
    }

    const orderUids = selectedOrders.map((order) => order.uid);

    await bulkCreateMutation.mutateAsync({
      orderUids,
      weight: parseFloat(weight),
      weightUnit,
    });

    setOpen(false);
    setWeight("1");
    setWeightUnit("KG");
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={selectedOrders.length === 0}
          variant="outline"
          className="gap-2"
        >
          <PackagePlus className="h-4 w-4" />
          Bulk Create Shipments ({selectedOrders.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125 max-h-[90vh] p-0 overflow-y-auto">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Bulk Create Shipments</DialogTitle>
          <DialogDescription>
            Create shipments for {selectedOrders.length} selected orders. All
            orders will use the same package weight settings.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4 space-y-5">
          <div className="rounded-md border p-3 bg-muted/50">
            <p className="text-sm font-medium mb-2">Selected Orders:</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {selectedOrders.map((order) => (
                <p key={order.uid} className="text-xs text-muted-foreground">
                  • {order.orderRef} - {order.user.fullName}
                </p>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="weight">Package Weight</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="1.0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="weightUnit">Unit</Label>
              <Select
                value={weightUnit}
                onValueChange={(value) => setWeightUnit(value as WeightUnit)}
              >
                <SelectTrigger id="weightUnit" className="w-full">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KG">Kilograms (kg)</SelectItem>
                  <SelectItem value="G">Grams (g)</SelectItem>
                  <SelectItem value="LB">Pounds (lb)</SelectItem>
                  <SelectItem value="OZ">Ounces (oz)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                !weight || parseFloat(weight) <= 0 || bulkCreateMutation.isPending
              }
            >
              {bulkCreateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                `Create ${selectedOrders.length} Shipments`
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
