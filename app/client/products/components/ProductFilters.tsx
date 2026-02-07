"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types";
import { HierarchicalCategoryFilter } from "@/components/HierarchicalCategoryFilter";

interface ProductFiltersProps {
  categories?: Category[];
  selectedCategory: string;
  activeFiltersCount: number;
  onCategoryChange: (categoryUid: string) => void;
  onClearFilters: () => void;
}

export function ProductFilters({
  categories,
  selectedCategory,
  activeFiltersCount,
  onCategoryChange,
  onClearFilters,
}: ProductFiltersProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {activeFiltersCount}
            </Badge>
          )}
        </h3>

        <div className="space-y-6">
          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium mb-3 block">Category</label>
            <HierarchicalCategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
            />
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={onClearFilters}
            >
              <X className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
