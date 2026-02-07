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

interface ProductsHeaderProps {
  onCreateClick: () => void;
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function ProductsHeader({
  onCreateClick,
  search,
  status,
  onSearchChange,
  onStatusChange,
}: ProductsHeaderProps) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Product Management</h1>
        <p className="text-muted-foreground">
          Manage and track all products
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
              <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              name="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              className="pl-8 w-full border rounded-md p-2 text-sm"
            />
          </div>
        </div>

        {/* Add Product */}
        <Button
          type="button"
          className="bg-primary text-white hover:bg-primary/90 rounded-sm py-2 px-4 cursor-pointer"
          onClick={onCreateClick}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>
    </div>
  );
}
