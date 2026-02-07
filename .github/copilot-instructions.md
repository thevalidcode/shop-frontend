# AI Coding Agent Instructions

## Architecture Overview
This is a **static-export multi-tenant e-commerce SaaS** built with Next.js 15 app router. Three distinct sections serve different user types:
- **Public landing** (`app/(root)`) - Marketing pages, auth flows (public access)
- **Client dashboard** (`app/client`) - User order management, account, wallet (auth required except `/client/faq`, `/client/blog`, `/client/api-docs`)
- **Admin panel** (`app/admin`) - Shop configuration, analytics, user/order/product management (admin auth required)

### Critical Architectural Patterns
- **Client-side rendered** - `output: "export"` in `next.config.ts` means ALL pages are `"use client"` with NO server components
- **Route groups** - Use `(root)`, `(no-layout)` for logical separation without URL paths
- **Multi-tenancy** - Every data fetch includes `shopId` from `appContext`; stored in localStorage
- **Auth persistence** - User state persisted to **IndexedDB** (`idb-keyval`) NOT localStorage (see `context/appContext.tsx:96-110`)
- **Currency precision** - ALL monetary calculations use `Decimal.js` to prevent floating-point errors (see `lib/currencyConverter.ts`)

## Authentication & Authorization
**Layout-level protection pattern** - NEVER export named components from Next.js layouts:
```tsx
// ✅ CORRECT - Internal component, wrapped default export
function AdminLayoutComponent({ children }: { children: ReactNode }) {
  return <SidebarProvider>...</SidebarProvider>;
}
export default withAuth({
  WrappedComponent: AdminLayoutComponent,
  userType: "admin"
});

// ❌ WRONG - Named export causes Next.js type errors
export function AdminLayoutComponent() { /* ... */ }
export default withAuth({ ... });
```

Auth flow details:
- `withAuth` HOC checks `userInfo`/`adminInfo` from `appContext`, redirects to `/auth/signin` or `/admin/auth/signin`
- During auth loading, shows `<Loading />` component
- `excludePaths` array bypasses auth for specific routes (e.g., FAQ, blog)
- Auth state auto-saved to IndexedDB on changes (`appContext.tsx:112-120`)

## Data Fetching with React Query
Every hook follows this pattern:
```tsx
export const useCreateProduct = () => {
  const { api, shopId } = useAppContext();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ["createProduct"],
    mutationFn: async (data) => {
      const res = await api.post(`/products`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["products", shopId] });
    },
    onError: (error) => {
      const errorMsg = normalizeApiError(error, "Default message");
      toast.error(errorMsg);
    },
  });
};
```

**Key rules:**
- Query keys MUST include `shopId`: `["products", shopId]`
- Mutations MUST invalidate related queries
- Use `normalizeApiError` from `/utils/normalizeApiErrors.ts` for consistent error handling
- Always show toast feedback (import from `sonner`)
- Enable queries with: `enabled: !!api && !!shopId`

## Component & UI Patterns
- **shadcn/ui with CVA** - All UI components in `/components/ui` use `cva` for type-safe variants
- **Memoization** - Wrap heavy components (sidebars, complex forms) in `memo()` to prevent re-renders
- **Layout structure** - Admin/client layouts use `<SidebarProvider><MemoizedSidebar /><SidebarInset><TopNav /><Wrapper>...</Wrapper></SidebarInset></SidebarProvider>`
- **Wrapper component** - Use `<Wrapper className="max-w-[90rem]">` for consistent max-width containers

### UI Development Workflow
**CRITICAL: Study existing patterns before creating new components**
1. **Search extensively** - Check `/components` and `/app/**/components` for similar UI patterns
2. **Reuse first** - If a component exists, use it directly (Button, Card, Dialog, etc.)
3. **Extract and expand** - If similar logic exists inline, move it to a reusable component in `/components`
4. **Match patterns** - New components should follow existing structure, styling, and animation patterns
5. **Check layout files** - Admin/client layouts show sidebar, nav, and wrapper patterns to follow

Example: Before creating a new modal, check existing Dialog usage in admin/client pages. Before custom cards, see how Card component is used throughout the codebase.

## File Organization & Type Safety
```
/types/models/*.ts     - Domain models (Product, User, Order, etc.)
/types/index.ts        - Re-exports for convenient imports
/hooks/use-*.tsx       - React Query hooks (one per domain)
/lib/*                 - Pure functions (auth, currency, helpers)
/context/*             - Global state (appContext only)
/components/ui/*       - shadcn/ui components
/app/**                - Next.js routes (all client-side)
```

Reference `API_ROUTES.md` and `API_SCHEMAS_AND_TYPES.md` for backend contract when creating new hooks.

## Development Workflow
```bash
npm run dev        # Start dev server (port 3000)
npm run build      # Static export to /out directory
npm run lint       # ESLint check
npm run typecheck  # TypeScript validation (no build)
```

**No test suite configured** - Manual testing in browser. Use React Query Devtools (enabled in `provider/queryProvider.tsx`) and network tab for debugging.

## Currency & Multi-Currency System
- User currency stored in localStorage as `userCurrency` (defaults to auto-detected from timezone)
- Live rates fetched on app load, stored in `appContext.rates`
- Use `useCurrencyConverter()` hook or `convertCurrency()` from `/lib/currencyConverter.ts`
- ALWAYS use `Decimal.js` for monetary math: `new Decimal(price).mul(quantity)`

## Theming System
**Dynamic theme switching** allows shop owners to customize branding:
- **CSS Variables** - All colors defined in `app/globals.css` as CSS custom properties
- **OKLCH color space** - Using modern color format for better perceptual uniformity
- **Light/Dark modes** - Managed by `next-themes` with `useTheme()` hook
- **Admin customization** - Shop owners configure themes in `app/admin/settings` (Branding & Theme tab)
- **Runtime application** - Themes applied via injected `<style>` tags (`applyThemeStyles()` in `branding-theme.tsx`)

Key theme variables structure:
```css
:root {
  --background, --foreground, --primary, --primary-foreground,
  --secondary, --muted, --accent, --destructive, --border, --input, --ring
}
.dark {
  /* Same variables with dark values */
}
```

Access current theme: `const { theme } = useTheme()` (returns "light" or "dark")
Apply custom brand colors: Use `useThemeContext()` from `app/providers/theme-provider.tsx`

## Common Pitfalls
1. **Next.js layouts** - Only export `default`, no named exports (causes TypeScript errors)
2. **Static export limitations** - No `getServerSideProps`, no API routes, no server components
3. **Auth state** - Lives in IndexedDB, not localStorage (see appContext)
4. **shopId requirement** - Most queries fail without it; check `enabled: !!shopId`
5. **Client directive** - Every page/layout needs `"use client"` at top

## Key Files for Reference
- [context/appContext.tsx](context/appContext.tsx) - Global state, auth, API client setup, currency detection
- [lib/withAuth.tsx](lib/withAuth.tsx) - HOC pattern for protected routes
- [hooks/use-product.tsx](hooks/use-product.tsx) - Data fetching example with full mutation/query pattern
- [lib/currencyConverter.ts](lib/currencyConverter.ts) - Decimal.js precision handling
- [app/layout.tsx](app/layout.tsx) - Provider nesting order (QueryProvider → AppProvider → ThemeProvider)</content>
<parameter name="filePath">/Users/mac/Documents/Projects/Shop/.github/copilot-instructions.md