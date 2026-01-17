export default function ResultFailure({ brandName }: { brandName: string }) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
        !
      </div>
      <h1 className="text-2xl font-semibold">Payment failed</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We couldn’t complete your purchase from {brandName}. Please check your
        details and try again.
      </p>
      <a
        href="/checkout"
        className="mt-6 inline-flex rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
      >
        Return to checkout
      </a>
    </main>
  );
}
