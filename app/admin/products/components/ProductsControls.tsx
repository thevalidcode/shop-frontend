"use client";

import { Search, Grid3x3, List as ListIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ViewMode = "grid" | "table";

interface ProductsControlsProps {
  searchQuery: string;
  viewMode: ViewMode;
  onSearchChange: (value: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ProductsControls({
  searchQuery,
  viewMode,
  onSearchChange,
  onViewModeChange,
}: ProductsControlsProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-1 border rounded-lg p-1">
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => onViewModeChange("grid")}
        >
          <Grid3x3 className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === "table" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => onViewModeChange("table")}
        >
          <ListIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
