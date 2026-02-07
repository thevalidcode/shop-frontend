"use client";

import { useState, useMemo } from "react";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  FolderTree,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  Image as ImageIcon,
  MoreVertical,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  useGetCategories,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/use-category";
import { EmptyState } from "@/components/empty-state";
import Loading from "@/app/loading";
import CategoryDialog from "./CategoryDialog";
import DeleteDialog from "../../components/DeleteDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryStats } from "./CategoryStats";

interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
}

export default function CategoriesManager() {
  const { data: categoriesData, isLoading } = useGetCategories();
  const deleteCategory = useDeleteCategory();
  const updateCategory = useUpdateCategory();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  // Build hierarchical tree structure
  const categoryTree = useMemo(() => {
    if (!categoriesData) return [];

    const categoryMap = new Map<string, CategoryTreeNode>();
    const rootCategories: CategoryTreeNode[] = [];

    // First pass: create nodes
    categoriesData.forEach((cat) => {
      categoryMap.set(cat.uid, { ...cat, children: [] });
    });

    // Second pass: build tree
    categoriesData.forEach((cat) => {
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
  }, [categoriesData]);

  // Filter categories
  const filteredTree = useMemo(() => {
    if (!searchQuery && statusFilter === "all") return categoryTree;

    const matchesFilter = (cat: CategoryTreeNode): boolean => {
      const matchesSearch =
        searchQuery === "" ||
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false);

      const matchesStatus =
        statusFilter === "all" || cat.status === statusFilter;

      return matchesSearch && matchesStatus;
    };

    const filterTree = (categories: CategoryTreeNode[]): CategoryTreeNode[] => {
      return categories
        .map((cat) => {
          const childrenMatches = filterTree(cat.children);
          const selfMatches = matchesFilter(cat);

          if (selfMatches || childrenMatches.length > 0) {
            return { ...cat, children: childrenMatches };
          }
          return null;
        })
        .filter((cat): cat is CategoryTreeNode => cat !== null);
    };

    return filterTree(categoryTree);
  }, [categoryTree, searchQuery, statusFilter]);

  const toggleExpand = (uid: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(uid)) {
      newExpanded.delete(uid);
    } else {
      newExpanded.add(uid);
    }
    setExpandedCategories(newExpanded);
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (cats: CategoryTreeNode[]) => {
      cats.forEach((cat) => {
        if (cat.children.length > 0) {
          allIds.add(cat.uid);
          collectIds(cat.children);
        }
      });
    };
    collectIds(categoryTree);
    setExpandedCategories(allIds);
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleCreate = (parent?: Category) => {
    setSelectedCategory(
      parent ? ({ parentUid: parent.uid } as Category) : null,
    );
    setDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory.mutate({ uid: categoryToDelete.uid });
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleToggleStatus = (category: Category) => {
    updateCategory.mutate({
      uid: category.uid,
      status: category.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    });
  };

  const renderCategory = (category: CategoryTreeNode, depth: number = 0) => {
    const hasChildren = category.children.length > 0;
    const isExpanded = expandedCategories.has(category.uid);

    return (
      <div key={category.uid} className="category-item">
        {/* Category Row */}
        <div
          className={`group flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors`}
          style={
            {
              marginLeft: depth > 0 ? `${depth * 32}px` : 0,
            } as React.CSSProperties
          }
        >
          {/* Expand/Collapse Button */}
          <button
            onClick={() => hasChildren && toggleExpand(category.uid)}
            className={`shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-accent ${
              !hasChildren && "invisible"
            }`}
          >
            {hasChildren &&
              (isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              ))}
          </button>

          {/* Category Icon/Image */}
          <div className="shrink-0 w-12 h-12 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
            {category.imageUrl || category.iconUrl ? (
              <img
                src={category.imageUrl || category.iconUrl || ""}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <FolderTree className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          {/* Category Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{category.name}</h3>
              <Badge
                variant={category.status === "ACTIVE" ? "default" : "secondary"}
                className="shrink-0"
              >
                {category.status}
              </Badge>
              {hasChildren && (
                <Badge variant="outline" className="shrink-0">
                  {category.children.length}{" "}
                  {category.children.length === 1
                    ? "subcategory"
                    : "subcategories"}
                </Badge>
              )}
            </div>
            {category.description && (
              <p className="text-sm text-muted-foreground truncate">
                {category.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {category.slug}
              </code>
            </div>
          </div>

          {/* Actions */}
          <div className="shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {hasChildren && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCreate(category)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(category)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCreate(category)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subcategory
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToggleStatus(category)}>
                  {category.status === "ACTIVE" ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDelete(category)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-2">
            {category.children.map((child) => renderCategory(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) return <Loading />;

  const totalCategories = categoriesData?.length || 0;
  const activeCategories =
    categoriesData?.filter((c) => c.status === "ACTIVE").length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product categories and subcategories
          </p>
        </div>
        <Button onClick={() => handleCreate()} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      {categoriesData && <CategoryStats categories={categoriesData} />}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-lg border bg-card">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {categoryTree.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={expandAll}>
              Expand All
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll}>
              Collapse All
            </Button>
          </div>
        )}
      </div>

      {/* Categories List */}
      <div className="space-y-2">
        {filteredTree.length === 0 ? (
          <EmptyState
            icon={FolderTree}
            title="No categories found"
            description={
              searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first category"
            }
            actionLabel={
              !searchQuery && statusFilter === "all"
                ? "Create Category"
                : undefined
            }
            onAction={
              !searchQuery && statusFilter === "all"
                ? () => handleCreate()
                : undefined
            }
          />
        ) : (
          filteredTree.map((category) => renderCategory(category, 0))
        )}
      </div>

      {/* Category Dialog */}
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selectedCategory}
        categories={categoriesData || []}
      />

      {/* Delete Confirmation */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        count={1}
        names={categoryToDelete?.name ? [categoryToDelete.name] : []}
        entityName="category"
      />
    </div>
  );
}
