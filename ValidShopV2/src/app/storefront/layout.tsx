import { headers as nextHeaders } from "next/headers";
import { parseTenantFromHost } from "@/lib/tenant/host";
import { getShopDataByDomain } from "@/lib/api/shop";

export default async function StoreForntLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headers = await nextHeaders();
  const host = headers.get("host") ?? "localhost:3000";
  const sub = parseTenantFromHost(host);
  const { shopId, plan, status } = await getShopDataByDomain(host);

  //Provide shop context to children if desired
  return <>{children}</>;
}
