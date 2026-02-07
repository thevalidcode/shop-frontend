"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetProducts,
  useDeleteProduct,
  useCreateProduct,
} from "@/hooks/use-product";
import { Product } from "@/types";
import ProductForm from "./components/ProductForm";
import AdminProductDetail from "./components/AdminProductDetail";
import DeleteDialog from "../components/DeleteDialog";
import {
  ProductsHeader,
  ProductStats,
  ProductsControls,
  ProductGrid,
  ProductTableView,
} from "./components";

type ViewMode = "grid" | "table";

export default function AdminProductsPage() {
  const { data: products, isLoading } = useGetProducts();
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const { mutateAsync: createProduct } = useCreateProduct();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products
    ?.filter((product) => {
      // Status filter
      if (statusFilter === "All") return true;
      return product.status === statusFilter;
    })
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct({ uid: selectedProduct.uid });
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      // Error already handled by the hook
    }
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleViewClick = (product: Product) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDuplicateClick = async (product: Product) => {
    try {
      const timestamp = Date.now();
      const duplicatedProduct = {
        name: `${product.name} (Copy)`,
        slug: `${product.slug}-copy-${timestamp}`,
        description: product.description || undefined,
        shortDescription: product.shortDescription || undefined,
        price: product.price,
        currency: product.currency || "USD",
        comparePrice: product.comparePrice || undefined,
        galleryUrls: product.galleryUrls || undefined,
        imageUrl: product.imageUrl || undefined,
        categoryUid: product.categoryUid || undefined,
        status: "INACTIVE" as const,
        stock: product.stock || undefined,
        sku: product.sku ? `${product.sku}-copy-${timestamp}` : undefined,
        trackInventory: product.trackInventory,
        allowBackorder: product.allowBackorder,
        weight: product.weight || undefined,
        dimensions: product.dimensions || undefined,
        tags: product.tags,
        isFeatured: false,
        position: product.position || undefined,
      };

      await createProduct(duplicatedProduct);
    } catch (error) {
      // Error already handled by the hook
    }
  };

  return (
    <div className="space-y-6">
      <ProductsHeader
        onCreateClick={() => setIsCreateDialogOpen(true)}
        search={searchQuery}
        status={statusFilter}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
      />

      <ProductStats products={products} />

      <ProductsControls
        searchQuery={searchQuery}
        viewMode={viewMode}
        onSearchChange={setSearchQuery}
        onViewModeChange={setViewMode}
      />

      {viewMode === "grid" ? (
        <ProductGrid
          products={filteredProducts || []}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onViewClick={handleViewClick}
          onCreateClick={() => setIsCreateDialogOpen(true)}
          onDuplicateClick={handleDuplicateClick}
        />
      ) : (
        <ProductTableView
          products={filteredProducts || []}
          isLoading={isLoading}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onViewClick={handleViewClick}
          onDuplicateClick={handleDuplicateClick}
        />
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-[95%] sm:max-w-2xl lg:max-w-6xl xl:max-w-7xl max-h-[95vh] sm:max-h-[90vh] p-0 gap-0 overflow-y-auto">
          <DialogHeader className="px-4 sm:px-6 py-4 sm:py-5 border-b">
            <DialogTitle className="text-lg sm:text-xl font-semibold">
              Create New Product
            </DialogTitle>
            <DialogDescription className="text-sm">
              Add a new product to your catalog. Fill in the details and see a
              live preview.
            </DialogDescription>
          </DialogHeader>
          <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto">
            <ProductForm
              onSuccess={() => setIsCreateDialogOpen(false)}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[95%] sm:max-w-2xl lg:max-w-6xl xl:max-w-7xl max-h-[95vh] sm:max-h-[90vh] p-0 gap-0 overflow-y-auto">
          <DialogHeader className="px-4 sm:px-6 py-4 sm:py-5 border-b">
            <DialogTitle className="text-lg sm:text-xl font-semibold">
              Edit Product
            </DialogTitle>
            <DialogDescription className="text-sm">
              Update product information and see changes in real-time.
            </DialogDescription>
          </DialogHeader>
          <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto">
            <ProductForm
              product={selectedProduct}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setSelectedProduct(null);
              }}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedProduct(null);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <AdminProductDetail
        product={selectedProduct}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        count={selectedProduct ? 1 : 0}
        names={selectedProduct?.name ? [selectedProduct.name] : []}
        entityName="product"
      />
    </div>
  );
}
