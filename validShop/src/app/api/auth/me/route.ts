// src/app/api/auth/me/route.ts

import { apiFetch } from "@/lib/api/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = (await cookies()).get("vp_token")?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 200 });

  try {
    const user = await apiFetch<Record<string, unknown>>("/shop/current-user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
