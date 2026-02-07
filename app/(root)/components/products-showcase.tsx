"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Star, TrendingUp, Package, Sparkles } from "lucide-react";
import { TypographyH2, TypographyP } from "@/components/typography";
import { ProductCard } from "@/components/ProductCard";
import { FeaturedProductCard } from "@/components/FeaturedProductCard";
import { useGetProductsPublic } from "@/hooks/use-product";
import { Product } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCart, useAddToCart, useUpdateCartItem } from "@/hooks/use-cart";

export function ProductsShowcase() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { data: products, isLoading } = useGetProductsPublic();
  const { data: cart } = useGetCart();
  const addToCart = useAddToCart();
  const updateCartItem = useUpdateCartItem();

  // Get featured products first, then active products, limit to 6
  const displayProducts = products
    ?.filter((p) => p.status === "ACTIVE" || p.status === "OUT_OF_STOCK")
    ?.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (b.position || 0) - (a.position || 0);
    })
    .slice(0, 6);

  const featuredProducts = displayProducts?.filter((p) => p.isFeatured) || [];
  const regularProducts = displayProducts?.filter((p) => !p.isFeatured) || [];

  const handleAddToCart = async (product: Product) => {
    const existing = cart?.items.find(
      (item) => item.productUid === product.uid,
    );
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
      // errors are handled by hook toasts
    }
  };

  return (
    <section
      ref={ref}
      className="py-20 lg:py-32 bg-background relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Premium Products
            <TrendingUp className="w-4 h-4" />
          </motion.div>

          <TypographyH2 className="mb-4 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Featured Products
          </TypographyH2>

          <TypographyP className="text-muted-foreground text-lg">
            Discover our hand-picked selection of premium products designed to
            help you succeed. Quality guaranteed with fast delivery.
          </TypographyP>
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 lg:gap-8 mb-12">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-5">
                <Skeleton className="md:col-span-2 aspect-square" />
                <div className="md:col-span-3 p-6 space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : displayProducts && displayProducts.length > 0 ? (
          <div className="space-y-8 mb-12">
            {/* Featured Products */}
            {featuredProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                {featuredProducts.map((product, index) => (
                  <FeaturedProductCard
                    key={product.uid}
                    product={product}
                    onAddToCart={handleAddToCart}
                    index={index}
                  />
                ))}
              </motion.div>
            )}

            {/* Regular Products Grid */}
            {regularProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {regularProducts.map((product, index) => (
                  <ProductCard
                    key={product.uid}
                    product={product}
                    onAddToCart={handleAddToCart}
                    index={index + featuredProducts.length}
                  />
                ))}
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-center py-16"
          >
            <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <TypographyP className="text-muted-foreground">
              No products available at the moment.
            </TypographyP>
          </motion.div>
        )}

        {/* CTA Section */}
        {displayProducts && displayProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Link href="/client/products">
              <Button size="lg" className="group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  View All Products
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-primary to-purple-600"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 pt-16 border-t"
        >
          {[
            {
              icon: Star,
              title: "Premium Quality",
              description: "Hand-picked products with guaranteed quality",
            },
            {
              icon: TrendingUp,
              title: "Fast Delivery",
              description: "Quick processing and instant delivery",
            },
            {
              icon: Package,
              title: "Secure Purchase",
              description: "Safe and encrypted payment processing",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
