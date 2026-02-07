"use client";

import { ShopNotFound } from "@/components/shop-not-found";
import { useSearchParams } from "next/navigation";

/**
 * This page is displayed when:
 * 1. A shop cannot be found in the database
 * 2. Shop settings are missing or incomplete
 * 3. A critical error occurs while loading shop data
 *
 * Usage:
 * - Redirect from middleware or API when shop lookup fails
 * - Use as fallback when shop ID is invalid
 * - Handle missing required shop configuration
 */

export default function ShopNotFoundPage() {
  const searchParams = useSearchParams();
  const reason = (searchParams.get("reason") || "not-found") as
    | "not-found"
    | "missing-settings"
    | "error"
    | "page-not-found";
  const shopName = searchParams.get("shopName") || undefined;

  return <ShopNotFound reason={reason} shopName={shopName} />;
}
