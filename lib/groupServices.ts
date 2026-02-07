import { Category, Product } from "@/types";

export function groupProductsByCategory(
  products: Product[],
  categories: Category[]
) {
  const grouped: Record<string, Product[]> = {};

  const categoryMeta: Record<string, { name: string; icon?: string }> = {};

  categories?.forEach((cat) => {
    categoryMeta[cat.uid] = {
      name: cat.name,
      icon: cat.iconUrl || undefined,
    };
  });

  products.forEach((product) => {
    const categoryUid = product.categoryUid || "uncategorized";
    if (!grouped[categoryUid]) {
      grouped[categoryUid] = [];
    }
    grouped[categoryUid].push(product);
  });

  return Object.entries(grouped).map(([categoryUid, products]) => {
    const meta = categoryMeta[categoryUid];

    return {
      title: meta?.name || "Uncategorized",
      icon: meta?.icon || "/images/default-category-icon.png",
      products,
    };
  });
}

// Keep the old name as alias for backward compatibility
export const groupServicesByCategory = groupProductsByCategory;
