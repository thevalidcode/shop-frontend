// src/app/api/auth/login/route.ts

import { apiFetch } from "@/lib/api/client";
import { cookieDomainFor } from "@/lib/auth/cookies";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const {
    email,
    password,
    shopId: shopIdInput,
  } = body as {
    email: string;
    password: string;
    shopId?: number;
  };

  if (!email || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  // If backend required shopId to login, use provided, or env default
  const shopId =
    shopIdInput ??
    (process.env.DEFAULT_SHOP_ID
      ? Number(process.env.DEFAULT_SHOP_ID)
      : undefined);
  const payload = shopId ? { email, password, shopId } : { email, password };

  const res = await apiFetch<{
    success?: string;
    user?: Record<string, unknown>;
    token?: string;
  }>("/user/me", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  //Persist token across subdomains
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
      domain, //set via env for reliability
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return NextResponse.json({
    user: res.user ?? null,
    success: res.success ?? "ok",
  });
}
