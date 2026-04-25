# Copilot Instructions - Shop Frontend

You are working in `shop-frontend`, a Next.js 15 application for shop storefront and admin management.

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19 + Tailwind CSS + shadcn/ui
- **State Management**: React Query (server state) + Context API (global state)
- **Networking**: Axios
- **Notifications**: Sonner (toasts)
- **Routing**: File-system based (App Router)
- **Static Export**: `output: "export"` in next.config.ts (ALL pages are "use client")

## 🏗 Architecture

### Layers
1. **Pages** (`app/admin/*`, `app/client/*`): Route handlers, compose hooks + components.
2. **Hooks** (`hooks/use-*.tsx`): React Query wrappers for API calls.
3. **Components** (`components/`): Reusable, presentational React components.
4. **Context** (`context/appContext.tsx`): Global app state (shop, user, auth, API client).
5. **Types** (`types/`): TypeScript definitions (aligned with backend schemas).

### Data Flow
```
Page → useCustomHook() → React Query → Axios → Backend API → Cache → Component Render
```

## 🚨 Critical Rules

### 0. UI Consistency Pre-Check (Mandatory)
- Before creating new UI, review this frontend's current visual direction on its home and pricing pages.
- Check existing components before creating new controls:
  - `components/ui/`
  - `components/`
- Prefer extending existing components instead of creating duplicates.
- Do not use raw/native control implementations when an existing project component already exists for the same behavior.

### 1. Always Use Hooks, Never Direct API Calls
**WRONG**:
```typescript
// Direct axios call
const res = await api.get(`/products`);
```

**RIGHT**:
```typescript
// Use hook
const { data: products } = useGetProducts();
```

### 2. Tenant Isolation via shopId
Every hook must include `shopId` in:
- Query keys: `["products", shopId]`
- Enabled conditions: `enabled: !!shopId`
- API calls: append to URL if required

```typescript
const { shopId } = useAppContext();
return useQuery({
  queryKey: ["products", shopId],
  queryFn: async () => api.get(`/products?shopId=${shopId}`),
  enabled: !!shopId,
});
```

### 3. Error Handling Pattern
**ALWAYS** normalize errors:
```typescript
import { normalizeApiError } from "@/utils/normalizeApiErrors";

onError: (error: unknown) => {
  const message = normalizeApiError(error, "Default message");
  toast.error(message);
},
```

### 4. Cache Invalidation on Mutation
**ALWAYS** invalidate related caches on success:
```typescript
onSuccess: () => {
  toast.success("Created successfully");
  queryClient.invalidateQueries({ queryKey: ["products", shopId] });
},
```

### 5. Type Safety
- Import types from `@/types`.
- Never use `any`.
- Define new types in `@/types/models/`.

### 6. Component Patterns

**Function Components ONLY**:
```typescript
export default function MyComponent() {
  // ...
}
```

**Hooks in Page Components, Not UI Components**:
```typescript
// GOOD: Page component using hooks
export default function AdminProductsPage() {
  const { data } = useGetProducts();
  return <ProductList products={data} />;
}

// GOOD: UI component receiving props
export function ProductList({ products }: { products: Product[] }) {
  return <div>{products.map(...)}</div>;
}

// BAD: UI component using hooks
export function ProductList() {
  const { data } = useGetProducts(); // ❌ Wrong layer
  return <div>{data.map(...)}</div>;
}
```

### 7. Layout Components - Export Patterns
**CORRECT** - Use default export with withAuth HOC:
```typescript
// ✅ RIGHT
function AdminLayoutComponent({ children }: { children: ReactNode }) {
  return <SidebarProvider>...</SidebarProvider>;
}
export default withAuth({
  WrappedComponent: AdminLayoutComponent,
  userType: "admin"
});
```

**INCORRECT** - Named exports cause Next.js type errors:
```typescript
// ❌ WRONG
export function AdminLayoutComponent() { /* ... */ }
export default withAuth({ ... });
```

## 📋 Feature Implementation Checklist

Adding a new feature (e.g., "Wishlists"):

1. [ ] **Backend Ready**: Verify endpoint exists. `POST /v1/wishlists`, `GET /v1/wishlists`, etc.
2. [ ] **Define Type**: Create `types/models/wishlist.ts`.
3. [ ] **Create Hook**: Create `hooks/use-wishlist.tsx`.
   - Implement `useGetWishlists()`
   - Implement `useAddToWishlist()`
   - Implement `useRemoveFromWishlist()`
4. [ ] **Create Components** (if needed):
   - `components/WishlistToggle.tsx`
   - `components/MyWishlists.tsx`
5. [ ] **Add to Page**:
   - Import hook
   - Import component
   - Bind callbacks
6. [ ] **Test**: Verify CRUD operations work end-to-end.

## 🎨 Styling & UI

- **Framework**: Tailwind CSS.
- **Components**: Use `components/ui/` (shadcn) for primitives.
- **Custom**: Compose custom components in `components/`.
- **Responsiveness**: Mobile-first approach.
- **Dark Mode**: Support via theme-provider (already configured).

## 🔐 Authentication

**Admin Pages**:
```typescript
import withAuth from "@/lib/withAuth";
export default withAuth({
  WrappedComponent: AdminPage,
  userType: "admin",
  excludePaths: ["/signin"],
})(AdminPageComponent);
```

**User Pages**:
```typescript
export default withAuth({
  WrappedComponent: UserPage,
  userType: "user",
})(UserPageComponent);
```

## 📁 File Naming

| Type | Pattern |
|---|---|
| Pages | `page.tsx` (lowercase) |
| Components | `ComponentName.tsx` (PascalCase) |
| Hooks | `use-feature.tsx` (kebab-case) |
| Types | `filename.ts` (kebab-case, organized in `types/models/`) |
| Utilities | `utility-name.ts` (kebab-case) |

## 🚫 Anti-Patterns

- **Do NOT** call `api` directly from components (use hooks).
- **Do NOT** hardcode `shopId` (get from context).
- **Do NOT** use untyped data (use `@/types`).
- **Do NOT** show errors without normalization.
- **Do NOT** forget cache invalidation after mutations.
- **Do NOT** create inline types (define in `types/models/`).
- **Do NOT** export named components from layouts (use default export).

## 🔗 Key Files to Review

- `context/appContext.tsx`: Global state, API client setup, IndexedDB persistence.
- `hooks/use-product.tsx`: Example hook pattern.
- `app/admin/products/page.tsx`: Example admin page (CRUD).
- `app/client/products/page.tsx`: Example public page.
- `components/ProductCard.tsx`: Example component composition.
- `lib/withAuth.tsx`: Auth HOC pattern.
- `utils/normalizeApiErrors.ts`: Error handling pattern.
- `lib/currencyConverter.ts`: Decimal.js for monetary precision.
