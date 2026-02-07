"use client";

import { motion } from "framer-motion";
import { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Star,
  TrendingUp,
  Package,
  Eye,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { useRouter } from "next/navigation";
import ProductStatusBadge from "./ProductStatusBadge";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "admin" | "featured";
  onAddToCart?: (product: Product) => void;
  onEditClick?: (product: Product) => void;
  onDeleteClick?: (product: Product) => void;
  onViewClick?: (product: Product) => void;
  onDuplicateClick?: (product: Product) => void;
  index?: number;
}

export function ProductCard({
  product,
  variant = "default",
  onAddToCart,
  onEditClick,
  onDeleteClick,
  onViewClick,
  onDuplicateClick,
  index = 0,
}: ProductCardProps) {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  const isOutOfStock =
    product.status === "OUT_OF_STOCK" ||
    (product.trackInventory && (product.stock || 0) <= 0);

  const addProductToCart = (product: Product) => {
    if (userInfo && onAddToCart) {
      onAddToCart(product);
    } else {
      router.push("/auth/signin");
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className={cn("group", variant === "featured" && "md:col-span-2")}
    >
      <Card className="overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 h-full flex flex-col">
        {/* Image Container */}
        <motion.div
          className="relative aspect-square overflow-hidden bg-muted"
          initial="rest"
          whileHover="hover"
          animate="rest"
        >
          {product.imageUrl ? (
            <motion.div variants={imageVariants} className="w-full h-full">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            <div className="flex flex-col gap-2">
              {product.isFeatured && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="bg-linear-to-r from-yellow-500 to-orange-500 text-white border-0">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                </motion.div>
              )}
              {hasDiscount && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge variant="destructive" className="font-bold">
                    -{discountPercentage}%
                  </Badge>
                </motion.div>
              )}
            </div>

            {isOutOfStock && (
              <Badge variant="secondary" className="bg-black/60 text-white">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Quick Actions (Admin Only) */}
          {variant === "admin" && (
            <motion.div
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              {onViewClick && (
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewClick(product);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
              {onEditClick && (
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClick(product);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              {onDuplicateClick && (
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateClick(product);
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              )}
              {onDeleteClick && (
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick(product);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Content */}
        <CardContent className="p-4 flex flex-col flex-1">
          <div className="flex-1">
            {/* Category */}
            {product.categoryUid && (
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                Category {product.category.name}
              </p>
            )}

            {/* Title */}
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Description */}
            {product.shortDescription && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {product.shortDescription}
              </p>
            )}

            {/* Stock Info */}
            {product.trackInventory && typeof product.stock === "number" && (
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {product.stock} in stock
                </span>
              </div>
            )}
          </div>

          {/* Price & Action */}
          <div className="flex items-end justify-between gap-2 mt-auto pt-3 border-t flex-wrap">
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">
                  {convertedPrice.formatted}
                </span>
                {convertedComparePrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {convertedComparePrice.formatted}
                  </span>
                )}
              </div>
              {product.trackInventory &&
                product.stock &&
                product.stock < 10 && (
                  <span className="text-xs text-orange-500 font-medium">
                    Only {product.stock} left!
                  </span>
                )}
            </div>

            {/* Action Button */}
            {variant !== "admin" && onAddToCart && !isOutOfStock && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  addProductToCart(product);
                }}
                className="shrink-0"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add to Cart
              </Button>
            )}

            {variant === "admin" && (
              <ProductStatusBadge status={product.status} />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
