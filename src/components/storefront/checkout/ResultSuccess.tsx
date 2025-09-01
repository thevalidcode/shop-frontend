import Link from "next/link";

export default function ResultSuccess({
  brandName,
  total,
}: {
  brandName: string;
  total: number;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
        ✓
      </div>
      <h1 className="text-2xl font-semibold">Payment successful</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Thank you for your purchase from {brandName}. Your card was charged $
        {total.toFixed(2)}.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
      >
        Continue shopping
      </Link>
    </main>
  );
}
