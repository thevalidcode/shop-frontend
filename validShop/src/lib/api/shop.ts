import { apiFetch } from "./client";
import { DesignStyles, ShopData, SiteData } from "./types";

export async function getShopDataByDomain(domain: string) {
  //GET /shop/data?domain=<host>
  return apiFetch<ShopData>("/shop/data", { searchParams: { domain } });
}

export async function getSiteData() {
  //GET /shop/site-data
  return apiFetch<SiteData>("/shop/site-data");
}

export async function getDesignStyles() {
  return apiFetch<DesignStyles>("/shop/styles");
}
export async function getRates() {
  return apiFetch<Record<string, unknown>>("/shop/rates");
}
