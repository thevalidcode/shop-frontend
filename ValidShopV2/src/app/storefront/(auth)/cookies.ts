export function getCookieDomain(hostHeader: string) {
  const explicit = process.env.COOKIE_DOMAIN;
  if (explicit) return explicit;

  const host = (hostHeader || "").split(":")[0].toLowerCase();
  if (!host || host === "localhost") return undefined;
  if (host.endsWith("lvh.me")) return ".lvh.me";
  if (host.endsWith("nip.io")) {
    const parts = host.split(".");
    return parts.length > 2 ? `.${parts.slice(-3).join(".")}` : undefined;
  }

  const parts = host.split(".");
  if (parts.length >= 2) return `.${parts.slice(-2).join(".")}`;
  return undefined;
}
