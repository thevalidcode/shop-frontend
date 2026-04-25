"use client";

import { CirclePlus, Search, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SuppliersHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  canEditOrDelete: boolean;
}

export function SuppliersHeader({
  search,
  onSearchChange,
  onCreateClick,
  onEditClick,
  onDeleteClick,
  canEditOrDelete,
}: SuppliersHeaderProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">Suppliers</h1>
        <p className="text-muted-foreground max-w-2xl">
          Connect with suppliers and import their products. Search for suppliers, manage your import settings, and keep product information synchronized across your store.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-lg border shadow-sm bg-card">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            name="supplier-search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search suppliers..."
            className="pl-10 w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-start md:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onEditClick}
            disabled={!canEditOrDelete}
            size="sm"
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onDeleteClick}
            disabled={!canEditOrDelete}
            size="sm"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button type="button" onClick={onCreateClick} size="sm">
            <CirclePlus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </div>
    </div>
  );
}
