"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Product } from "@/types";
import {
  Heart,
  Share2,
  ShoppingCart,
  Minus,
  Plus,
  Check,
  Truck,
  Shield,
  ChevronLeft,
  Star,
} from "lucide-react";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { toast } from "sonner";
import Decimal from "decimal.js";
import { useRouter } from "next/navigation";
import ReviewsSection from "@/components/ReviewsSection";
import { ImageZoom } from "@/components/ImageZoom";

interface ProductDetailProps {
  product: Product;
  onAddToCart: (quantity: number) => Promise<void> | void;
  onBack: () => void;
}

export default function ProductDetail({
  product,
  onAddToCart,
  onBack,
}: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const convert = useCurrencyConverter();
  const { userCurrency, userInfo } = useAppContext();

  const router = useRouter();

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorited(favorites.includes(product.uid));
  }, [product.uid]);

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, value);
    if (!product.trackInventory || newQuantity <= (product.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (userInfo && onAddToCart) {
      setIsAddingToCart(true);
      try {
        await onAddToCart(quantity);
      } finally {
        setIsAddingToCart(false);
      }
    } else {
      router.push("/auth/signin");
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard!");
    });
  };

  const handleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (isFavorited) {
      const updated = favorites.filter((uid: string) => uid !== product.uid);
      localStorage.setItem("favorites", JSON.stringify(updated));
    } else {
      favorites.push(product.uid);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
    setIsFavorited(!isFavorited);
    toast.success(
      isFavorited ? "Removed from favorites" : "Added to favorites",
    );
  };

  const displayPrice = convert(
    product.currency || "USD",
    userCurrency,
    product.price,
    true,
    true,
  );
  const comparePrice =
    product.comparePrice &&
    parseFloat(product.comparePrice) > parseFloat(product.price)
      ? convert(
          product.currency || "USD",
          userCurrency,
          product.comparePrice,
          true,
          true,
        )
      : null;

  const discountPercent = comparePrice
    ? Math.round(
        ((parseFloat(comparePrice.amount) - parseFloat(displayPrice.amount)) /
          parseFloat(comparePrice.amount)) *
          100,
      )
    : 0;

  const totalPrice = new Decimal(product.price)
    .mul(quantity)
    .toDecimalPlaces(2)
    .toString();
  const displayTotal = convert(
    product.currency || "USD",
    userCurrency,
    totalPrice,
    true,
    true,
  );

  const costPerItem = product.costPerItem
    ? convert(
        product.currency || "USD",
        userCurrency,
        product.costPerItem,
        true,
        true,
      )
    : null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto"
      onClick={onBack}
    >
      <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
        <Card
          className="w-full max-w-6xl shadow-2xl max-h-[95vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-background border-b p-4 sm:p-6 flex items-center justify-between z-10 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-10 w-10 shrink-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold flex-1 mx-4 line-clamp-1">
              {product.name}
            </h1>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="h-10 w-10"
                title="Share product"
              >
                <Share2 className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavorite}
                className="h-10 w-10"
                title={
                  isFavorited ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Heart
                  className="h-5 w-5 transition-colors"
                  fill={isFavorited ? "currentColor" : "none"}
                  strokeWidth={isFavorited ? 0 : 2}
                  style={{ color: isFavorited ? "#ef4444" : "currentColor" }}
                />
              </Button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 p-4 sm:p-6 lg:p-12">
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
                    <div className="text-muted-foreground text-center">
                      No image available
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {product.galleryUrls && product.galleryUrls.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {product.galleryUrls.map((image: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === idx
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${idx + 1}`}
                          className="w-full h-full object-contain bg-muted/30"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info & Order */}
              <div className="space-y-6">
                {/* Rating & Badges */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
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
                      <Badge variant="destructive">
                        {discountPercent}% OFF
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Price Section */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold">
                      {displayPrice.formatted}
                    </span>
                    {comparePrice && (
                      <span className="text-xl text-muted-foreground line-through">
                        {comparePrice.formatted}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {product.trackInventory && `${product.stock} in stock`}
                  </p>
                </div>

                {/* Description */}
                {product.shortDescription ||
                  (product.description && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">About this product</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {product.shortDescription}
                      </p>
                      {product.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {product.description}
                        </p>
                      )}
                    </div>
                  ))}

                {/* Category & SKU */}
                {(product.categoryUid || product.sku) && (
                  <div className="border-t border-b py-4 space-y-2">
                    {product.categoryUid && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium">
                          {product.category.name}
                        </span>
                      </div>
                    )}
                    {product.sku && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">SKU</span>
                        <span className="font-mono text-xs">{product.sku}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Quantity & Order */}
                <div className="space-y-4">
                  {/* Quantity Selector */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Quantity
                    </label>
                    <div className="flex items-center border rounded-lg w-fit bg-background">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="h-10 w-10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        max={
                          product.trackInventory
                            ? product.stock || 0
                            : undefined
                        }
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(parseInt(e.target.value) || 1)
                        }
                        className="w-16 border-0 text-center focus-visible:ring-0 bg-transparent"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={
                          product.trackInventory &&
                          quantity >= (product.stock || 0)
                        }
                        className="h-10 w-10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Total Price:
                      </span>
                      <span className="text-2xl font-bold">
                        {displayTotal.formatted}
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    disabled={
                      isAddingToCart ||
                      (product.status !== "ACTIVE" && !product.allowBackorder)
                    }
                    size="lg"
                    className="w-full h-12 text-base font-semibold"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                  </Button>

                  {!product.trackInventory && product.allowBackorder && (
                    <p className="text-sm text-primary flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Backorders accepted
                    </p>
                  )}
                </div>

                {/* Trust Signals */}
                <div className="grid grid-cols-2 gap-4 border-t pt-6">
                  <div className="flex gap-3">
                    <Star className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold">Quality Assured</p>
                      <p className="text-muted-foreground">
                        Premium product guaranteed
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold">Secure Payment</p>
                      <p className="text-muted-foreground">100% protected</p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="px-4 sm:px-6 lg:px-12 pb-6">
              <ReviewsSection productUid={product.uid} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
