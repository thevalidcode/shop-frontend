"use client";

import { motion } from "framer-motion";
import { Product } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Star,
  Package,
  ArrowRight,
  Tag,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { useRouter } from "next/navigation";

interface FeaturedProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  index: number;
}

export function FeaturedProductCard({
  product,
  onAddToCart,
  index,
}: FeaturedProductCardProps) {
  const { userCurrency, userInfo } = useAppContext();
  const convertCurrency = useCurrencyConverter();
  const router = useRouter();

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

  const hasDiscount =
    product.comparePrice &&
    parseFloat(product.comparePrice) > parseFloat(product.price);

  const discountPercentage = hasDiscount
    ? Math.round(
        ((parseFloat(product.comparePrice!) - parseFloat(product.price)) /
          parseFloat(product.comparePrice!)) *
          100,
      )
    : 0;

  const isOutOfStock =
    product.status === "OUT_OF_STOCK" ||
    (product.trackInventory && (product.stock || 0) <= 0);

  const addProductToCart = (product: Product) => {
    if (userInfo) {
      onAddToCart(product);
    } else {
      router.push("/auth/signin");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-l-4 border-l-primary/30 hover:border-l-primary h-full">
        <div className="grid grid-cols-1 md:grid-cols-5 h-full">
          {/* Image Section */}
          <div className="md:col-span-2 relative aspect-square md:aspect-auto bg-muted">
            {product.imageUrl ? (
              <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-500">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                {/* Overlay badges */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-2">
                    {product.isFeatured && (
                      <Badge className="bg-linesar-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                    )}
                    {hasDiscount && (
                      <Badge className="bg-linesar-to-r from-rose-500 to-pink-600 text-white border-0 shadow-lg font-bold">
                        -{discountPercentage}% OFF
                      </Badge>
                    )}
                  </div>
                  {isOutOfStock && (
                    <Badge className="bg-black/70 text-white border-0">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-24 h-24 text-muted-foreground/20" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="md:col-span-3 p-6 md:p-8 flex flex-col">
            {/* Category & Tags */}
            {product.categoryUid && (
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wide">
                  {product.category?.name || "Category"}
                </span>
              </div>
            )}

            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Description */}
            {product.shortDescription && (
              <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Stock Info */}
            {product.trackInventory && typeof product.stock === "number" && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                  {product.stock > 0 && product.stock < 10 && (
                    <Badge variant="outline" className="text-orange-500 border-orange-500">
                      Low stock
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="mt-auto">
              {/* Price Section */}
              <div className="flex items-end justify-between gap-4 mb-6 pb-6 border-b">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl md:text-4xl font-bold text-primary">
                      {convertedPrice.formatted}
                    </span>
                    {convertedComparePrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        {convertedComparePrice.formatted}
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Save {discountPercentage}% today
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {!isOutOfStock && (
                <Button
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    addProductToCart(product);
                  }}
                  className="w-full group/btn"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
