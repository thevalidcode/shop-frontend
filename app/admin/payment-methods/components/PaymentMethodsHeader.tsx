"use client";

import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeatureGate } from "@/components/FeatureGate";

interface PaymentMethodsHeaderProps {
  onCreateClick: () => void;
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  canAddMoreGateways: boolean;
  maxPaymentGateways: number;
}

export function PaymentMethodsHeader({
  onCreateClick,
  search,
  status,
  onSearchChange,
  onStatusChange,
  canAddMoreGateways,
  maxPaymentGateways,
}: PaymentMethodsHeaderProps) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Payment Methods</h1>
        <p className="text-muted-foreground">
          Manage your payment gateways and configurations. You can have up to{" "}
          {maxPaymentGateways} gateways.
        </p>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded-xl shadow-sm border">
        {/* Left Side - Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              name="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search payment methods..."
              className="pl-8 w-full border rounded-md p-2 text-sm"
            />
          </div>
        </div>

        {/* Add Gateway */}
        <FeatureGate
          isAllowed={canAddMoreGateways}
          featureLabel="Payment gateway limit"
          variant="tooltip"
          description={`You've reached the maximum of ${maxPaymentGateways} payment gateways. Upgrade to add more.`}
        >
          <Button
            type="button"
            className="bg-primary text-white hover:bg-primary/90 rounded-sm py-2 px-4 cursor-pointer"
            onClick={onCreateClick}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Gateway
          </Button>
        </FeatureGate>
      </div>
    </div>
  );
}
