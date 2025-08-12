import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const {
    email,
    password,
    shopHost,
    shopId: shopIdInput,
  } = body as {
    email: string;
    password: string;
    shopHost?: string;
    shopId?: number;
  };

  if (!email || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  // If backend required shopId to login, use provided, or env default
}
