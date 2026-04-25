# Frontend Architecture & Development Guide

## Overview
The `shop-frontend` is a Next.js 15 application serving as the public storefront and admin dashboard for individual shops. It follows a clear separation between customer-facing pages (`/client`) and admin pages (`/admin`).

## Core Principles

1. **React Query for Server State**: All API calls go through custom hooks using TanStack Query.
2. **AppContext for App State**: Global shop, user, and admin data.
3. **Component-Driven UI**: Reusable components with shadcn/ui foundation.
4. **Type-Safe**: All data flows are strictly typed.

## Page Routing

### Admin Routes (`app/admin/*`)
- `/dashboard` - Analytics and overview.
- `/products` - Product management (CRUD).
- `/orders` - Order management and fulfillment.
- `/categories` - Category management.
- `/blogs` - Blog/content management.
- `/faqs` - FAQ management.
- `/users` - Customer user management.
- `/shipping` - Shipping settings and tracking.
- `/support` - Support tickets.
- `/analytics` - Revenue, traffic analytics.
- `/settings` - Shop configuration.
- `/profile` - Admin profile.

### Client Routes (`app/client/*`)
- `/` - Products listing/storefront.
- `/products` - Detailed product browsing.
- `/checkout` - Shopping cart and checkout.
- `/orders` - Customer order history.
- `/orders/:id` - Order details and tracking.
- `/profile` - Customer account management.

## Data Flow Pattern

### Read Flow (Customer Views Products)
```
Page (client/products)
  ↓
useGetProductsPublic() hook
  ↓
AppContext.api (axios instance)
  ↓
Backend: GET /v1/products?shopId=X
  ↓
Response: Product[]
  ↓
React Query cache
  ↓
Component render
```

### Write Flow (Admin Creates Product)
```
Page (admin/products)
  ↓
useCreateProduct() hook (mutation)
  ↓
User submits form
  ↓
mutate({ name, price, ... })
  ↓
Backend: POST /v1/products
  ↓
Success: toast + cache invalidate
  ↓
Component re-renders with new data
```

## Hook Naming Conventions

| Pattern | Usage |
|---------|-------|
| `useGet{Resource}` | Fetch (query). |
| `useGet{Resource}ByUid` | Fetch by ID (query). |
| `useCreate{Resource}` | Create (mutation). |
| `useUpdate{Resource}` | Update (mutation). |
| `useDelete{Resource}` | Delete (mutation). |

**Example hooks**:
- `useGetProducts()` - Fetch all.
- `useGetProductByUid(uid)` - Fetch one.
- `useCreateProduct()` - Create.
- `useUpdateProduct()` - Update.
- `useDeleteProduct()` - Delete.

## Component Structure

### UI Components (`components/ui/`)
Directly from shadcn. Low-level: Button, Card, Dialog, etc.

### Feature Components (`components/`)
Composed from UI components. Mid-level: ProductCard, Navbar, ReviewsSection.

### Page Components (`app/admin/*`, `app/client/*`)
Use feature components. Handle routing, state management.

## State Management

### Global (AppContext)
- `shopId`, `userInfo`, `adminInfo`
- `api` instance
- `userCurrency`, `rates`

### Local (useState)
- Dialog open/close states
- Filter selections
- Form data

### Server (React Query)
- Fetched resources (products, orders, etc.)
- Updated via mutations

## Authentication

Two separate auth flows:

**Admin**:
- Login at `/admin/auth/signin`
- Session stored in cookies
- Protected by `withAuth({ userType: 'admin' })`
- Accesses `adminInfo` from context

**Customer**:
- Login at `/auth/signin` or signup
- Session stored in cookies
- Protected by `withAuth({ userType: 'user' })`
- Accesses `userInfo` from context

## Error Handling

All API errors go through `normalizeApiError()`:
- Handles Axios errors
- Extracts Zod validation errors
- Returns user-friendly message
- Toast shown via `onError` hook callback

## Currency & Localization

- `rates`: Fetched from backend, stored in AppContext.
- `userCurrency`: Selected by user, persisted in localStorage.
- `convertCurrency()`: Utility to convert prices.

## Socket.IO (Real-time)

If implemented:
- Support ticket live updates
- Order status notifications
- Connected in AppProvider

## Development Workflow

1. **Identify Feature**: e.g., "Add Product Tags".
2. **Check Backend**: Ensure endpoint exists.
3. **Create Types**: `types/models/tag.ts`.
4. **Create Hook**: `hooks/use-tag.tsx`.
5. **Create Component**: `components/TagInput.tsx`.
6. **Add to Page**: `app/admin/products/components/ProductForm.tsx`.
7. **Test**: Manual + automated tests.
8. **Deploy**: `npm run build` + deploy.
