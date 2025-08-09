import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { StarRating } from "@/components/StarRating";

const DUMMY_BASE = "https://dummyjson.com";

const formatCurrency = (value) => {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `₦${value}`;
  }
};

// Convert a hex color like #0cdd08 to rgba with custom opacity
const hexToRGBA = (hex, opacity) => {
  if (!hex || typeof hex !== "string") return `rgba(12, 221, 8, ${opacity})`;
  const clean = hex.trim();
  if (!clean.startsWith("#") || (clean.length !== 7 && clean.length !== 4))
    return `rgba(12, 221, 8, ${opacity})`;
  // Support #rgb shorthand
  const normalized =
    clean.length === 4
      ? `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`
      : clean;
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  if ([r, g, b].some((v) => Number.isNaN(v)))
    return `rgba(12, 221, 8, ${opacity})`;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const ProductCard = ({ product }) => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.discountPercentage ? (
          <div className="absolute top-2 left-2 rounded bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
            -{Math.round(product.discountPercentage)}%
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-semibold text-gray-800">
            {product.title}
          </p>
          <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 uppercase">
            {product.category}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-validGreen text-lg font-bold">
              {formatCurrency(product.price)}
            </p>
            {product.price && product.discountPercentage ? (
              <p className="text-xs text-gray-400 line-through">
                {formatCurrency(
                  Math.round(
                    product.price / (1 - product.discountPercentage / 100) ||
                      product.price,
                  ),
                )}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <StarRating rating={product.rating} className="text-sm" />
          <span className="text-xs text-gray-500">{product.brand}</span>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <button className="bg-validGreen flex-1 rounded-md px-3 py-2 text-sm font-medium text-white transition hover:bg-lime-500">
            Add to Cart
          </button>
          <button className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            Quick View
          </button>
        </div>
      </div>
    </div>
  );
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      className="rounded-md border border-white/30 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
    >
      <span className="inline-flex items-center gap-2">
        <i className={`bx ${theme === "dark" ? "bx-sun" : "bx-moon"}`}></i>
        {theme === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
};

const StoreHeader = ({ seller }) => {
  const [accent, setAccent] = useState("#0cdd08");

  useEffect(() => {
    const saved = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-validGreen")
      .trim();
    if (saved && saved.startsWith("#")) setAccent(saved);
  }, []);

  const gradientStyle = useMemo(() => {
    const g1 = hexToRGBA(accent, 0.95);
    const g2 = hexToRGBA(accent, 0.72);
    const g3 = hexToRGBA(accent, 0.5);
    return {
      backgroundImage: `linear-gradient(135deg, ${g1} 0%, ${g2} 45%, ${g3} 100%)`,
    };
  }, [accent]);

  return (
    <div
      className="relative mb-6 overflow-hidden rounded-2xl border text-white"
      style={gradientStyle}
    >
      <div className="absolute inset-0 opacity-25 mix-blend-overlay">
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.2),rgba(0,0,0,0)_60%)]" />
      </div>
      <div className="relative z-10 flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-10">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 text-2xl font-bold">
            {seller.initials}
          </div>
          <div>
            <h1 className="font-orbitron text-2xl font-bold md:text-3xl">
              {seller.name}
            </h1>
            <p className="text-white/80">{seller.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{seller.products}</p>
            <p className="text-xs tracking-wide text-white/80 uppercase">
              Products
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{seller.rating}</p>
            <p className="text-xs tracking-wide text-white/80 uppercase">
              Rating
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{seller.followers}k</p>
            <p className="text-xs tracking-wide text-white/80 uppercase">
              Followers
            </p>
          </div>
          <button className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/20">
            Follow Store
          </button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

const Controls = ({
  categories,
  activeCategory,
  setActiveCategory,
  query,
  setQuery,
  sort,
  setSort,
  onReset,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, e.g., phone, shoes..."
            className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2 outline-none focus:ring-2 focus:ring-green-500"
          />
          <i className="bx bx-search absolute top-1/2 left-3 -translate-y-1/2 text-xl text-gray-500" />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-52 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="trending">Sort: Trending</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
        <button
          onClick={onReset}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Reset
        </button>
      </div>

      <div className="scrollbar-hide -mx-2 flex gap-2 overflow-x-auto md:mx-0">
        <button
          onClick={() => setActiveCategory("")}
          className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${
            !activeCategory
              ? "bg-validGreen text-white"
              : "border border-gray-300 bg-white text-gray-700"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm whitespace-nowrap capitalize ${
              activeCategory === cat
                ? "bg-validGreen text-white"
                : "border border-gray-300 bg-white text-gray-700"
            }`}
          >
            {cat.replaceAll("-", " ")}
          </button>
        ))}
      </div>
    </div>
  );
};

const Storefront = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [sort, setSort] = useState("trending");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 12;

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await axios.get(`${DUMMY_BASE}/products/categories`);
        // API may return array of objects or strings depending on version; normalize to strings
        const cats = Array.isArray(res.data)
          ? res.data.map((c) =>
              typeof c === "string" ? c : c.slug || c.name || "",
            )
          : [];
        setCategories(cats.filter(Boolean).slice(0, 12));
      } catch (e) {
        // Non-blocking
      }
    };
    getCategories();
  }, []);

  const fetchProducts = async (reset = false) => {
    setIsLoading(true);
    setError("");
    try {
      const nextSkip = reset ? 0 : skip;
      const params = new URLSearchParams({
        limit: String(limit),
        skip: String(nextSkip),
      });
      let url = `${DUMMY_BASE}/products`;
      if (activeCategory) {
        url = `${DUMMY_BASE}/products/category/${encodeURIComponent(activeCategory)}`;
      } else if (debouncedQuery) {
        url = `${DUMMY_BASE}/products/search?q=${encodeURIComponent(debouncedQuery)}`;
      }

      const res = await axios.get(`${url}?${params.toString()}`);
      const list = res.data?.products || res.data || [];
      const total = res.data?.total ?? list.length;
      const newItems = Array.isArray(list) ? list : [];
      setProducts((prev) => (reset ? newItems : [...prev, ...newItems]));
      setHasMore(nextSkip + limit < total);
      setSkip(nextSkip + limit);
    } catch (e) {
      setError("Failed to load products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial and whenever filters change: reset & fetch
  useEffect(() => {
    setSkip(0);
    setHasMore(true);
    fetchProducts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, debouncedQuery]);

  const sortedProducts = useMemo(() => {
    const items = [...products];
    switch (sort) {
      case "priceAsc":
        return items.sort((a, b) => a.price - b.price);
      case "priceDesc":
        return items.sort((a, b) => b.price - a.price);
      case "rating":
        return items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return items; // "trending" fallback
    }
  }, [products, sort]);

  const seller = useMemo(
    () => ({
      name: "Valid Vendor",
      initials: "VV",
      tagline: "Quality products. Fast delivery. Great prices.",
      products: Math.max(sortedProducts.length, 24),
      rating: "4.8",
      followers: 12,
    }),
    [sortedProducts.length],
  );

  return (
    <div className="cs-container my-4">
      <StoreHeader seller={seller} />

      <Controls
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        query={query}
        setQuery={setQuery}
        sort={sort}
        setSort={setSort}
        onReset={() => {
          setQuery("");
          setActiveCategory("");
          setSort("trending");
        }}
      />

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {sortedProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}

        {isLoading && sortedProducts.length === 0
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-xl border bg-white"
              >
                <div className="h-40 w-full bg-gray-200" />
                <div className="space-y-2 p-3">
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-100" />
                  <div className="h-4 w-1/3 rounded bg-gray-100" />
                </div>
              </div>
            ))
          : null}
      </div>

      <div className="mt-6 flex items-center justify-center">
        {hasMore && !isLoading ? (
          <button
            onClick={() => fetchProducts(false)}
            className="bg-validGreen rounded-md px-5 py-2 text-sm font-medium text-white hover:bg-lime-500"
          >
            Load more
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Storefront;
