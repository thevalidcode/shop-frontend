// src/lib/auth/cookies.ts
export function cookieDomainFor(hostHeader: string | null) {
  if (process.env.COOKIE_DOMAIN) return process.env.COOKIE_DOMAIN;

  const host = (hostHeader || "").split(":")[0].toLowerCase();

  // Dev: lvh.me supports subdomains
  if (host.endsWith("lvh.me")) return ".lvh.me";

  const root = (process.env.ROOT_DOMAIN || "validpanel.com").toLowerCase();

  //Always use parent domain in prod for cross-subdomain auth
  return `.${root}`;
}
