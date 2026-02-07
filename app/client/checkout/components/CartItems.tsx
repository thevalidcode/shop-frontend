"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, Package } from "lucide-react";
import { useUpdateCartItem, useRemoveFromCart } from "@/hooks/use-cart";
import type { CartItem } from "@/types";

export function CartItems({ items }: { items: CartItem[] }) {
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  const setQty = (item: CartItem, qty: number) => {
    if (qty < 1) return;
    updateCartItem.mutate({ itemId: String(item.id), quantity: qty });
  };

  return (
    <Card className="p-4 sm:p-6 space-y-3">
      <h3 className="font-semibold">Cart Items</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-center rounded-lg border p-3">
            <div className="w-16 h-16 rounded-md border bg-muted/30 flex items-center justify-center overflow-hidden">
              {item.product.imageUrl ? (
                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain" />
              ) : (
                <Package className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{item.product.name}</div>
              <div className="text-sm text-muted-foreground truncate">{item.product.sku || ""}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setQty(item, item.quantity - 1)} disabled={item.quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => setQty(item, parseInt(e.target.value) || 1)}
                className="w-16 text-center border-0 focus-visible:ring-0 bg-transparent"
              />
              <Button variant="ghost" size="icon" onClick={() => setQty(item, item.quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeFromCart.mutate({ itemId: String(item.id) })}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
