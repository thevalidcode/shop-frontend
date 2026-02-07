"use client";

import { useState, useMemo } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useGetCart,
  useUpdateCartItem,
  useRemoveFromCart,
} from "@/hooks/use-cart";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { Minus, Plus, Trash2, ShoppingCart, Package } from "lucide-react";
import { useRouter } from "next/navigation";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { data: cart } = useGetCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();
  const router = useRouter();

  const count = cart?.itemCount || 0;
  const displayTotal = cart
    ? convert(cart.currency, userCurrency, cart.total, true, false)
    : null;

  const setQty = (id: number, qty: number) => {
    if (qty < 1) return;
    updateCartItem.mutate({ itemId: String(id), quantity: qty });
  };

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-50 rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition px-4 h-12 flex items-center gap-2"
      >
        <ShoppingCart className="h-5 w-5" />
        <span className="font-semibold">Cart</span>
        {count > 0 && (
          <Badge variant="secondary" className="ml-1">
            {count}
          </Badge>
        )}
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Shopping Cart</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 space-y-4 overflow-y-auto">
            {!cart || cart.items.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                Your cart is empty
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <div className="w-14 h-14 rounded-md border bg-muted/30 flex items-center justify-center overflow-hidden">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {item.product.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setQty(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setQty(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            removeFromCart.mutate({ itemId: String(item.id) })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-lg font-bold">
                      {displayTotal?.formatted}
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      setOpen(false);
                      router.push("/client/checkout");
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
