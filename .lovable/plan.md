# Enterprise Admin Panel — Build Plan

The current project has mobile-web admin screens under `/admin/*`. This plan pivots the admin into a **desktop-first enterprise dashboard** (Shopify/Stripe/Linear caliber) while keeping the customer-facing mobile web routes untouched. The React Native customer + business apps live outside this repo.

Because the full spec is enormous (~200 screens), I'll deliver in **phased waves** rather than one giant unusable dump. This plan covers Wave 1 + scaffolding for all 10 modules. Subsequent waves deepen each module.

## Scope decisions

- **Desktop-first** with responsive tablet breakpoints. Mobile admin views become secondary (existing `/admin/mobile` stays as a compact variant, not the default).
- **Frontend-only, mock data.** No Lovable Cloud / auth / DB in this wave — data comes from `src/lib/mock-data.ts` extended per module. We can wire real backend later; the API shapes are designed to map cleanly to a future REST/RPC layer.
- **Router:** keep TanStack Router (Lovable stack requirement). The user asked for React Router; I'll explain in chat that TanStack Router is fixed on this stack but the DX is equivalent.
- **Libraries added:** `@tanstack/react-table`, `recharts`, `framer-motion`, `react-hook-form`, `zod`, `react-dropzone`, `react-hot-toast`, `date-fns`. (shadcn, Tailwind, TanStack Query already present.)

## Wave 1 — Foundation + navigable shell (this delivery)

### 1. Shared layout & primitives
- `src/components/admin/AdminShell.tsx` — collapsible shadcn Sidebar + top bar (global search, notifications, workspace switcher, user menu, breadcrumbs).
- `src/components/admin/PageHeader.tsx` — title, breadcrumb, description, action slot.
- `src/components/admin/StatCard.tsx` — KPI card with delta + sparkline.
- `src/components/admin/DataTable.tsx` — generic TanStack Table wrapper: column defs, sort, filter, pagination, row selection, bulk action bar, column visibility, CSV export.
- `src/components/admin/FilterBar.tsx` — chip filters + saved views.
- `src/components/admin/EmptyState.tsx`, `TableSkeleton.tsx`, `ConfirmDialog.tsx`, `SidePanel.tsx` (Sheet wrapper), `SectionCard.tsx`.
- `src/components/admin/charts/*` — `AreaChart`, `BarChart`, `LineChart`, `DonutChart`, `Heatmap` — thin Recharts wrappers using design tokens.

### 2. Layout route
- Convert `src/routes/admin.tsx` from redirect into a **layout route** rendering `<AdminShell><Outlet /></AdminShell>`.
- Redirect old mobile shell routes: `/admin/mobile` → `/admin` dashboard.

### 3. Wave 1 desktop screens (10 modules — dashboard + list for each)
Each module gets a rich desktop dashboard and a list view in Wave 1. Detail/create/edit/analytics/settings sub-screens land in Wave 2–3.

```
/admin                    Executive dashboard (KPIs, revenue chart, live orders, AI insights, quick actions, system health)
/admin/orders             Orders list (advanced table, filters, bulk actions, export)
/admin/orders/$id         Order detail (timeline, items, customer, payment, shipping, notes)
/admin/products           Products grid+list toggle
/admin/products/$id       Product detail
/admin/inventory          Inventory dashboard + SKU table (low-stock, forecast)
/admin/customers          Customer directory + segments
/admin/customers/$id      Customer 360 (already partial)
/admin/promotions         Campaigns/coupons dashboard
/admin/analytics          Analytics hub (revenue/orders/customers tabs)
/admin/banners            Banner CMS list + preview
/admin/notifications      Notification center + templates
/admin/ai                 AI control center (agents, prompts, usage)
/admin/settings           Settings hub landing
```

### 4. Design system pass
- Extend `src/styles.css` with additional neutrals, chart palette, table row states, focus rings — keep the existing Warm Sand + Sage direction, just add depth for dense enterprise UI.
- Add `Syne`/`Plus Jakarta Sans` already loaded; no font change.

### 5. Mock data expansion
`src/lib/mock-data.ts` gains: orders (50+), customers (30+), inventory movements, promo campaigns, analytics time series, banner records, notification templates, AI agents, audit log entries.

## Wave 2 (next delivery, on your go)
- Create/Edit forms (react-hook-form + zod) for products, inventory, promos, banners, notifications, AI agents.
- Detail deep-dives: variants, media library w/ dropzone, pricing rules, order refund/return flows.
- Analytics: cohorts, funnels, retention, geography heatmap, exports.
- Administration module: users, roles, permissions, audit log, API keys, integrations.

## Wave 3
- Bulk import/export (CSV parsing), print/PDF (invoices/labels), scheduled reports, A/B testing UI, prompt sandbox, feature flags, maintenance mode, backup/restore UI.

## Technical notes

- All new routes under `src/routes/admin.*.tsx` using TanStack file-based routing; each defines its own `head()` metadata.
- `DataTable<TData>` is generic and column-driven — every list view is ~30 lines of column defs + hooks.
- Charts use CSS-variable colors so light/dark theming stays consistent.
- No auth wall yet; when Lovable Cloud is enabled later, wrap `/admin` layout with a role gate.
- The existing customer mobile-web routes (`/`, `/home`, `/cart`, etc.) are untouched.

## Deliverable in this wave

Approve and I'll ship: shell + primitives + DataTable + 10 module landings (dashboard/list) + updated mock data + design token pass. Expect ~25–30 new/changed files. After that, tell me which module to deepen first and I'll run Wave 2 on that module.
