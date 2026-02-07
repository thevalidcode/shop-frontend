"use client";

import { useMemo, useState, useEffect } from "react";
import { ChevronRight, ChevronDown, FolderTree } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
}

interface HierarchicalCategoryFilterProps {
  categories?: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryUid: string) => void;
  showProductCount?: boolean;
  productCounts?: Record<string, number>;
}

export function HierarchicalCategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  showProductCount = false,
  productCounts = {},
}: HierarchicalCategoryFilterProps) {
  // Build hierarchical tree structure first
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

  // Get all parent category UIDs (categories with children)
  const allParentUids = useMemo(() => {
    const parents = new Set<string>();
    const findParents = (nodes: CategoryTreeNode[]) => {
      nodes.forEach(node => {
        if (node.children.length > 0) {
          parents.add(node.uid);
          findParents(node.children);
        }
      });
    };
    findParents(categoryTree);
    return parents;
  }, [categoryTree]);

  // Initialize with all parent categories expanded
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => new Set(allParentUids)
  );

  const toggleExpand = (uid: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(uid)) {
      newExpanded.delete(uid);
    } else {
      newExpanded.add(uid);
    }
    setExpandedCategories(newExpanded);
  };

  // Check if a category or any of its children is selected
  const isCategoryPathSelected = (category: CategoryTreeNode): boolean => {
    if (category.uid === selectedCategory) return true;
    return category.children.some((child) => isCategoryPathSelected(child));
  };

  // Auto-expand path to selected category
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "all") {
      const findParents = (
        cats: CategoryTreeNode[],
        targetUid: string,
        parents: string[] = []
      ): string[] | null => {
        for (const cat of cats) {
          if (cat.uid === targetUid) {
            return parents;
          }
          const found = findParents(cat.children, targetUid, [
            ...parents,
            cat.uid,
          ]);
          if (found) return found;
        }
        return null;
      };

      const parents = findParents(categoryTree, selectedCategory);
      if (parents && parents.length > 0) {
        setExpandedCategories(prev => {
          const newSet = new Set(prev);
          parents.forEach(p => newSet.add(p));
          return newSet;
        });
      }
    }
  }, [selectedCategory, categoryTree]);

  const renderCategory = (category: CategoryTreeNode, depth: number = 0) => {
    const hasChildren = category.children.length > 0;
    const isExpanded = expandedCategories.has(category.uid);
    const isSelected = selectedCategory === category.uid;
    const isPathSelected = isCategoryPathSelected(category);
    const productCount = productCounts[category.uid] || 0;

    return (
      <div key={category.uid} className="category-filter-item">
        <div
          onClick={() => onCategoryChange(category.uid)}
          className={cn(
            "group w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
            isSelected
              ? "bg-primary text-primary-foreground font-medium"
              : isPathSelected
              ? "bg-primary/10 hover:bg-primary/20"
              : "hover:bg-muted"
          )}
          style={{
            paddingLeft: depth > 0 ? `${depth * 16 + 12}px` : "12px",
          }}
        >
          {/* Expand/Collapse Icon */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(category.uid);
              }}
              className={cn(
                "shrink-0 w-4 h-4 flex items-center justify-center rounded transition-transform",
                isExpanded && "rotate-0"
              )}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          ) : (
            <span className="w-4 shrink-0" />
          )}

          {/* Category Icon */}
          <div
            className={cn(
              "shrink-0 w-5 h-5 rounded flex items-center justify-center overflow-hidden",
              isSelected ? "bg-primary-foreground/20" : "bg-muted"
            )}
          >
            {category.iconUrl || category.imageUrl ? (
              <img
                src={category.iconUrl || category.imageUrl || ""}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <FolderTree
                className={cn(
                  "h-3 w-3",
                  isSelected ? "text-primary-foreground" : "text-muted-foreground"
                )}
              />
            )}
          </div>

          {/* Category Name */}
          <span className="flex-1 text-left truncate">{category.name}</span>

          {/* Product Count Badge */}
          {showProductCount && productCount > 0 && (
            <Badge
              variant={isSelected ? "secondary" : "outline"}
              className={cn(
                "shrink-0 text-xs h-5 px-1.5",
                isSelected && "bg-primary-foreground/20 text-primary-foreground border-0"
              )}
            >
              {productCount}
            </Badge>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {category.children.map((child) => renderCategory(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1">
      {/* All Categories Option */}
      <button
        onClick={() => onCategoryChange("all")}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          selectedCategory === "all"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        )}
      >
        <FolderTree className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">All Categories</span>
        {showProductCount && (
          <Badge
            variant={selectedCategory === "all" ? "secondary" : "outline"}
            className={cn(
              "shrink-0 text-xs h-5 px-1.5",
              selectedCategory === "all" &&
                "bg-primary-foreground/20 text-primary-foreground border-0"
            )}
          >
            {Object.values(productCounts).reduce((sum, count) => sum + count, 0)}
          </Badge>
        )}
      </button>

      {/* Hierarchical Categories */}
      {categoryTree.map((category) => renderCategory(category, 0))}
    </div>
  );
}
