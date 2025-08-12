import { apiFetch } from "./client";
import { ProductPublic } from "./types";

export async function getProducts(shopId: number) {
  //GET /product?shopId=<id>
  return apiFetch<ProductPublic[]>("/product", { searchParams: { shopId } });
}
