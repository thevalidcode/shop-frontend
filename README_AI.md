# Shop Frontend AI Documentation

## 1. Project Overview
**Purpose**: Customer-facing and admin interface for individual shops. Handles storefront browsing, cart, orders, and admin management features.
**Framework**: Next.js 15 (App Router) + React 19 + Tailwind CSS
**State Management**: React Query (TanStack Query) for server state + Context (AppContext) for app-level state.
**UI Library**: shadcn/ui (Radix-based) with custom components.
**Type**: Frontend Application.

## 2. Directory Structure

| Path | Purpose |
|---|---|
| `app/admin/*` | Admin dashboard routes (product management, orders, analytics). |
| `app/client/*` | Public storefront routes (products, cart, checkout, tracking). |
| `components/` | Reusable React components (ProductCard, Navbar, UI elements). |
| `hooks/` | Custom React hooks for API calls (use-product, use-cart, etc.). |
| `context/` | Global state (AppContext). |
| `lib/` | Utility functions (currency, auth helpers). |
| `types/` | TypeScript type definitions organized by domain. |
| `utils/` | Generic utilities (error normalization, API). |

## 3. Core Concepts

### 3.0 UI Consistency Workflow (Mandatory)

Before adding or changing UI:

1. Review baseline design from the home and pricing experiences in this frontend.
2. Inspect reusable components first:
  - `components/ui/`
  - `components/`
3. Reuse/extend existing components before introducing new ones.
4. Avoid native/raw form controls when a project component already exists for the same control type.

### 3.1 AppContext - Global State
**Location**: `context/appContext.tsx`

Provides:
- `api`: Axios instance preconfigured with auth token/headers.
- `shopId`: Current shop identifier.
- `userInfo`: Authenticated customer (if logged in).
- `adminInfo`: Authenticated shop admin (if logged in).
- `rates`: Currency conversion rates.
- `userCurrency`: User's selected currency.

**Usage**:
```typescript
const { api, shopId, userInfo, adminInfo } = useAppContext();
```

### 3.2 React Query Hooks Pattern
**Location**: `hooks/use-*.tsx`

Each domain (product, cart, order, etc.) has a dedicated hook file.

**Pattern**:
```typescript
// Reads
export const useGetProducts = () => {
  const { api, shopId } = useAppContext();
  return useQuery({
    queryKey: ["products", shopId],
    queryFn: async () => {
      const res = await api.get(`/products/admin/all`);
      return res.data;
    },
    enabled: !!api && !!shopId,
  });
};

// Mutations
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
      toast.success("Product created");
      queryClient.invalidateQueries({ queryKey: ["products", shopId] });
    },
    onError: (error) => {
      const msg = normalizeApiError(error, "Failed");
      toast.error(msg);
    },
  });
};
```

**Key Rules**:
- Every hook depends on `useAppContext()`.
- Cache keys always include `shopId` (tenant isolation).
- Errors are normalized via `normalizeApiError()`.
- Success/error toasts use `sonner` library.
- Cache invalidation on mutation success.

### 3.3 Page Structure
Pages live in `app/admin/*` or `app/client/*`.

**Pattern**:
1. Import hooks for the feature.
2. Manage local state for UI (dialogs, filters).
3. Call hooks to fetch/mutate data.
4. Render components, passing callbacks.

**Example**:
```typescript
export default function AdminProductsPage() {
  const { data: products } = useGetProducts();
  const deleteProduct = useDeleteProduct();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  const handleDelete = async () => {
    await deleteProduct({ uid: selectedProduct.uid });
    setOpenDialog(false);
  };
  
  return (
    <div>
      <ProductGrid
        products={products}
        onDeleteClick={(p) => {
          setSelectedProduct(p);
          setOpenDialog(true);
        }}
      />
      <DeleteConfirmDialog
        open={openDialog}
        onConfirm={handleDelete}
      />
    </div>
  );
}
```

### 3.4 Component Patterns
- **Presentational**: Accept data + callbacks. No hooks.
- **Smart**: Use hooks, manage state.
- **UI Elements**: From `components/ui/` (button, card, dialog, etc.).

### 3.5 Authentication
- **Admin**: JWT stored in cookies. Validated via `authenticateAdmin` middleware.
- **User**: JWT stored in cookies. Validated via `authenticateUser` middleware.
- **Route Protection**: `withAuth()` HOC wraps pages.
  ```typescript
  export default withAuth({
    WrappedComponent: YourPage,
    userType: 'admin',
    excludePaths: ['/signIn'],
  })(YourPageComponent);
  ```

## 4. Feature Implementation Pattern

### New Feature: "Save Favorites"

1. **Backend**: Ensure endpoint exists (`/v1/favorites/*`).
2. **Type**: Define in `types/models/favorite.ts`:
   ```typescript
   export interface Favorite {
     id: number;
     userId: number;
     productUid: string;
     createdAt: string;
   }
   ```
3. **Hook**: Create `hooks/use-favorite.tsx`:
   ```typescript
   export const useGetFavorites = () => {
     const { api, userInfo } = useAppContext();
     return useQuery({
       queryKey: ["favorites", userInfo?.uid],
       queryFn: async () => {
         const res = await api.get(`/favorites`);
         return res.data;
       },
       enabled: !!api && !!userInfo?.uid,
     });
   };
   
   export const useAddFavorite = () => {
     const { api } = useAppContext();
     const queryClient = useQueryClient();
     return useMutation({
       mutationFn: async (productUid: string) => {
         return api.post(`/favorites`, { productUid });
       },
       onSuccess: () => {
         toast.success("Added to favorites");
         queryClient.invalidateQueries({ queryKey: ["favorites"] });
       },
       onError: (error) => {
         toast.error(normalizeApiError(error, "Failed to add"));
       },
     });
   };
   ```
4. **Component**: Use hook in product card or page:
   ```typescript
   const { data: favorites } = useGetFavorites();
   const { mutate: addFavorite } = useAddFavorite();
   
   const isFavorited = favorites?.some(f => f.productUid === product.uid);
   
   <button
     onClick={() => addFavorite(product.uid)}
   >
     {isFavorited ? "★" : "☆"}
   </button>
   ```
5. **Page Integration**: `app/client/favorites/page.tsx` displays list.

## 5. Critical Rules

- **Tenant Isolation**: Every API call passes `shopId` or uses authenticated context.
- **Error Handling**: Always normalize via `normalizeApiError()`.
- **Toast Notifications**: Use `sonner` for user feedback.
- **Type Safety**: No `any` types. Define types in `types/`.
- **Reusability**: Extract common logic into hooks or components.

## 6. Environment & Configuration
- `next.config.ts`: API base URL and SDN configuration.
- `.env.local`: Backend API URL, auth secrets.
- `tsconfig.json`: Path aliases (`@/components`, `@/hooks`, `@/types`).
