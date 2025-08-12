export function parseTenantFromHost(host: string) {
  //handle localhost and previre domains if needed
  const base = host.split(":")[0];
  const parts = base.split(".");
  //seller.validshop.com → "seller"; validshop.com → null (marketing)
  return parts.length > 2 ? parts[0] : null;
}
