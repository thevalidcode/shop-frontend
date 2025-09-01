"use client";

import Link from "next/link";
import { useState } from "react";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2" aria-label="Go home">
          <span
            className="inline-block h-6 w-6 rounded-md"
            style={{ backgroundColor: "var(--color-validGreen)" }}
          />
          <span className="text-sm font-semibold tracking-wide">Seller</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/storefront"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Shop
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Customize
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Collabs
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Wholesale
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/storefront/cart" className="relative text-sm">
            <span className="rounded-md border px-3 py-1.5">Cart</span>
            <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background">
              0
            </span>
          </Link>
          <button
            className="md:hidden rounded-md border px-3 py-1.5 text-sm"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-background md:hidden">
          <nav className="mx-auto grid max-w-6xl gap-1 px-4 py-3 sm:px-6 lg:px-8">
            <Link
              href="/storefront"
              className="rounded-md px-2 py-2 text-sm hover:bg-muted"
            >
              Shop
            </Link>
            <Link
              href="#"
              className="rounded-md px-2 py-2 text-sm hover:bg-muted"
            >
              Customize
            </Link>
            <Link
              href="#"
              className="rounded-md px-2 py-2 text-sm hover:bg-muted"
            >
              Collabs
            </Link>
            <Link
              href="#"
              className="rounded-md px-2 py-2 text-sm hover:bg-muted"
            >
              Wholesale
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
