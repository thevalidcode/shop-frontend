"use client";

import { Product } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Package, Star, Tag, Calendar } from "lucide-react";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { format } from "date-fns";

interface ProductViewModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductViewModal({
  product,
  open,
  onOpenChange,
}: ProductViewModalProps) {
  const { userCurrency, generalSetting } = useAppContext();
  const convertCurrency = useCurrencyConverter();

  const convertedPrice = convertCurrency(
    product.currency || "USD",
    userCurrency,
    product.price,
    true,
    false,
  );

  const convertedComparePrice = product.comparePrice
    ? convertCurrency(
        product.currency || "USD",
        userCurrency,
        product.comparePrice,
        true,
        false,
      )
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {product.name}
            {product.isFeatured && (
              <Badge className="bg-linear-to-r from-yellow-500 to-orange-500">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Featured
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Images */}
          {product.galleryUrls && product.galleryUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.galleryUrls.map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-lg border"
                />
              ))}
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Pricing</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-semibold text-primary">
                      {convertedPrice.formatted}
                    </span>
                  </div>
                  {convertedComparePrice && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Compare at:</span>
                      <span className="line-through text-muted-foreground">
                        {convertedComparePrice.formatted}
                      </span>
                    </div>
                  )}
                  {product.costPerItem && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Cost per item:
                      </span>
                      <span>
                        {
                          convertCurrency(
                            product.currency || "USD",
                            userCurrency,
                            product.costPerItem,
                            true,
                            false,
                          ).formatted
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Inventory</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stock:</span>
                    <span>
                      {product.trackInventory
                        ? `${product.stock || 0} units`
                        : "Unlimited"}
                    </span>
                  </div>
                  {product.sku && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SKU:</span>
                      <span className="font-mono text-sm">{product.sku}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Backorder:</span>
                    <span>
                      {product.allowBackorder ? "Allowed" : "Not allowed"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Status</h3>
                <Badge
                  variant={
                    product.status === "ACTIVE"
                      ? "default"
                      : product.status === "INACTIVE"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {product.status}
                </Badge>
              </div>

              {product.categoryUid && (
                <div>
                  <h3 className="font-semibold mb-2">Category</h3>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span>{product.category.name}</span>
                  </div>
                </div>
              )}

              {product.tags && product.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Dates
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{format(new Date(product.createdAt), "PPP")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated:</span>
                    <span>{format(new Date(product.updatedAt), "PPP")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          {(product.shortDescription || product.description) && (
            <div className="space-y-4 pt-4 border-t">
              {product.shortDescription && (
                <div>
                  <h3 className="font-semibold mb-2">Short Description</h3>
                  <p className="text-muted-foreground">
                    {product.shortDescription}
                  </p>
                </div>
              )}
              {product.description && (
                <div>
                  <h3 className="font-semibold mb-2">Full Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
