import { Package, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/models/order";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { Decimal } from "decimal.js";

interface OrderItemsListProps {
  order: Order;
}

export function OrderItemsList({ order }: OrderItemsListProps) {
  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();

  const convertedAmount = convert(
    order.currency,
    userCurrency,
    order.totalAmount,
    true,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Order Items ({order.items.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {order.items.map((item) => {
          const itemPrice = convert(
            order.currency,
            userCurrency,
            item.priceAtTimeOfPurchase,
            true,
          );

          const itemTotal = new Decimal(itemPrice.amount).mul(item.quantity);
          return (
            <div
              key={item.id}
              className="flex gap-4 p-4 bg-muted/40 rounded-xl border hover:border-primary/30 transition-colors group"
            >
              {item.product.imageUrl && (
                <div className="w-28 h-28 rounded-xl overflow-hidden bg-muted shrink-0 border">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="font-semibold text-lg">{item.product.name}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0"
                    onClick={() =>
                      window.open(
                        `/client/products?slug=${item.product.slug}`,
                        "_blank",
                      )
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Product
                  </Button>
                </div>
                {item.product.shortDescription && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.product.shortDescription}
                  </p>
                )}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-bold">{item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-bold">{itemPrice.formatted}</span>
                  </div>
                  <div className="ml-auto">
                    <span className="text-muted-foreground text-xs">
                      Subtotal:
                    </span>
                    <div className="font-bold text-lg">
                      {itemPrice.symbol}
                      {itemTotal
                        .toNumber()
                        .toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Total */}
        <div className="mt-6 p-6 bg-linear-to-br from-primary/10 to-primary/5 rounded-xl border-2 border-primary/30">
          <div className="flex items-center justify-between">
            <span className="md:text-xl text-lg font-semibold">
              Total Amount
            </span>
            <span className="md:text-4xl text-2xl font-bold text-primary">
              {convertedAmount.formatted}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
