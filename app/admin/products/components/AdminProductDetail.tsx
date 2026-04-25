"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types";
import {
  Copy,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Tag,
  Package,
  DollarSign,
  TrendingUp,
  Star,
} from "lucide-react";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import Decimal from "decimal.js";
import ReviewsManagement from "@/components/ReviewsManagement";
import { ImageZoom } from "@/components/ImageZoom";

interface AdminProductDetailProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function AdminProductDetail({
  product,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: AdminProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();

  if (!product) return null;

  const displayPrice = convert(
    product.currency,
    userCurrency,
    product.price,
    true,
    false,
  );
  const comparePrice =
    product.comparePrice &&
    parseFloat(product.comparePrice) > parseFloat(product.price)
      ? convert(
          product.currency,
          userCurrency,
          product.comparePrice,
          true,
          false,
        )
      : null;

  const discountPercent = comparePrice
    ? Math.round(
        ((parseFloat(comparePrice.amount) - parseFloat(displayPrice.amount)) /
          parseFloat(comparePrice.amount)) *
          100,
      )
    : 0;

  const costPerItem = product.costPerItem
    ? convert(product.currency, userCurrency, product.costPerItem, true, false)
    : null;

  const totalCost =
    product.costPerItem && product.stock
      ? convert(
          product.currency,
          userCurrency,
          new Decimal(product.costPerItem).mul(product.stock || 0).toString(),
          true,
          true,
        )
      : null;

  const profit =
    product.costPerItem && product.stock
      ? convert(
          product.currency,
          userCurrency,
          new Decimal(product.price)
            .minus(product.costPerItem || 0)
            .mul(product.stock || 0)
            .toString(),
          true,
          true,
        )
      : null;

  const supplierLinked = Boolean(
    product.supplierProductUid && product.syncWithSupplier,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-5xl xl:max-w-6xl max-h-[95vh] p-0 gap-0 overflow-y-auto">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b bg-background sticky top-0 z-10">
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            Product Details
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden aspect-square flex items-center justify-center border">
                {product.imageUrl ? (
                  <ImageZoom
                    src={
                      product.galleryUrls?.[selectedImage] || product.imageUrl
                    }
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-muted-foreground">No image</div>
                )}
              </div>

              {/* Image Navigation */}
              {product.galleryUrls && product.galleryUrls.length > 1 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Image {selectedImage + 1} of {product.galleryUrls.length}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setSelectedImage(
                            selectedImage === 0
                              ? product.galleryUrls!.length - 1
                              : selectedImage - 1,
                          )
                        }
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setSelectedImage(
                            selectedImage === product.galleryUrls!.length - 1
                              ? 0
                              : selectedImage + 1,
                          )
                        }
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  <div className="grid grid-cols-4 gap-2">
                    {product.galleryUrls.map((image: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                          selectedImage === idx
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-contain bg-muted/30"
                        />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge
                    variant={
                      product.status === "ACTIVE"
                        ? "default"
                        : product.status === "OUT_OF_STOCK"
                          ? "secondary"
                          : "default"
                    }
                  >
                    {product.status === "ACTIVE"
                      ? "In Stock"
                      : product.status === "OUT_OF_STOCK"
                        ? "Out of Stock"
                        : product.status}
                  </Badge>
                  {product.isFeatured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                  {discountPercent > 0 && (
                    <Badge variant="destructive">{discountPercent}% OFF</Badge>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  {product.name}
                </h2>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <Copy className="h-4 w-4" />
                  <code className="text-sm">{product.slug}</code>
                </div>
              </div>

              {/* Pricing */}
              <Card className="p-4 space-y-4 bg-muted/30">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Selling Price
                    </p>
                    <p className="text-xl sm:text-2xl font-bold">
                      {displayPrice.formatted}
                    </p>
                  </div>
                  {comparePrice && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Compare Price
                      </p>
                      <p className="text-base sm:text-lg line-through text-muted-foreground">
                        {comparePrice.formatted}
                      </p>
                    </div>
                  )}
                </div>

                {costPerItem && (
                  <>
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Cost per Item</p>
                          <p className="font-semibold">
                            {costPerItem.formatted}
                          </p>
                        </div>
                        <div>
                          {/* Supplier */}
                          {supplierLinked && (
                            <Card className="p-4 space-y-3 bg-muted/30">
                              <h4 className="font-semibold flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Supplier Sync
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground">
                                    Supplier UID
                                  </span>
                                  <span className="font-mono text-right break-all">
                                    {product.supplierUid || "-"}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground">
                                    Source Product
                                  </span>
                                  <span className="font-mono text-right break-all">
                                    {product.supplierProductUid || "-"}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground">
                                    Supplier Price
                                  </span>
                                  <span className="font-semibold">
                                    {product.supplierPrice || "-"}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground">
                                    Supplier Currency
                                  </span>
                                  <span className="font-semibold">
                                    {product.supplierCurrency ||
                                      product.currency}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground">
                                    Sync Mode
                                  </span>
                                  <span className="font-semibold">
                                    {product.syncCatAndName
                                      ? "Name + category"
                                      : "Price only"}
                                  </span>
                                </div>
                              </div>
                            </Card>
                          )}

                          {/* Images */}
                          {product.galleryUrls &&
                            product.galleryUrls.length > 0 && (
                              <Card className="p-4 space-y-3 bg-muted/30">
                                <h4 className="font-semibold flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4" />
                                  Images
                                </h4>
                                <div className="grid grid-cols-3 gap-2">
                                  {product.galleryUrls.map(
                                    (image: string, idx: number) => (
                                      <img
                                        key={idx}
                                        src={image}
                                        alt={`${product.name} image ${idx + 1}`}
                                        className="aspect-square w-full rounded-lg border object-contain bg-background"
                                      />
                                    ),
                                  )}
                                </div>
                              </Card>
                            )}

                          {/* Variants */}
                          {product.variants && product.variants.length > 0 && (
                            <Card className="p-4 space-y-3 bg-muted/30">
                              <h4 className="font-semibold flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Variants
                              </h4>
                              <div className="space-y-2">
                                {product.variants.map((variant) => (
                                  <div
                                    key={variant.uid}
                                    className="rounded-lg border bg-background p-3 text-sm"
                                  >
                                    <div className="flex items-center justify-between gap-3">
                                      <span className="font-medium">
                                        {variant.name}
                                      </span>
                                      {variant.isDefault && (
                                        <Badge variant="secondary">
                                          Default
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="mt-2 grid grid-cols-2 gap-2 text-muted-foreground">
                                      <span>Price: {variant.price}</span>
                                      <span>Stock: {variant.stock ?? 0}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Card>
                          )}

                          {/* Reviews */}
                          {product.reviews && product.reviews.length > 0 && (
                            <Card className="p-4 space-y-3 bg-muted/30">
                              <h4 className="font-semibold flex items-center gap-2">
                                <Star className="h-4 w-4" />
                                Reviews
                              </h4>
                              <div className="space-y-2">
                                {product.reviews.slice(0, 3).map((review) => (
                                  <div
                                    key={review.uid}
                                    className="rounded-lg border bg-background p-3 text-sm"
                                  >
                                    <div className="flex items-center justify-between gap-3">
                                      <span className="font-medium">
                                        {review.title || "Customer review"}
                                      </span>
                                      <Badge variant="outline">
                                        {review.rating}/5
                                      </Badge>
                                    </div>
                                    {review.comment && (
                                      <p className="mt-2 text-muted-foreground">
                                        {review.comment}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </Card>
                          )}
                          <p className="text-muted-foreground">Margin</p>
                          <p className="font-semibold text-green-600 dark:text-green-500">
                            {new Decimal(product.price)
                              .minus(product.costPerItem || 0)
                              .mul(100)
                              .div(product.price)
                              .toDecimalPlaces(1)
                              .toString()}
                            %
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Card>

              {/* Inventory */}
              <Card className="p-4 space-y-3 bg-muted/30">
                <h4 className="font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Inventory
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tracking</span>
                    <Badge variant="outline">
                      {product.trackInventory ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  {product.trackInventory && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stock</span>
                        <span className="font-semibold">{product.stock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Backorder</span>
                        <Badge variant="outline">
                          {product.allowBackorder ? "Allowed" : "Not Allowed"}
                        </Badge>
                      </div>
                      {totalCost && profit && (
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between mb-1">
                            <span className="text-muted-foreground">
                              Total Cost
                            </span>
                            <span className="font-semibold">
                              {totalCost.formatted}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Profit (if sold)
                            </span>
                            <span className="font-semibold text-green-600 dark:text-green-500">
                              {profit.formatted}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card>

              {/* Description */}
              {product.description && (
                <div>
                  <h4 className="font-semibold mb-2">Full Description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  onClick={() => setReviewsOpen(true)}
                  variant="outline"
                  className="flex-1 py-3"
                  size="lg"
                >
                  <Star className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Manage Reviews</span>
                  <span className="sm:hidden">Reviews</span>
                </Button>
                <Button
                  onClick={() => {
                    onEdit(product);
                    onOpenChange(false);
                  }}
                  className="flex-1 py-3"
                  size="lg"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Edit Product</span>
                  <span className="sm:hidden">Edit</span>
                </Button>
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={() => {
                    onDelete(product);
                    onOpenChange(false);
                  }}
                >
                  <Trash2 className="h-4 w-4 sm:mr-0" />
                  <span className="sm:hidden ml-2">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Reviews Management Modal */}
      {product && (
        <ReviewsManagement
          productUid={product.uid}
          open={reviewsOpen}
          onOpenChange={setReviewsOpen}
        />
      )}
    </Dialog>
  );
}
