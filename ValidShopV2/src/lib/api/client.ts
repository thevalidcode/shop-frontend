// ValidShopV2/src/lib/api/client.ts
const API_BASE_URL = process.env.API_BASE_URL!;
const PUBLIC_ORIGIN = process.env.PUBLIC_ORIGIN!;

type FetchInit = Omit<RequestInit, "headers"> & {
  searchParams?: Record<string, string | number | boolean | undefined>;
  headers?: HeadersInit;
  token?: string;
};

function withQuery(url: string, params?: FetchInit["searchParams"]) {
  if (!params) return url;
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) usp.set(k, String(v));
  });
  const q = usp.toString();
  return q ? `${url}?${q}` : url;
}

export async function apiFetch<T>(
  path: string,
  init: FetchInit = {}
): Promise<T> {
  const url = withQuery(`${API_BASE_URL}${path}`, init.searchParams);

  // Normalize headers to avoid type errors when init.headers is a Headers object
  const headers = new Headers(init.headers);
  if (PUBLIC_ORIGIN) headers.set("Origin", PUBLIC_ORIGIN);
  if (!headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  if (init.token) headers.set("Authorization", `Bearer ${init.token}`);

  const { searchParams, token, ...rest } = init;

  const res = await fetch(url, {
    ...rest,
    headers,
    cache: rest.cache ?? "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `API ${res.status} ${res.statusText}: ${text || "request failed"}`
    );
  }
  return res.json() as Promise<T>;
}
