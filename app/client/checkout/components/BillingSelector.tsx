"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import type { BillingInfo } from "@/types";

export function BillingSelector({
  billingInfos,
  value,
  onChange,
  onAddNew,
}: {
  billingInfos?: BillingInfo[];
  value: string;
  onChange: (uid: string) => void;
  onAddNew: () => void;
}) {
  return (
    <Card className="p-4 sm:p-6 space-y-3 bg-muted/30">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Billing Information</h3>
        <Button variant="outline" size="sm" onClick={onAddNew}>
          Add New
        </Button>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Select billing info</label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select billing info" />
          </SelectTrigger>
          <SelectContent>
            {billingInfos?.map((b) => (
              <SelectItem key={b.uid} value={b.uid}>
                <span className="font-medium">{b.fullName}</span>
                <span className="text-muted-foreground">{b.email}</span>
                {b.isDefault && <Badge variant="secondary">Default</Badge>}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
