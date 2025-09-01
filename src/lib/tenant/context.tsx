"use client";

import { createContext, useContext } from "react";

interface ShopProviderProps {
  value: ShopContextValue;
  children: React.ReactNode;
}

export type ShopContextValue = {
  host: string;
  subdomain: string | null;
  shopId: number | null;
  plan?: string | null;
  status?: string | null;
};

const ShopContext = createContext<ShopContextValue | undefined>(undefined);
export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within <SHopProvider>");
  return ctx;
}

export function ShopProvider({ value, children }: ShopProviderProps) {
  return <ShopContext.Provider value={value}> {children}</ShopContext.Provider>;
}
