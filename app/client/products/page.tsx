"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetProductsPublic } from "@/hooks/use-product";
import { useGetCart, useAddToCart, useUpdateCartItem } from "@/hooks/use-cart";
import { useGetCategories } from "@/hooks/use-category";
import { Product } from "@/types";
import ProductDetail from "./components/ProductDetail";
import { ProductFilters, ProductsToolbar, ProductsList } from "./components";
import { CartDrawer } from "./components/CartDrawer";

type SortOption = "featured" | "price-low" | "price-high" | "name" | "newest";
type ViewMode = "grid" | "list";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const { data: products, isLoading: productsLoading } = useGetProductsPublic();
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  const { data: cart } = useGetCart();
  const addToCart = useAddToCart();
  const updateCartItem = useUpdateCartItem();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Find product by slug
  const selectedProduct = useMemo(() => {
    if (!slug || !products) return null;
    return products.find((p) => p.slug === slug) || null;
  }, [slug, products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products.filter(
      (product) =>
        product.status === "ACTIVE" || product.status === "OUT_OF_STOCK",
    );

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.tags?.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.categoryUid === selectedCategory,
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "featured":
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return (b.position || 0) - (a.position || 0);
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const handleAddToCart = async (product: Product, quantity = 1) => {
    const existing = cart?.items.find(
      (item) => item.productUid === product.uid,
    );
    try {
      if (existing) {
        await updateCartItem.mutateAsync({
          itemId: String(existing.id),
          quantity: existing.quantity + quantity,
        });
      } else {
        await addToCart.mutateAsync({ productUid: product.uid, quantity });
      }
    } catch {
      // errors already toasted in hooks
    }
  };

  const handleBackFromDetail = () => {
    router.push("/client/products");
  };

  // If product detail view is open, show that instead
  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onAddToCart={(qty) => handleAddToCart(selectedProduct, qty)}
        onBack={handleBackFromDetail}
      />
    );
  }

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  const activeFiltersCount =
    (searchQuery ? 1 : 0) + (selectedCategory !== "all" ? 1 : 0);

  return (
    <div className="space-y-6">
      <div className="flex gap-8 mt-6">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
              activeFiltersCount={activeFiltersCount}
              onCategoryChange={setSelectedCategory}
              onClearFilters={handleClearFilters}
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <ProductsToolbar
            searchQuery={searchQuery}
            sortBy={sortBy}
            viewMode={viewMode}
            activeFiltersCount={activeFiltersCount}
            productsCount={filteredAndSortedProducts.length}
            isLoading={productsLoading}
            showFilters={showFilters}
            onSearchChange={setSearchQuery}
            onSortChange={setSortBy}
            onViewModeChange={setViewMode}
            onShowFiltersChange={setShowFilters}
            filterContent={
              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                activeFiltersCount={activeFiltersCount}
                onCategoryChange={setSelectedCategory}
                onClearFilters={handleClearFilters}
              />
            }
          />

          <ProductsList
            products={filteredAndSortedProducts}
            isLoading={productsLoading}
            viewMode={viewMode}
            activeFiltersCount={activeFiltersCount}
            onAddToCart={(product) => handleAddToCart(product, 1)}
            onClearFilters={handleClearFilters}
          />
          {/* Floating Cart Drawer */}
          <CartDrawer />
        </div>
      </div>
    </div>
  );
}
