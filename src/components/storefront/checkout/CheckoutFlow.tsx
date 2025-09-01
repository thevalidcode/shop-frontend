"use client";

import { useMemo, useState } from "react";
import StepCart from "./StepCart";
import StepReview from "./StepReview";
import StepCheckout from "./StepCheckout";
import ResultSuccess from "./ResultSuccess";
import ResultFailure from "./ResultFailure";

export type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

type Props = {
  brandName: string;
  brandColor?: string;
  items: CheckoutItem[];
};

export default function CheckoutFlow({
  brandName,
  brandColor = "var(--color-validGreen)",
  items: initialItems,
}: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // start at Cart
  const [resultOk, setResultOk] = useState<boolean | null>(null);
  const [items, setItems] = useState<CheckoutItem[]>(initialItems);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items]
  );
  const shipping = 5;
  const discount = 10;
  const total = Math.max(0, subtotal + shipping - discount);

  function setQty(id: string, delta: number) {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it
      )
    );
  }
  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  const brandMark = (
    <div className="flex items-center gap-2" aria-label="Brand">
      {/* <span
        className="inline-block h-7 w-7 rounded-md"
        style={{ backgroundColor: brandColor }}
      />
      <span className="text-base font-semibold tracking-wide">{brandName}</span> */}
    </div>
  );

  const stepper = (
    <ol className="flex items-center gap-6 text-sm" aria-label="Checkout steps">
      {[1, 2, 3].map((i) => {
        const isActive = step === i;
        const isDone = step > i;
        const label = i === 1 ? "Cart" : i === 2 ? "Review" : "Checkout";
        return (
          <li key={i} className="flex items-center gap-2">
            <span
              className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
                isActive ? "text-background" : "border"
              }`}
              style={isActive ? { backgroundColor: brandColor } : undefined}
            >
              {isDone ? "✓" : i}
            </span>
            <button
              className={`$${"text-foreground/90"}`}
              onClick={() => setStep(i as 1 | 2 | 3)}
            >
              {label}
            </button>
          </li>
        );
      })}
    </ol>
  );

  if (step === 4) {
    return resultOk ? (
      <ResultSuccess brandName={brandName} total={total} />
    ) : (
      <ResultFailure brandName={brandName} />
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-6">
        {brandMark}
        {stepper}
      </div>

      {step === 1 && (
        <StepCart
          items={items}
          setQty={setQty}
          removeItem={removeItem}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <StepReview
          items={items}
          subtotal={subtotal}
          shipping={shipping}
          discount={discount}
          total={total}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <StepCheckout
          brandColor={brandColor}
          items={items}
          subtotal={subtotal}
          shipping={shipping}
          discount={discount}
          total={total}
          onBack={() => setStep(2)}
          onPay={async (form) => {
            // fake payment latency + random outcome
            await new Promise((r) => setTimeout(r, 700));
            const ok =
              form.fullName && form.email && form.phone && form.country;
            setResultOk(Boolean(ok));
            setStep(4);
          }}
        />
      )}
    </main>
  );
}
