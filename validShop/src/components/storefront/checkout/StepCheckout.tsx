"use client";

import type { CheckoutItem } from "./CheckoutFlow";
import { useState } from "react";

type Form = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city?: string;
  state?: string;
  zip?: string;
};

export default function StepCheckout({
  brandColor = "var(--color-validGreen)",
  items,
  subtotal,
  shipping,
  discount,
  total,
  onBack,
  onPay,
}: {
  brandColor?: string;
  items: CheckoutItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  onBack: () => void;
  onPay: (form: Form) => Promise<void> | void;
}) {
  const [form, setForm] = useState<Form>({
    fullName: "",
    email: "",
    phone: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await onPay(form);
    setLoading(false);
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <section className="rounded-xl border bg-card p-6">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <h2 className="mt-6 text-sm font-medium">Shipping Information</h2>
        <div className="mt-3 flex gap-3">
          <button
            className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--input)",
              boxShadow: "inset 0 0 0 2px var(--input)",
            }}
            aria-pressed="true"
          >
            <span className="rounded-full border p-1" /> Delivery
          </button>
          <button className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground">
            <span className="rounded-full border p-1" /> Pick up
          </button>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Full name *</label>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none"
              placeholder="Enter full name"
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.currentTarget.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email address *</label>
            <input
              type="email"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none"
              placeholder="Enter email address"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.currentTarget.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Phone number *</label>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.currentTarget.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Country *</label>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none"
              placeholder="Choose state"
              value={form.country}
              onChange={(e) =>
                setForm({ ...form, country: e.currentTarget.value })
              }
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none"
              placeholder="City"
              value={form.city || ""}
              onChange={(e) =>
                setForm({ ...form, city: e.currentTarget.value })
              }
            />
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none"
              placeholder="State"
              value={form.state || ""}
              onChange={(e) =>
                setForm({ ...form, state: e.currentTarget.value })
              }
            />
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none"
              placeholder="ZIP Code"
              value={form.zip || ""}
              onChange={(e) => setForm({ ...form, zip: e.currentTarget.value })}
            />
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              className="rounded-md border px-4 py-2 text-sm"
              onClick={onBack}
            >
              Back
            </button>
            <button
              type="submit"
              className="rounded-md px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: brandColor }}
              disabled={loading}
            >
              {loading ? "Processing…" : "Pay Now"}
            </button>
          </div>
        </form>
      </section>

      <aside className="rounded-xl border bg-card p-6">
        <h3 className="text-sm font-medium">Review your cart</h3>
        <ul className="mt-4 space-y-3">
          {items.map((it) => (
            <li
              key={it.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="truncate">
                {it.name} × {it.qty}
              </span>
              <span>${(it.price * it.qty).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Discount</span>
            <span>~${discount.toFixed(2)}</span>
          </div>
          <div className="h-px w-full bg-border" />
          <div className="flex items-center justify-between font-medium">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
