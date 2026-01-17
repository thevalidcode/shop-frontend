// src/lib/tenant/host.ts

export function parseTenantFromHost(host: string) {
  const base = (host || "").split(":")[0].toLowerCase();
  const parts = base.split(".");

  // Handle development subdomains like seller1.lvh.me
  if (
    parts.length === 2 &&
    (base.endsWith(".lvh.me") || base.endsWith(".nip.io"))
  ) {
    return parts[0];
  }

  // Handle production subdomains like seller.validpanel.com
  if (parts.length > 2) {
    return parts[0];
  }

  return null; // root like validpanel.com
}

export function isPlatformRoot(host: string) {
  const h = (host || "").split(":")[0].toLowerCase();
  const root = (process.env.ROOT_DOMAIN || "validpanel.com").toLowerCase();
  return h === root || h === `www.${root}`;
}

export function isPlatformSubdomain(host: string) {
  const h = (host || "").split(":")[0].toLowerCase();
  const root = (process.env.ROOT_DOMAIN || "validpanel.com").toLowerCase();
  const isValidpanelSub = h.endsWith(`.${root}`);
  const isDevSub = h.endsWith(".lvh.me") || h.endsWith(".nip.io");
  return (isValidpanelSub || isDevSub) && !isPlatformRoot(h);
}
