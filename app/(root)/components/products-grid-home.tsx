"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Grid3x3,
  List,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/ProductCard";
import { useGetProductsPublic } from "@/hooks/use-product";
import { useGetCategories } from "@/hooks/use-category";
import { Product } from "@/types";
import { useGetCart, useAddToCart, useUpdateCartItem } from "@/hooks/use-cart";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HierarchicalCategoryFilter } from "@/components/HierarchicalCategoryFilter";

type SortOption = "newest" | "price-low" | "price-high" | "popular";

const PRODUCTS_LIMIT = 12;

export function ProductsGridHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: products, isLoading } = useGetProductsPublic();
  const { data: categories } = useGetCategories();
  const { data: cart } = useGetCart();
  const addToCart = useAddToCart();
  const updateCartItem = useUpdateCartItem();

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result =
      products?.filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          !selectedCategory || p.categoryUid === selectedCategory;
        return (
          matchesSearch &&
          matchesCategory &&
          (p.status === "ACTIVE" || p.status === "OUT_OF_STOCK")
        );
      }) || [];

    // Sort
    switch (sortBy) {
      case "price-low":
        return result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case "price-high":
        return result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case "popular":
        return result.sort((a, b) => (b.position || 0) - (a.position || 0));
      case "newest":
      default:
        return result;
    }
  }, [products, searchQuery, selectedCategory, sortBy]);

  // Limit products to PRODUCTS_LIMIT for home display
  const displayProducts = filteredAndSortedProducts.slice(0, PRODUCTS_LIMIT);
  const hasMoreProducts = filteredAndSortedProducts.length > PRODUCTS_LIMIT;

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
      // errors surfaced via hook toasts
    }
  };

  const FilterContent = () => (
    <div className="space-y-6 px-5 lg:px-0">
      {/* Search */}
      <div>
        <label className="text-sm font-semibold block mb-2">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Filter */}
      {categories && categories.length > 0 && (
        <div>
          <label className="text-sm font-semibold block mb-3">Category</label>
          <HierarchicalCategoryFilter
            categories={categories}
            selectedCategory={selectedCategory || "all"}
            onCategoryChange={(uid) =>
              setSelectedCategory(uid === "all" ? "" : uid)
            }
          />
        </div>
      )}

      {/* Sort */}
      <div>
        <label className="text-sm font-semibold block mb-2">Sort By</label>
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortOption)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="popular">Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Showing {displayProducts.length} of {filteredAndSortedProducts.length}{" "}
          products
        </p>
      </div>
    </div>
  );

  return (
    <section className="py-8 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Shop Products</h1>
          <p className="text-muted-foreground">
            Discover our wide selection of quality products
          </p>
        </motion.div>

        {/* Desktop Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="hidden lg:grid lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Desktop Sidebar - Filters */}
          <div className="bg-card border rounded-lg p-6 h-fit sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold">Filters</h2>
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>
            <FilterContent />
          </div>

          {/* Desktop Products Grid */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {displayProducts.length} of{" "}
                {filteredAndSortedProducts.length} products
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Products */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredAndSortedProducts.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {displayProducts.map((product, index) => (
                    <motion.div
                      key={product.uid}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard
                        product={product}
                        variant="default"
                        index={index}
                        onAddToCart={() => handleAddToCart(product)}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* View All Products Button */}
                {hasMoreProducts && (
                  <div className="flex justify-center mt-12">
                    <Button asChild size="lg" className="group">
                      <Link href="/client/products">
                        View All Products ({filteredAndSortedProducts.length})
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">No products found</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Mobile Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:hidden mb-6 space-y-4"
        >
          {/* Search and View Toggle */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Filter Sheet */}
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto max-h-[80vh]">
              <SheetHeader className="mb-6">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="pb-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </motion.div>

        {/* Mobile Products */}
        <div className="lg:hidden">
          {isLoading ? (
            <div
              className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-2" : "grid-cols-1"}`}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredAndSortedProducts.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`grid gap-4 ${
                  viewMode === "grid"
                    ? "grid-cols-2 sm:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {displayProducts.map((product, index) => (
                  <motion.div
                    key={product.uid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard
                      product={product}
                      variant="default"
                      index={index}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* View All Products Button */}
              {hasMoreProducts && (
                <div className="flex justify-center mt-8">
                  <Button asChild size="lg" className="group w-full sm:w-auto">
                    <Link href="/client/products">
                      View All Products ({filteredAndSortedProducts.length})
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No products found</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Results Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          {filteredAndSortedProducts.length === 0 ? (
            <p>Try adjusting your filters to find what you're looking for</p>
          ) : (
            <p>
              Showing {displayProducts.length} of{" "}
              {filteredAndSortedProducts.length} products
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
