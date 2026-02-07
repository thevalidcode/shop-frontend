"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Category, Product } from "@/types";
import { Package } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { useGetCart, useAddToCart, useUpdateCartItem } from "@/hooks/use-cart";

interface RecentActivityProps {
  products?: Product[];
  categories?: Category[];
}

export default function RecentActivity({ products = [], categories = [] }: RecentActivityProps) {
  const limited = useMemo(() => products.slice(0, 6), [products]);

  const { data: cart } = useGetCart();
  const addToCart = useAddToCart();
  const updateCartItem = useUpdateCartItem();

  const handleAddToCart = async (product: Product) => {
    const existing = cart?.items.find((item) => item.productUid === product.uid);
    try {
      if (existing) {
        await updateCartItem.mutateAsync({
          itemId: String(existing.id),
          quantity: existing.quantity + 1,
        });
      } else {
        await addToCart.mutateAsync({ productUid: product.uid, quantity: 1 });
      }
    } catch {
      // surfaced by hooks
    }
  };

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No recent products"
        description="Newly added products will appear here."
      />
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl font-semibold">Recently Added</CardTitle>
        <p className="text-sm text-muted-foreground">Quickly add fresh arrivals to your cart.</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {limited.map((product, index) => (
            <ProductCard
              key={product.uid}
              product={product}
              variant="default"
              index={index}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
