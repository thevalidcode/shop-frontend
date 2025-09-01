// ValidShopV2/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { parseTenantFromHost } from "@/lib/tenant/host";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const sub = parseTenantFromHost(host); // matches any host with a subdomain (incl. lvh.me)

  if (sub) {
    const url = req.nextUrl.clone();
    url.pathname = `/storefront${url.pathname}`;
    const res = NextResponse.rewrite(url);
    res.headers.set("x-original-host", host);
    return res;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|assets|.*\\..*).*)"],
};
