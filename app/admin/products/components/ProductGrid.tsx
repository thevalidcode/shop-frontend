"use client";

import { Plus, Package } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  searchQuery: string;
  onEditClick: (product: Product) => void;
  onDeleteClick: (product: Product) => void;
  onViewClick: (product: Product) => void;
  onCreateClick: () => void;
  onDuplicateClick: (product: Product) => void;
}

export function ProductGrid({
  products,
  isLoading,
  searchQuery,
  onEditClick,
  onDeleteClick,
  onViewClick,
  onCreateClick,
  onDuplicateClick,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 border rounded-lg bg-muted/20">
        <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground mb-4">
          {searchQuery
            ? "Try adjusting your search query"
            : "Get started by creating your first product"}
        </p>
        {!searchQuery && (
          <Button onClick={onCreateClick}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard
          key={product.uid}
          product={product}
          variant="admin"
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          onViewClick={onViewClick}
          onDuplicateClick={onDuplicateClick}
          index={index}
        />
      ))}
    </div>
  );
}
