// src/app/api/auth/logout/route.ts

import { cookieDomainFor } from "@/lib/auth/cookies";
import { cookies, headers } from "next/headers";

export async function POST() {
  const hdrs = await headers();
  const domain = cookieDomainFor(hdrs.get("host"));
  const secure = process.env.NODE_ENV === "production";
  const cookieStore = await cookies();
  cookieStore.set("vp_token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    domain,
    maxAge: 0,
  });
}
