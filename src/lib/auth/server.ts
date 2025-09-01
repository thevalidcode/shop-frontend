// src/lib/auth/server.ts

import { cookies, headers } from "next/headers";
import { normalizeRole, Role } from "./roles";
import { getShopDataByDomain } from "../api/shop";
import { apiFetch } from "../api/client";

const DEV_SHOP_ID = process.env.DEV_SHOP_ID
  ? Number(process.env.DEV_SHOP_ID)
  : null;

export type AuthContext = {
  host: string;
  shopId: number | null;
  user: Record<string, unknown> | null;
  role: Role;
  status: string | null;
};

export async function getServerAuthContext(): Promise<AuthContext> {
  const hdrs = await headers();
  const host =
    hdrs.get("x-original-host") ?? hdrs.get("host") ?? "validpanel.com";

  let shopId: number | null = null;
  try {
    const data = await getShopDataByDomain(host);
    shopId = data.shopId;
  } catch {
    shopId = DEV_SHOP_ID;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("vp_token")?.value;
  if (!token) {
    return { host, shopId, user: null, role: normalizeRole(), status: null };
  }

  try {
    const user = await apiFetch<Record<string, unknown>>("/shop/current-user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const role = normalizeRole(user?.role as string | undefined);
    const status = (user?.status ?? null) as string | null;
    return { host, shopId, user, role, status };
  } catch {
    return { host, shopId, user: null, role: normalizeRole(), status: null };
  }
}
