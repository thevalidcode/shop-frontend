"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
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
import { Category, CategoryStatus } from "@/types";
import ImagePicker from "../../components/ImagePicker";

export type CategoryFormValues = {
  name: string;
  slug?: string;
  description?: string;
  iconUrl?: string;
  bannerUrl?: string;
  imageUrl?: string;
  status?: CategoryStatus;
  position?: number;
  parentUid?: string;
};

interface CategoryFormProps {
  category: CategoryFormValues;
  setCategory: Dispatch<SetStateAction<CategoryFormValues>>;
  isEditing?: boolean;
  categories?: Category[];
  excludeUid?: string;
}

const buildOrderedCategories = (categories: Category[]) => {
  const byParent = new Map<string | null, Category[]>();

  categories.forEach((cat) => {
    const key = cat.parentUid || null;
    const current = byParent.get(key) || [];
    current.push(cat);
    byParent.set(key, current);
  });

  const sortGroup = (list: Category[]) =>
    [...list].sort((a, b) => {
      const posA = a.position ?? Number.MAX_SAFE_INTEGER;
      const posB = b.position ?? Number.MAX_SAFE_INTEGER;
      if (posA !== posB) return posA - posB;
      return a.name.localeCompare(b.name);
    });

  const traverse = (
    parent: string | null,
    depth = 0,
  ): Array<{
    category: Category;
    depth: number;
  }> => {
    const group = sortGroup(byParent.get(parent) || []);
    return group.flatMap((cat) => [
      { category: cat, depth },
      ...traverse(cat.uid, depth + 1),
    ]);
  };

  return traverse(null, 0);
};

export default function CategoryForm({
  category,
  isEditing,
  categories = [],
  excludeUid,
  setCategory,
}: CategoryFormProps) {
  const handleChange = (key: keyof CategoryFormValues, value: any) =>
    setCategory((prev: CategoryFormValues) => ({ ...prev, [key]: value }));

  const orderedCategories = buildOrderedCategories(
    categories.filter((cat) => cat.uid !== excludeUid),
  );

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEditing && category.name) {
      const slug = category.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setCategory((prev) => ({ ...prev, slug }));
    }
  }, [category.name, isEditing]);

  return (
    <div className="space-y-4 text-sm mt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={category.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Category name"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={category.slug || ""}
            onChange={(e) => handleChange("slug", e.target.value)}
            placeholder="category-name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="parentUid">Parent (optional)</Label>
          <Select
            value={category.parentUid || "none"}
            onValueChange={(value) =>
              handleChange("parentUid", value === "none" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select parent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No parent (root)</SelectItem>
              {orderedCategories.map(({ category: cat, depth }) => (
                <SelectItem key={cat.uid} value={cat.uid}>
                  {depth > 0 ? `${"- ".repeat(depth)}${cat.name}` : cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Select
            value={category.status || "ACTIVE"}
            onValueChange={(value) =>
              handleChange("status", value as CategoryStatus)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={category.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Short category description..."
          rows={4}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-base">Images</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImagePicker
            label="Icon"
            collection="categories"
            value={category.iconUrl || ""}
            onChange={(data) => handleChange("iconUrl", data.url)}
          />

          <ImagePicker
            label="Banner Image"
            collection="categories"
            value={category.bannerUrl || ""}
            onChange={(data) => handleChange("bannerUrl", data.url)}
          />

          <ImagePicker
            label="Card Image"
            collection="categories"
            value={category.imageUrl || ""}
            onChange={(data) => handleChange("imageUrl", data.url)}
          />
        </div>
      </div>
    </div>
  );
}
