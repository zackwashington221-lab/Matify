# Freshly API — Express + MongoDB

Standalone backend for both clients:

- **Admin panel** (React + Vite, `/` of this repo)
- **Mobile app** (React Native Expo, `mobile/`)

## Run locally

```bash
cd server
cp .env.example .env      # set MONGODB_URI + JWT_SECRET
npm install
npm run seed              # safely loads demo catalog, orders, customers, staff into an empty database
npm run dev               # http://localhost:4000/api
```

`npm run seed` never overwrites existing data. For a local-only full replacement of the
demo data, run `npm run seed:reset` explicitly.

Seeded admin login: `amara@freshly.io` / `Password123!`

### Team invite email

Team invitations run in safe Ethereal test mode by default (`SMTP_TEST_MODE=true`).
The API logs a preview URL for each invite and no real recipient receives the email.
For a later production deployment only, set `SMTP_TEST_MODE=false` and add
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` to
`server/.env`. Set `ADMIN_APP_URL` to the URL where admins complete their invitation.

## Conventions

- All routes are under `/api`.
- Auth: `Authorization: Bearer <jwt>`; roles = Owner, Admin, Ops Manager, Support, Analyst, Read only, Customer.
- List endpoints accept `?page=&limit=&sort=&q=` plus resource filters and return
  `{ data, page, limit, total, pages }`.
- Every write goes through the generic CRUD layer, which appends an entry to the audit log.

## Endpoints

| Area | Routes |
| --- | --- |
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `PATCH /auth/me`, `POST /auth/change-password` |
| Storefront (public) | `GET /storefront/categories`, `/products`, `/products/:slug`, `/banners`, `/promotions` |
| Products | `GET/POST /products`, `GET/PATCH/DELETE /products/:id` |
| Categories | `/categories` CRUD |
| Inventory | `/inventory` CRUD, `GET /inventory/low-stock`, `POST /inventory/:id/adjust`, `POST /inventory/:id/reorder`, `GET /inventory/:id/movements` |
| Orders | `/orders` CRUD, `POST /orders/checkout`, `GET /orders/mine`, `POST /orders/:id/status`, `POST /orders/:id/refund`, `GET /orders/stats/summary` |
| Returns | `/returns` CRUD |
| Customers | `/customers` CRUD |
| Promotions | `/promotions` CRUD |
| Banners | `/banners` CRUD |
| Notifications | `/notifications` CRUD |
| Analytics | `/analytics/kpis`, `/revenue-series`, `/top-products`, `/category-mix`, `/funnel`, `/cohorts`, `/promotion-performance` |
| Reports | `/reports` CRUD |
| AI | `/ai/agents` CRUD, `/ai/runs` CRUD |
| Administration | `/team`, `/roles`, `/api-keys`, `/integrations`, `/settings` CRUD, `GET /audit` |

## Wiring the admin panel

Set `VITE_API_URL=http://localhost:4000/api` and use `src/lib/api-client.ts`,
which mirrors every endpoint above. Screens currently render mock data from
`src/lib/admin-mock.ts`; swap a screen over by replacing the mock import with the
matching `api.*` call.
