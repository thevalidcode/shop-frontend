"use client";
import type { CheckoutItem } from "./CheckoutFlow";

export default function StepReview({
  items,
  subtotal,
  shipping,
  discount,
  total,
  onBack,
  onNext,
}: {
  items: CheckoutItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Review</h2>
        <ul className="mt-4 space-y-3">
          {items.map((it) => (
            <li
              key={it.id}
              className="flex items-center justify-between text-sm"
            >
              <span>
                {it.name} × {it.qty}
              </span>
              <span className="tabular-nums">
                ${(it.price * it.qty).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Discount</span>
          <span>~${discount.toFixed(2)}</span>
        </div>
        <div className="h-px w-full bg-border" />
        <div className="flex items-center justify-between text-sm font-medium">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            className="rounded-md border px-4 py-2 text-sm"
            onClick={onBack}
          >
            Back to Cart
          </button>
          <button
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
            onClick={onNext}
          >
            Proceed to Checkout
          </button>
        </div>
      </section>
    </div>
  );
}
