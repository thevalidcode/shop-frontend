"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect, FormEvent } from "react";
import Loading from "@/app/loading";
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-category";
import { Category, CategoryStatus } from "@/types";
import CategoryForm, { CategoryFormValues } from "../components/CategoryForm";

export default function CategoryDialog({
  open,
  onOpenChange,
  category,
  categories = [],
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  category?: Category | null;
  categories?: Category[];
}) {
  const defaultCategory: CategoryFormValues = {
    name: "",
    slug: "",
    description: "",
    iconUrl: "",
    bannerUrl: "",
    imageUrl: "",
    parentUid: "",
    position: undefined as number | undefined,
    status: "ACTIVE" as CategoryStatus,
  };

  const [newCategory, setNewCategory] =
    useState<CategoryFormValues>(defaultCategory);

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const isLoading = isCreating || isUpdating;

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  // Populate form if editing
  useEffect(() => {
    if (category && category.uid) {
      setNewCategory({
        ...defaultCategory,
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        iconUrl: category.iconUrl || "",
        bannerUrl: category.bannerUrl || "",
        imageUrl: category.imageUrl || "",
        parentUid: category.parentUid || "",
        position: category.position,
        status: category.status || "ACTIVE",
      });
    } else if (category && category.parentUid) {
      // Creating subcategory
      setNewCategory({
        ...defaultCategory,
        parentUid: category.parentUid,
      });
    } else {
      setNewCategory(defaultCategory);
    }
  }, [category, open]);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    const slug = newCategory.slug?.trim()
      ? newCategory.slug.trim()
      : slugify(newCategory.name);

    const payload = {
      ...newCategory,
      slug,
      parentUid: newCategory.parentUid || undefined,
      iconUrl: newCategory.iconUrl || undefined,
      bannerUrl: newCategory.bannerUrl || undefined,
      imageUrl: newCategory.imageUrl || undefined,
      description: newCategory.description || undefined,
      position:
        typeof newCategory.position === "number"
          ? newCategory.position
          : undefined,
    };

    if (category && category.uid) {
      updateCategory({ ...payload, uid: category.uid });
    } else {
      createCategory(payload);
    }
    onOpenChange(false);
    setNewCategory(defaultCategory);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] p-0 overflow-y-auto">
        {isLoading ? (
          <div className="px-6 py-4">
            <Loading />
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <DialogHeader className="px-6 py-4 border-b">
              <DialogTitle>
                {category && category.uid ? "Edit Category" : "Add New Category"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {category && category.uid
                  ? "Update the category details below."
                  : "Create a new category to organize your products."}
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 py-4 space-y-5">
              <CategoryForm
                category={newCategory}
                setCategory={setNewCategory}
                isEditing={category && category.uid ? true : false}
                categories={categories}
                excludeUid={category?.uid}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {category && category.uid ? "Update Category" : "Add Category"}
                </Button>
              </DialogFooter>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
