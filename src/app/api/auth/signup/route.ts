// src/app/api/auth/signup/route.ts

import { apiFetch } from "@/lib/api/client";
import { cookieDomainFor } from "@/lib/auth/cookies";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, username, password, ref, shopId } = await req
    .json()
    .catch(() => ({}));
  if (!email || !username || !password) {
    return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
  }
  const body: Record<string, unknown> = { email, username, password };
  if (ref) body.ref = ref;
  if (shopId) body.shopId = shopId;

  const res = await apiFetch<{
    success?: string;
    user?: Record<string, unknown>;
    token?: string;
  }>("/user", {
    method: "POST",
    body,
  });

  const hdrs = await headers();
  const domain = cookieDomainFor(hdrs.get("host"));
  const secure = process.env.NODE_ENV === "production";
  if (res?.token) {
    const cookieStore = await cookies();
    cookieStore.set("vp_token", res.token, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      domain,
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return NextResponse.json({
    user: res.user ?? null,
    success: res.success ?? "ok",
  });
}
