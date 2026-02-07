"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DialogFooter } from "@/components/ui/dialog";
import { Product, ProductStatus } from "@/types";
import { useCreateProduct, useUpdateProduct } from "@/hooks/use-product";
import { useGetCategories } from "@/hooks/use-category";
import { HierarchicalCategorySelect } from "@/components/HierarchicalCategorySelect";
import { Loader2 } from "lucide-react";
import ProductPreview from "./ProductPreview";
import ImagePicker, { ImageData } from "../../components/ImagePicker";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";

interface ProductFormProps {
  product?: Product | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProductForm({
  product,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const { mutateAsync: createProduct, isPending: isCreating } =
    useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } =
    useUpdateProduct();
  const { data: categories } = useGetCategories();
  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    currency: product?.currency || userCurrency,
    description: product?.description || "",
    shortDescription: product?.shortDescription || "",
    price: product?.price || "",
    comparePrice: product?.comparePrice || product?.comparePrice || "",
    costPerItem: product?.costPerItem || "",
    min: product?.min || "",
    max: product?.max || "",
    categoryUid: product?.categoryUid || "",
    status: product?.status || ("ACTIVE" as ProductStatus),
    stock: product?.stock || 0,
    sku: product?.sku || "",
    trackInventory: product?.trackInventory ?? true,
    allowBackorder: product?.allowBackorder ?? false,
    isFeatured: product?.isFeatured ?? false,
    tags: product?.tags?.join(", ") || "",
  });

  // On mount, convert price fields from USD to userCurrency
  useEffect(() => {
    if (product && userCurrency && product.price) {
      setFormData((prev) => ({
        ...prev,
        price: convert(product.currency, userCurrency, product.price, false)
          .amount,
        comparePrice: product.comparePrice
          ? convert(product.currency, userCurrency, product.comparePrice, false)
              .amount
          : "",
        costPerItem: product.costPerItem
          ? convert(product.currency, userCurrency, product.costPerItem, false)
              .amount
          : "",
      }));
    }
  }, [product]); // Only on mount

  const [images, setImages] = useState<string[]>(
    product?.galleryUrls || (product?.imageUrl ? [product.imageUrl] : []),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-generate slug from name
  useEffect(() => {
    if (!product && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.name, product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImagesChange = (data: ImageData | ImageData[]) => {
    if (Array.isArray(data)) {
      setImages(data.map((img) => img.url));
    } else {
      setImages([data.url]);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Product name is required";
    if (!formData.slug) newErrors.slug = "Slug is required";
    if (!formData.price) newErrors.price = "Price is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const submitData = {
        ...formData,
        images,
        tags: formData.tags
          ? formData.tags.split(",").map((t: string) => t.trim())
          : [],
        stock: formData.trackInventory
          ? parseInt(formData.stock.toString())
          : undefined,
        price: formData.price,
        comparePrice: formData.comparePrice,
        min: formData.min ? Number(formData.min) : undefined,
        max: formData.max ? Number(formData.max) : undefined,
        galleryUrls: images,
        imageUrl: images[0] || undefined,
      };

      if (product) {
        await updateProduct({ uid: product.uid, ...submitData });
      } else {
        await createProduct(submitData);
      }

      onSuccess?.();
    } catch (error) {
      // Error handling done in hooks
    }
  };

  const isPending = isCreating || isUpdating;

  // Get selected category name for preview
  const selectedCategory = categories?.find(
    (cat) => cat.uid === formData.categoryUid,
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-7 xl:col-span-8 space-y-6"
      >
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-base">Basic Information</h3>

          <div className="space-y-1.5">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="product-slug"
            />
            {errors.slug && (
              <p className="text-sm text-destructive mt-1">{errors.slug}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Brief product description"
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Full Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed product description"
              rows={4}
            />
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h3 className="font-semibold text-base">Product Images</h3>
          <ImagePicker
            label="Upload product images"
            collection="products"
            multiple={true}
            maxFiles={10}
            value={images}
            onChange={handleImagesChange}
          />
          <p className="text-xs text-muted-foreground">
            First image is used as primary; the rest appear in the gallery.
          </p>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="font-semibold text-base">Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-destructive mt-1">{errors.price}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="comparePrice">Compare at Price</Label>
              <Input
                id="comparePrice"
                name="comparePrice"
                type="number"
                step="0.01"
                value={formData.comparePrice}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="min">Minimum Quantity (optional)</Label>
              <Input
                id="min"
                name="min"
                type="number"
                value={formData.min}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="max">Maximum Quantity (optional)</Label>
              <Input
                id="max"
                name="max"
                type="number"
                value={formData.max}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="space-y-4">
          <h3 className="font-semibold text-base">Inventory</h3>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="trackInventory">Track Inventory</Label>
              <p className="text-sm text-muted-foreground">
                Track product stock levels
              </p>
            </div>
            <Switch
              id="trackInventory"
              checked={formData.trackInventory}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, trackInventory: checked }))
              }
            />
          </div>

          {formData.trackInventory && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowBackorder">Allow Backorder</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow orders when out of stock
                  </p>
                </div>
                <Switch
                  id="allowBackorder"
                  checked={formData.allowBackorder}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      allowBackorder: checked,
                    }))
                  }
                />
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="PRODUCT-001"
            />
          </div>
        </div>

        {/* Organization */}
        <div className="space-y-4">
          <h3 className="font-semibold text-base">Organization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="categoryUid">Category</Label>
              <HierarchicalCategorySelect
                categories={categories}
                value={formData.categoryUid || undefined}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, categoryUid: value }))
                }
                placeholder="Select category"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as ProductStatus,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isFeatured">Featured Product</Label>
              <p className="text-sm text-muted-foreground">
                Show in featured section
              </p>
            </div>
            <Switch
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isFeatured: checked }))
              }
            />
          </div>
        </div>

        {/* Actions */}
        <DialogFooter className="pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {product ? "Update Product" : "Create Product"}
          </Button>
        </DialogFooter>
      </form>

      {/* Live Preview Section */}
      <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
        <div className="sticky top-6">
          <ProductPreview
            name={formData.name}
            shortDescription={formData.shortDescription}
            price={formData.price}
            comparePrice={formData.comparePrice}
            status={formData.status}
            categoryName={selectedCategory?.name}
            isFeatured={formData.isFeatured}
            stock={formData.stock}
            sku={formData.sku}
            currency={formData.currency}
            trackInventory={formData.trackInventory}
            tags={formData.tags}
            images={images}
          />
        </div>
      </div>
    </div>
  );
}
