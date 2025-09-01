"use client";
import type { CheckoutItem } from "./CheckoutFlow";

export default function StepCart({
  items,
  setQty,
  removeItem,
  onNext,
}: {
  items: CheckoutItem[];
  setQty: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  onNext: () => void;
}) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 5;
  const total = subtotal + shipping;

  return (
    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="grid grid-cols-[minmax(0,1fr)_110px_160px_120px_70px] items-center gap-4 px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground sm:px-6">
          <span>Item</span>
          <span className="text-right">Unit price</span>
          <span className="text-center">Quantity</span>
          <span className="text-right">Final price</span>
          <span className="text-center">Remove</span>
        </div>
        <div className="h-px w-full bg-border" />
        <ul className="divide-y">
          {items.map((r) => (
            <li
              key={r.id}
              className="grid grid-cols-[minmax(0,1fr)_110px_160px_120px_70px] items-center gap-4 px-4 py-4 sm:px-6"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 overflow-hidden rounded-md bg-muted" />
                <p className="truncate text-sm">{r.name}</p>
              </div>
              <div className="text-right text-sm">${r.price.toFixed(2)}</div>
              <div className="flex items-center justify-center gap-3 text-sm">
                <button
                  aria-label="decrease"
                  className="px-2 text-muted-foreground"
                  onClick={() => setQty(r.id, -1)}
                >
                  −
                </button>
                <span className="inline-block min-w-[2ch] text-center tabular-nums">
                  {String(r.qty).padStart(2, "0")}
                </span>
                <button
                  aria-label="increase"
                  className="px-2 text-muted-foreground"
                  onClick={() => setQty(r.id, 1)}
                >
                  +
                </button>
              </div>
              <div className="text-right text-sm tabular-nums">
                ${(r.price * r.qty).toFixed(2)}
              </div>
              <div className="text-center">
                <button
                  aria-label="remove"
                  className="text-sm text-muted-foreground"
                  onClick={() => removeItem(r.id)}
                >
                  x
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside className="rounded-xl border bg-card p-5">
        <h2 className="text-sm font-medium">Summary</h2>
        <div className="mt-5 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Shipping est.</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="h-px w-full bg-border" />
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Total price</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            className="mt-4 w-full rounded-md bg-foreground px-4 py-3 text-center text-xs font-semibold tracking-wide text-background"
            onClick={onNext}
          >
            CONTINUE
          </button>
        </div>
      </aside>
    </div>
  );
}
