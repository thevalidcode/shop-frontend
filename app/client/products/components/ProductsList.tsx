"use client";

import { useRouter } from "next/navigation";
import { Package, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { TypographyP } from "@/components/typography";

type ViewMode = "grid" | "list";

interface ProductsListProps {
  products: Product[];
  isLoading: boolean;
  viewMode: ViewMode;
  activeFiltersCount: number;
  onAddToCart: (product: Product) => void;
  onClearFilters: () => void;
}

export function ProductsList({
  products,
  isLoading,
  viewMode,
  activeFiltersCount,
  onAddToCart,
  onClearFilters,
}: ProductsListProps) {
  const router = useRouter();

  const handleViewDetails = (product: Product) => {
    router.push(`/client/products?slug=${product.slug}`);
  };
  if (isLoading) {
    return (
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <TypographyP className="text-muted-foreground mb-4">
          Try adjusting your filters or search query
        </TypographyP>
        {activeFiltersCount > 0 && (
          <Button variant="outline" onClick={onClearFilters}>
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      }
    >
      {products.map((product, index) => (
        <div
          className="cursor-pointer"
          key={product.uid}
          onClick={() => handleViewDetails(product)}
        >
          <ProductCard
            product={product}
            onAddToCart={onAddToCart}
            index={index}
          />
        </div>
      ))}
    </div>
  );
}
