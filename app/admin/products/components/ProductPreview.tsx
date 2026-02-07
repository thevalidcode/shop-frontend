"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Eye, Package } from "lucide-react";
import { CurrencyCode, useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { ProductStatus } from "@/types";
import { getCurrencySymbol } from "@/app/_docs/doc";
import ProductStatusBadge from "@/components/ProductStatusBadge";

interface ProductPreviewProps {
  name: string;
  shortDescription: string;
  price: string;
  comparePrice: string;
  status: ProductStatus;
  categoryName?: string;
  isFeatured: boolean;
  stock: number;
  sku: string;
  trackInventory: boolean;
  currency: CurrencyCode;
  tags: string;
  images: string[];
}

export default function ProductPreview({
  name,
  shortDescription,
  price,
  comparePrice,
  status,
  categoryName,
  isFeatured,
  stock,
  currency,
  sku,
  trackInventory,
  tags,
  images,
}: ProductPreviewProps) {
  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Eye className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-semibold text-base">Live Preview</h3>
      </div>

      <Card className="overflow-hidden">
        {/* Product Image */}
        <div className="aspect-square bg-muted flex items-center justify-center border-b">
          {images.length > 0 ? (
            <img
              src={images[0]}
              alt="Product preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-8">
              <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                No image added yet
              </p>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-semibold text-lg line-clamp-2">
              {name || "Product Name"}
            </h4>
            {shortDescription && (
              <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                {shortDescription}
              </p>
            )}
          </div>

          {/* Price Display */}
          <div className="flex items-baseline gap-2">
            {price ? (
              <>
                <span className="text-2xl font-bold">
                  {convert(currency, userCurrency, price, true, false).formatted}
                </span>
                {comparePrice &&
                  parseFloat(comparePrice) > parseFloat(price) && (
                    <span className="text-sm text-muted-foreground line-through">
                      {
                        convert(currency, userCurrency, comparePrice, true, false)
                          .formatted
                      }
                    </span>
                  )}
              </>
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">
                {getCurrencySymbol(userCurrency)}0.00
              </span>
            )}
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-2">
            <ProductStatusBadge status={status} />
            {categoryName && <Badge variant="outline">{categoryName}</Badge>}
            {isFeatured && <Badge variant="secondary">Featured</Badge>}
          </div>

          {/* Inventory Info */}
          {trackInventory && (
            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stock:</span>
                <span className="font-medium">{stock || 0} units</span>
              </div>
              {sku && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">SKU:</span>
                  <span className="font-mono text-xs">{sku}</span>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {tags && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Tags:</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.split(",").map((tag, idx) => {
                  const trimmedTag = tag.trim();
                  if (!trimmedTag) return null;
                  return (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {trimmedTag}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Additional Images Preview */}
      {images.length > 1 && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Additional Images ({images.length - 1})
          </p>
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1, 5).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Preview ${idx + 2}`}
                className="w-full aspect-square object-cover rounded-lg border"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
