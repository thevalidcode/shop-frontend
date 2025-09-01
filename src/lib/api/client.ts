// src/lib/api/client.ts
import axios from "axios";
import { Agent as HttpsAgent } from "node:https";

const API_BASE_URL = process.env.API_BASE_URL!;
const PUBLIC_ORIGIN = process.env.PUBLIC_ORIGIN || "https://validpanel.com";
const ALLOW_INSECURE = process.env.ALLOW_INSECURE_BACKEND === "true";

type FetchInit = Omit<RequestInit, "headers" | "body"> & {
  searchParams?: Record<string, string | number | boolean | undefined>;
  headers?: HeadersInit;
  token?: string;
  body?: unknown; // object or string; we JSON.stringify if needed for fetch
};

function withQuery(url: string, params?: FetchInit["searchParams"]) {
  if (!params) return url;
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) usp.set(k, String(v));
  }
  const q = usp.toString();
  return q ? `${url}?${q}` : url;
}

function toPlainHeaders(
  input?: HeadersInit,
  extra?: Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = {};
  if (input instanceof Headers) {
    input.forEach((v, k) => (out[k] = v));
  } else if (Array.isArray(input)) {
    for (const [k, v] of input) out[k] = v;
  } else if (input && typeof input === "object") {
    for (const [k, v] of Object.entries(input))
      if (typeof v === "string") out[k] = v;
  }
  if (extra) {
    for (const [k, v] of Object.entries(extra)) out[k] = v;
  }
  return out;
}

export async function apiFetch<T>(
  path: string,
  init: FetchInit = {}
): Promise<T> {
  if (!API_BASE_URL) throw new Error("Missing API_BASE_URL");
  const url = withQuery(`${API_BASE_URL}${path}`, init.searchParams);

  // Dev-only TLS bypass using axios if backend cert is expired
  if (ALLOW_INSECURE) {
    const headers = toPlainHeaders(init.headers, {
      Origin: PUBLIC_ORIGIN,
      "Content-Type": "application/json",
      ...(init.token ? { Authorization: `Bearer ${init.token}` } : {}),
    });

    const agent = new HttpsAgent({ rejectUnauthorized: false });

    const res = await axios.request({
      url,
      method: (init.method as string) ?? "GET",
      data: init.body, // axios will JSON.stringify objects
      headers,
      httpsAgent: agent,
      validateStatus: () => true,
    });
    if (res.status < 200 || res.status >= 300) {
      throw new Error(
        `API ${res.status} ${res.statusText}: ${JSON.stringify(res.data)}`
      );
    }
    return res.data as T;
  }

  // Normal path with native fetch
  const headers = new Headers(init.headers);
  headers.set("Origin", PUBLIC_ORIGIN);
  if (!headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  if (init.token) headers.set("Authorization", `Bearer ${init.token}`);

  const { body, ...rest } = init;
  const res = await fetch(url, {
    ...rest,
    headers,
    body:
      typeof body === "string" ? body : body ? JSON.stringify(body) : undefined,
    cache: rest.cache ?? "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `API ${res.status} ${res.statusText}: ${text || "request failed"}`
    );
  }
  return (await res.json()) as T;
}
