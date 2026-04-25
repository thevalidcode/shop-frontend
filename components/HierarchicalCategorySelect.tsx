"use client";

import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types";

interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
}

interface HierarchicalCategorySelectProps {
  categories?: Category[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function HierarchicalCategorySelect({
  categories,
  value,
  onValueChange,
  placeholder = "Select category",
  required = false,
  disabled = false,
}: HierarchicalCategorySelectProps) {
  // Build hierarchical tree structure
  const categoryTree = useMemo(() => {
    if (!categories) return [];

    const categoryMap = new Map<string, CategoryTreeNode>();
    const rootCategories: CategoryTreeNode[] = [];

    // First pass: create nodes (only ACTIVE categories)
    categories
      .filter((cat) => cat.status === "ACTIVE")
      .forEach((cat) => {
        categoryMap.set(cat.uid, { ...cat, children: [] });
      });

    // Second pass: build tree
    categories
      .filter((cat) => cat.status === "ACTIVE")
      .forEach((cat) => {
        const node = categoryMap.get(cat.uid)!;
        if (cat.parentUid) {
          const parent = categoryMap.get(cat.parentUid);
          if (parent) {
            parent.children.push(node);
          } else {
            rootCategories.push(node);
          }
        } else {
          rootCategories.push(node);
        }
      });

    // Sort by position
    const sortCategories = (cats: CategoryTreeNode[]) => {
      cats.sort((a, b) => {
        const posA = a.position ?? Number.MAX_SAFE_INTEGER;
        const posB = b.position ?? Number.MAX_SAFE_INTEGER;
        if (posA !== posB) return posA - posB;
        return a.name.localeCompare(b.name);
      });
      cats.forEach((cat) => sortCategories(cat.children));
    };

    sortCategories(rootCategories);
    return rootCategories;
  }, [categories]);

  // Flatten tree for select options with proper indentation
  const flattenedOptions = useMemo(() => {
    const options: { uid: string; label: string; depth: number }[] = [];

    const traverse = (node: CategoryTreeNode, depth: number = 0) => {
      // Add indentation based on depth
      const prefix = depth > 0 ? "  ".repeat(depth) + "└─ " : "";
      options.push({
        uid: node.uid,
        label: prefix + node.name,
        depth,
      });

      // Recursively add children
      node.children.forEach((child) => traverse(child, depth + 1));
    };

    categoryTree.forEach((root) => traverse(root, 0));
    return options;
  }, [categoryTree]);

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      required={required}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {flattenedOptions.map((option) => (
          <SelectItem
            key={option.uid}
            value={option.uid}
            className="font-mono"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
