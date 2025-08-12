import { NextRequest, NextResponse } from "next/server";
import { parseTenantFromHost } from "./lib/tenant/host";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const subdomain = parseTenantFromHost(host);

  //marketing root (no subdomain) → no rewrite
  if (!subdomain || subdomain === "www") {
    return NextResponse.next();
  }

  //Rewrite subdomain requests to the storefront segment
  const url = req.nextUrl.clone();
  url.pathname = `/storefront${url.pathname}`;

  //Forward helpfun headers to the app
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-tenant", subdomain);
  requestHeaders.set("x-original-host", host);

  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

// Ignore Next internals, API routes, static files, and icons
export const config = {
  matcher: ["/((?!_next|api|favicon.ico|assets|.*\\..*).*)"],
};
